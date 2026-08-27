#!/usr/bin/env node
// Behavior tests for games/toys/pacman.txt.
// The harness drives _tick directly (no test key in binds, decision D14).
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const harness = require(path.join(root, 'node_harness.js'));

const { data } = harness.compileGameJson(root, 'games/toys/pacman.txt');
let failures = 0;

// Pinned PRNG (decision D17): Mulberry32, seed normalized with >>> 0.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ctx(seed) {
  const { context } = harness.createRuntime(root, data, {
    userAgent: 'pacman-tests', level: 0, random: mulberry32(seed == null ? (Number(process.env.PACMAN_SEED) || 1) : seed),
  });
  return context;
}

// D17 known-output vector: first three floats for seed 1.
{
  const rng = mulberry32(1);
  const vec = [rng(), rng(), rng()].map((v) => v.toFixed(9));
  const expected = ['0.627073941', '0.002735721', '0.527447040'];
  if (vec.join() !== expected.join()) {
    console.log(`FAIL mulberry32 test vector: ${vec} != ${expected}`);
    failures++;
  } else {
    console.log('PASS mulberry32 test vector');
  }
}
const tick = (c) => vm.runInContext('applyRule(rules_dict["_tick"])', c);
const command = (c, name) => vm.runInContext(
  `applyRule(rules_dict[${JSON.stringify(name)}])`, c);
const rows = (c) => harness.getBoard(c);
const edit = (c, changes) => {
  const b = rows(c).map((r) => r.split(''));
  for (const [r, col, ch] of changes) b[r][col] = ch;
  harness.setBoard(c, b.map((r) => r.join('')));
};
function report(ok, name, detail) {
  if (ok) console.log(`PASS ${name}`);
  else { failures++; console.log(`FAIL ${name}: ${detail}`); }
}

// --- movement: buffer, turn, wall stop ---------------------------------
{
  const c = ctx();
  harness.gameAction(c, 'a');           // queue west; movement only on tick
  const before = rows(c)[23];
  report(rows(c)[23] === before, 'keys only buffer', 'key moved the board');
  tick(c);
  report(rows(c)[23][12] === 'P' && rows(c)[23][13] === '-',
         'pacman moves on tick', rows(c)[23]);
  for (let i = 0; i < 15; i++) tick(c);
  report(rows(c)[23][6] === 'P',
         'pacman stops at wall', rows(c)[23]);
}

// --- tunnel wrap -------------------------------------------------------
{
  const c = ctx();
  edit(c, [[23, 13, '-'], [14, 2, 'P']]);
  vm.runInContext('board[34] = "%{-}w^1---------------------"', c); // heading west
  tick(c); tick(c); tick(c);
  report(rows(c)[14][27] === 'P',
         'tunnel wraps westward', rows(c)[14]);
}

// --- one-way door ------------------------------------------------------
{
  const c = ctx();
  for (let i = 0; i < 5; i++) tick(c);
  // K is released at the first epoch, then hops over the west door.
  report(rows(c)[11].includes('K') && !rows(c)[13].includes('K'),
         'ghost hops out over the door', rows(c)[8] + ' / ' + rows(c)[14]);
  report(rows(c)[35][4] === 'n', 'hop sets heading north', rows(c)[35]);
}
{
  const c = ctx();
  // Pacman parked below the door approach cannot pass '=' (not in `open`).
  edit(c, [[23, 13, '-'], [11, 13, 'P'], [11, 12, '-']]);
  vm.runInContext('board[34] = "%{s}s^1---------------------"', c);
  tick(c); tick(c);
  report(rows(c)[11][13] === 'P', 'pacman cannot enter the door', rows(c)[11]);
}

// --- speed valve: normal ghost sits out phase 4 ------------------------
{
  const c = ctx();
  // Isolated R on a long empty corridor heading east; phase starts 1.
  edit(c, [[11, 13, '-'], [13, 13, '-'], [13, 14, '-'], [14, 13, '-'],
           [5, 2, 'R']]);
  vm.runInContext('board[35] = "%(e)n[n]n-------------------"', c);
  for (let i = 0; i < 4; i++) tick(c);
  // Normal ghosts run at full speed since the maze redraw rebalance
  // (frightened ghosts keep the 2-of-4 valve, tested separately).
  report(rows(c)[5][6] === 'R', 'normal ghost moves every tick', rows(c)[5]);
}

// --- carried tile: pick up, carry, drop --------------------------------
{
  const c = ctx();
  edit(c, [[11, 13, '-'], [13, 13, '-'], [13, 14, '-'], [14, 13, '-'],
           [5, 2, 'R'], [5, 3, '.'], [5, 4, '.']]);
  vm.runInContext('board[35] = "%(e)n[n]n-------------------"', c);
  tick(c);
  const reg1 = rows(c)[36];
  report(rows(c)[5][2] === '-' && rows(c)[5][3] === 'R' && reg1.slice(1, 4) === '!1.',
         'ghost picks up a dot into its register', rows(c)[5] + ' / ' + reg1);
  tick(c);
  report(rows(c)[5][3] === '.' && rows(c)[5][4] === 'R',
         'ghost drops the carried dot behind it', rows(c)[5]);
}

// --- collisions --------------------------------------------------------
{
  const c = ctx();  // pacman walks into a normal ghost
  edit(c, [[23, 13, '-'], [5, 2, 'P'], [5, 3, 'R'], [11, 13, '-'],
           [13, 13, '-'], [13, 14, '-'], [11, 13, '-']]);
  vm.runInContext('board[34] = "%{-}e^1---------------------"', c);
  vm.runInContext('board[35] = "%(n)n[n]n-------------------"', c);
  tick(c);
  // The ghost may take its own move afterward; the contract is the
  // in-place death and the ghost surviving the collision.
  report(rows(c)[5][2] === 'X' && rows(c)[5].includes('R'),
         'pacman entering a ghost dies in place', rows(c)[5]);
  report(!harness.levelComplete(c), 'X blocks completion', 'complete after death');
}
{
  const c = ctx();  // ghost walks into pacman
  edit(c, [[23, 13, '-'], [5, 2, 'R'], [5, 3, 'P'], [11, 13, '-'],
           [13, 13, '-'], [13, 14, '-'], [11, 13, '-']]);
  vm.runInContext('board[35] = "%(e)n[n]n-------------------"', c);
  tick(c);
  report(rows(c)[5][3] === 'X' && rows(c)[5][2] === 'R',
         'ghost entering pacman kills in place', rows(c)[5]);
}
{
  const c = ctx();  // pacman eats a frightened ghost carrying a dot
  edit(c, [[23, 13, '-'], [5, 2, 'P'], [5, 3, 'q'], [11, 13, '-'],
           [13, 13, '-'], [13, 14, '-'], [11, 13, '-']]);
  vm.runInContext('board[34] = "%{-}e^1---------------------"', c);
  vm.runInContext('board[36] = "%!1.!2-!3-!4----------------"', c);
  tick(c);
  report(rows(c)[5][3] === 'P' && rows(c)[5][2] === '-',
         'pacman advances onto the eaten ghost in the same tick', rows(c)[5]);
  report(rows(c)[31].startsWith('score:000210'),
         'ghost chain and carried dot both score', rows(c)[31]);
  report(rows(c)[36].slice(1, 4) === '!1-',
         'eaten ghost register resets', rows(c)[35]);
}

// --- direct completion -------------------------------------------------

// --- scoring and frightened mode ---------------------------------------
{
  const c = ctx();
  edit(c, [[23, 13, '-'], [5, 2, 'P'], [5, 3, '.'], [11, 13, '-'],
           [13, 13, '-'], [13, 14, '-'], [11, 13, '-']]);
  vm.runInContext('board[34] = "%{-}e^1---------------------"', c);
  tick(c);
  report(rows(c)[31].startsWith('score:000010'),
         'dot scores 10', rows(c)[31]);
}
{
  const c = ctx();
  edit(c, [[23, 13, '-'], [5, 2, 'P'], [5, 3, 'O'], [11, 13, '-'],
           [4, 8, 'R']]);
  vm.runInContext('board[34] = "%{-}e^1---------------------"', c);
  tick(c);
  report(rows(c)[31].startsWith('score:000050'),
         'energizer scores 50', rows(c)[31]);
  report(rows(c).some((r) => r.includes('q')) && rows(c)[37].includes('~9'),
         'energizer starts frightened mode immediately', rows(c)[5] + ' / ' + rows(c)[37]);
}
{
  const c = ctx();
  edit(c, [[23, 13, '-'], [5, 2, 'q'], [11, 13, '-']]);
  vm.runInContext('board[35] = "%(e)n[n]n-------------------"', c);
  vm.runInContext('board[37] = "%<1>0&0+--~9----------------"', c);
  for (let i = 0; i < 4; i++) tick(c);
  report(rows(c)[5][4] === 'q',
         'frightened ghost moves 2 cells in 4 ticks', rows(c)[5]);
}
{
  const c = ctx();
  edit(c, [[23, 13, '-'], [5, 2, 'P'], [5, 3, 'q'], [11, 13, '-']]);
  vm.runInContext('board[34] = "%{-}e^1---------------------"', c);
  vm.runInContext('board[37] = "%<1>0&0+--~9----------------"', c);
  tick(c);
  report(rows(c)[31].startsWith('score:000200') && rows(c)[37].includes('&1'),
         'first frightened ghost scores 200 and arms chain', rows(c)[31] + ' / ' + rows(c)[37]);
}

// --- release, modes, lives, and pause ----------------------------------
{
  const c = ctx();
  for (let i = 0; i < 4; i++) tick(c);
  report(rows(c)[37].includes('<2>1') && rows(c)[13].includes('K'),
         'first epoch advances mode and releases K', rows(c)[10] + ' / ' + rows(c)[37]);
  for (let i = 0; i < 8; i++) tick(c);
  report(rows(c).some((r) => r.includes('I')) && rows(c).some((r) => r.includes('C')),
         'later epochs release I and C', rows(c)[37]);
}
{
  const c = ctx();
  edit(c, [[23, 13, '-'], [5, 2, 'P'], [5, 3, 'R'], [11, 13, '-']]);
  vm.runInContext('board[34] = "%{-}e^1---------------------"', c);
  tick(c);
  report(rows(c)[32].startsWith('lives:**-') && rows(c)[37].includes('+33'),
         'death consumes a life and starts pause', rows(c)[32] + ' / ' + rows(c)[37]);
  tick(c); tick(c); tick(c);
  report(rows(c).some((r) => r.includes('P')) && rows(c)[37].includes('+--'),
         'three pause ticks restore Pacman', rows(c)[37]);
}
{
  const c = ctx();
  edit(c, [[23, 13, '-'], [5, 12, 'R'], [4, 12, 'P'], [5, 13, '#'], [11, 13, '-']]);
  vm.runInContext('board[34] = "%{-}-^1---------------------"', c);
  vm.runInContext('board[35] = "%(e)n[n]n-------------------"', c);
  tick(c);
  report(rows(c)[4][12] === 'X',
         'ghost turning onto Pacman kills', rows(c)[3] + ' / ' + rows(c)[5]);
}

// --- personality steering writes only the four heading registers -------
function personalityCase(actor, pac, expected, name, actorPos, headings) {
  const c = ctx();
  harness.setBoard(c, rows(c).map((r) => r.replace(/[PRKICkjp]/g, '-')));
  edit(c, [[...(actorPos || [5, 2]), actor], [pac[0], pac[1], 'P']]);
  vm.runInContext('board[34] = "%{-}e^1---------------------"', c);
  vm.runInContext(`board[35] = ${JSON.stringify(headings || '%(n)n[n]n-------------------')}`, c);
  vm.runInContext('board[37] = "%<5>4&0+--~0----------------"', c);
  tick(c);
  report(expected.test(rows(c)[35]), name, rows(c)[35]);
}
personalityCase('R', [5, 8], /\(e/, 'R directly closes on Pacman');
personalityCase('K', [5, 8], /\)e/, 'K cuts along Pacman heading');
// I sits where both pursuit axes are open, so whichever axis the
// seeded RANDOM picks, the mover cannot overwrite the aim.
// I starts heading east so neither pursuing axis (e or s) is his
// reverse: the aim_i never-reverse guard then cannot silently decline.
personalityCase('I', [8, 8], /\[[es]/, 'I selects a pursuing axis', [5, 6],
                '%(n)n[e]n-------------------');
personalityCase('C', [5, 4], /\]w/, 'C retreats when Pacman is near');

// --- audit 025 ports: seam targeting, Clyde radius, scatter, clear HUD --
{
  const cases = [
    ['R', '(', 'choose_r', 'e'],
    ['K', ')', 'choose_k', 'e'],
    ['I', '[', 'choose_i', 'e'],
    // Clyde at the right seam runs west, away from Pacman at the left seam.
    ['C', ']', 'choose_c', 'w'],
  ];
  for (const [actor, marker, chooser, expected] of cases) {
    const c = ctx(1);
    harness.setBoard(c, rows(c).map((r) => r.replace(/[PRKICkjp]/g, '-')));
    edit(c, [[14, 0, 'P'], [14, 27, actor]]);
    vm.runInContext('board[34] = "%{-}n^1---------------------"', c);
    vm.runInContext('board[35] = "%(n)n[n]n-------------------"', c);
    vm.runInContext('board[37] = "%<5>4&0+--~0----------------"', c);
    command(c, chooser);
    const register = rows(c)[35];
    report(register[register.indexOf(marker) + 1] === expected,
           `${actor} targets correctly across the tunnel seam`, register);
  }
}
{
  const c = ctx(1);
  harness.setBoard(c, rows(c).map((r) => r.replace(/[PRKICkjp]/g, '-')));
  // This diagonal adjacency was absent from the old axis-only test.
  edit(c, [[5, 5, 'C'], [6, 6, 'P']]);
  report(command(c, 'c_near_p'), 'C is shy at diagonal proximity',
         rows(c)[5] + ' / ' + rows(c)[6]);
}
{
  const cases = [
    ['R', '(', 'choose_r', 'n'],
    ['K', ')', 'choose_k', 'n'],
    ['I', '[', 'choose_i', 's'],
    ['C', ']', 'choose_c', 's'],
  ];
  for (const [actor, marker, chooser, expected] of cases) {
    const c = ctx(1);
    harness.setBoard(c, rows(c).map((r) => r.replace(/[PRKICkjp]/g, '-')));
    // Give every preference an open junction; the first direction is the
    // identity's corner bias, not an artifact of the physical mover.
    edit(c, [[4, 5, '-'], [5, 4, '-'], [5, 5, actor], [5, 6, '-'], [6, 5, '-'],
             [23, 13, 'P']]);
    vm.runInContext('board[35] = "%(e)e[e]e-------------------"', c);
    vm.runInContext('board[37] = "%<1>4&0+--~0----------------"', c);
    command(c, chooser);
    const register = rows(c)[35];
    report(register[register.indexOf(marker) + 1] === expected,
           `${actor} keeps its corner-biased scatter order`, register);
  }
}
{
  const c = ctx(1);
  const cleared = rows(c).map((r) => r.replace(/[.O]/g, '-'));
  harness.setBoard(c, cleared);
  command(c, 'check_clear');
  report(rows(c)[33].startsWith('status:maze-clear'),
         'direct completion updates the maze-clear HUD', rows(c)[33]);
}

// Visible HUD text must not alias frightened actors or carried-floor marks.
{
  const c = ctx();
  const hud = rows(c).slice(31, 34).join('\n');
  report(!/[qxzb!]/.test(hud), 'HUD avoids actor/register characters', hud);
  // Any CHARMAP'd character inside visible HUD text would render as its
  // glyph ("Mives" instead of "lives"), so the remapped alphabet and the
  // HUD alphabet must stay disjoint.
  const remapped = Object.keys(data.charMap).filter((ch) => data.charMap[ch] !== ch);
  const leaking = remapped.filter((ch) => hud.replace(/_/g, '').includes(ch));
  report(leaking.length === 0, 'HUD text avoids all remapped characters',
         `leaks: ${leaking.join(' ')}`);
}

{
  const c = ctx();
  // Clear every dot/pellet and the ghosts; carried registers empty.
  const b = rows(c).map((r) => r.replace(/[.O]/g, '-').replace(/[RKIC]/g, '-'));
  harness.setBoard(c, b);
  report(harness.levelComplete(c), 'clear board completes directly', 'not complete');
  // One dot carried in a register (visible to VOID `.`) blocks the win.
  vm.runInContext('board[36] = "%!1.!2-!3-!4----------------"', c);
  report(!harness.levelComplete(c), 'register-carried dot blocks completion',
         'completed with carried dot');
}

// --- audit 025 ports: frightened contact, round reset ------------------
{
  const c = ctx();  // frightened ghost walking into pacman is eaten, not lethal
  edit(c, [[23, 13, '-'], [5, 3, 'P'], [5, 2, 'q'], [11, 13, '-']]);
  vm.runInContext('board[34] = "%{-}-^1---------------------"', c);  // phase -> 1 after clock? starts 1
  vm.runInContext('board[35] = "%(e)n[n]n-------------------"', c);
  vm.runInContext('board[37] = "%<1>3&0+--~5----------------"', c);
  let eaten = false;
  for (let i = 0; i < 4; i++) {
    tick(c);
    if (!rows(c).slice(0, 31).some((r) => r.includes('q'))) { eaten = true; break; }
  }
  const alive = rows(c).slice(0, 31).some((r) => r.includes('P'));
  report(eaten && alive, 'frightened ghost entering pacman is eaten',
         rows(c)[5] + ' / ' + rows(c)[31]);
  report(rows(c).slice(11, 16).some((r) => r.includes('R')),
         'ghost eaten by contact respawns in the house', rows(c).slice(11, 16).join(' '));
}
{
  const c = ctx();  // round reset: fixed spawn and coherent state
  edit(c, [[23, 13, '-'], [5, 2, 'P'], [5, 3, 'R'], [11, 13, '-']]);
  vm.runInContext('board[34] = "%{-}e^1---------------------"', c);
  vm.runInContext('board[37] = "%<5>3&2+--~0----------------"', c);
  tick(c);                        // death
  tick(c); tick(c); tick(c);      // pause drains, reset fires
  const b = rows(c);
  report(b[23][13] === 'P', 'pacman respawns at the fixed start', b[23]);
  report(b[11][13] === 'R' && b[13][13] === 'k' && b[13][14] === 'j' && b[14][13] === 'p',
         'ghosts reset to their house starts', b[11] + ' / ' + b[13]);
  report(b[37].startsWith('%<1>0&0+--~0'), 'mode/release/chain/fright clocks reset', b[37]);
  report(b[33].startsWith('status:ready'), 'status returns to ready', b[33]);
}
{
  const c = ctx();  // death still works during frightened mode (status:fright)
  edit(c, [[23, 13, '-'], [5, 2, 'P'], [5, 3, 'R'], [11, 13, '-']]);
  vm.runInContext('board[33] = "status:fright_______________"', c);
  vm.runInContext('board[34] = "%{-}e^1---------------------"', c);
  vm.runInContext('board[37] = "%<1>3&0+--~5----------------"', c);
  tick(c);
  report(rows(c)[5][2] === 'X' && rows(c)[32].startsWith('lives:**-'),
         'death fires during frightened mode', rows(c)[5] + ' / ' + rows(c)[33]);
}

// --- steering invariants (decision D38) --------------------------------
// (1) After every successful move outside the house zone, a ghost's
// heading register equals its observed displacement. (2) Anti-shuttle:
// at the open junction that trapped K before the D37/D38 repair, a
// steered ghost must leave a two-cell shuttle within 12 ticks.
{
  const MARK = { R: '(', K: ')', I: '[', C: ']' };
  const find = (b, ch) => {
    for (let i = 0; i < 31; i++) { const j = b[i].indexOf(ch); if (j >= 0) return [i, j]; }
    return null;
  };
  const c = ctx(1);
  let prev = {};
  let violations = 0;
  for (let t = 0; t < 60; t++) {
    const modeBefore = rows(c)[37][2];
    tick(c);
    const b = rows(c);
    const modeAfter = b[37][2];
    const boundaryReverse = (modeBefore === '2' && modeAfter === '3') ||
                            (modeBefore === '7' && modeAfter === '1');
    if (b[33].includes('game-over')) break;
    if (b[33].includes('wait')) { prev = {}; continue; }
    for (const g of 'RKIC') {
      const pos = find(b, g);
      if (!pos) { prev[g] = null; continue; }
      if (prev[g]) {
        const [r0, c0] = prev[g], [r1, c1] = pos;
        let dir = null;
        if (r1 === r0 && (c1 === c0 + 1 || (c0 === 27 && c1 === 0))) dir = 'e';
        else if (r1 === r0 && (c1 === c0 - 1 || (c0 === 0 && c1 === 27))) dir = 'w';
        else if (c1 === c0 && r1 === r0 + 1) dir = 's';
        else if (c1 === c0 && r1 === r0 - 1) dir = 'n';
        const inHouse = r0 >= 10 && r0 <= 15 && c0 >= 9 && c0 <= 18;
        const marker = b[35][b[35].indexOf(MARK[g]) + 1];
        const opposite = { e: 'w', w: 'e', n: 's', s: 'n' }[dir];
        // state_clock follows movement; at a scatter/chase boundary it
        // intentionally arms the opposite heading for the next tick.
        if (dir && !inHouse && marker !== dir &&
            !(boundaryReverse && marker === opposite)) violations++;
      }
      prev[g] = pos;
    }
  }
  report(violations === 0, 'heading register equals observed displacement',
         `${violations} violation(s)`);
}
{
  const MARKJ = (b) => b[35][b[35].indexOf(')') + 1];
  const c = ctx(1);
  // K at (8,12) heading n: straight is walled, east/west both open, and
  // Pacman idles far south. The pre-D38 chooser shuttled here forever.
  edit(c, [[8, 12, 'K'], [11, 13, '-'], [13, 13, '-'], [13, 14, '-'], [14, 13, '-']]);
  vm.runInContext('board[35] = "%(n)n[n]n-------------------"', c);
  vm.runInContext('board[37] = "%<5>4&0+--~0----------------"', c);
  const seen = new Set();
  for (let t = 0; t < 12; t++) {
    tick(c);
    const pos = (() => {
      for (let i = 0; i < 31; i++) { const j = rows(c)[i].indexOf('K'); if (j >= 0) return `${i},${j}`; }
      return null;
    })();
    if (pos) seen.add(pos);
  }
  report(seen.size >= 3, 'steered ghost escapes the junction shuttle',
         `visited only ${[...seen].join(' | ')}`);
}

// --- seeded autopilot (decisions D14/D15/D17) --------------------------
// BFS toward the nearest safe dot; avoids cells within graph-distance 2
// of a normal ghost; chases frightened ghosts opportunistically. The
// policy is frozen with the test file; seeds 1..20, tick budget 4000.
// D39/D40 gate: cautious policy proves winnability; reckless policy proves
// that fair normal-ghost contact remains lethal.
const NORMAL = new Set('RKIC');
const FRIGHT = new Set('qxzb');
const EDIBLE = new Set('.O');
const WALK = new Set('-.Oqxzb');
const DIRKEY = { e: 'd', w: 'a', s: 's', n: 'w' };

function apAnalyze(board) {
  const maze = board.slice(0, 31);
  let pac = null;
  const ghosts = [];
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[0].length; j++) {
      const ch = maze[i][j];
      if (ch === 'P') pac = [i, j];
      else if (NORMAL.has(ch)) ghosts.push([i, j]);
    }
  }
  return { maze, h: maze.length, w: maze[0].length, pac, ghosts };
}

function apNeighbors(st, i, j) {
  const out = [];
  const wrapRow = WALK.has(st.maze[i][0]) && WALK.has(st.maze[i][st.w - 1]);
  for (const [di, dj, dir] of [[0, 1, 'e'], [0, -1, 'w'], [1, 0, 's'], [-1, 0, 'n']]) {
    let ni = i + di, nj = j + dj;
    if (nj < 0 || nj >= st.w) {
      if (!wrapRow) continue;
      nj = (nj + st.w) % st.w;
    }
    if (ni < 0 || ni >= st.h) continue;
    const ch = st.maze[ni][nj];
    if (WALK.has(ch) || ch === 'P') out.push([ni, nj, dir]);
  }
  return out;
}

function apDanger(st, radius) {
  const dist = new Map();
  const q = [];
  for (const [gi, gj] of st.ghosts) { dist.set(gi * 100 + gj, 0); q.push([gi, gj]); }
  while (q.length) {
    const [i, j] = q.shift();
    const d = dist.get(i * 100 + j);
    if (d >= radius) continue;
    for (const [ni, nj] of apNeighbors(st, i, j)) {
      if (!dist.has(ni * 100 + nj)) { dist.set(ni * 100 + nj, d + 1); q.push([ni, nj]); }
    }
  }
  return dist;
}

function apChoose(st, radius) {
  const danger = apDanger(st, radius == null ? 2 : radius);
  const [si, sj] = st.pac;
  const prev = new Map();
  const q = [[si, sj]];
  prev.set(si * 100 + sj, null);
  let found = null;
  while (q.length && !found) {
    const [i, j] = q.shift();
    for (const [ni, nj, dir] of apNeighbors(st, i, j)) {
      const key = ni * 100 + nj;
      if (prev.has(key) || danger.has(key)) continue;
      prev.set(key, [i, j, dir]);
      const ch = st.maze[ni][nj];
      if (EDIBLE.has(ch) || FRIGHT.has(ch)) { found = [ni, nj]; break; }
      q.push([ni, nj]);
    }
  }
  if (found) {
    let cur = found, dir = null;
    for (;;) {
      const p = prev.get(cur[0] * 100 + cur[1]);
      if (!p) break;
      dir = p[2];
      if (p[0] === si && p[1] === sj) break;
      cur = [p[0], p[1]];
    }
    return dir;
  }
  let best = null, bestScore = -1;
  for (const [ni, nj, dir] of apNeighbors(st, si, sj)) {
    const d = danger.has(ni * 100 + nj) ? danger.get(ni * 100 + nj) : 99;
    if (d > bestScore) { bestScore = d; best = dir; }
  }
  return best;
}

function autopilot(radius) {
  let wins = 0, losses = 0;
  for (let seed = 1; seed <= 20; seed++) {
    const c = ctx(seed);
    harness.prepareSolverContext(c);
    let outcome = 'timeout', ticks = 4000;
    for (let t = 1; t <= 4000; t++) {
      const board = rows(c);
      if (board[32].startsWith('lives:---')) { outcome = 'loss'; ticks = t; break; }
      const st = apAnalyze(board);
      if (st.pac) {
        const dir = apChoose(st, radius);
        if (dir) harness.gameAction(c, DIRKEY[dir]);
      }
      tick(c);
      if (harness.levelComplete(c)) { outcome = 'WIN'; ticks = t; break; }
    }
    console.log(`seed ${seed}: ${outcome} after ${ticks} ticks`);
    if (outcome === 'WIN') wins++;
    if (outcome === 'loss') losses++;
  }
  const rate = Math.round((100 * wins) / 20);
  console.log(`${wins}/20 wins (${rate}%), ${losses} losses`);
  return { wins, losses };
}

// Two-policy hard gate (D39/D40): the cautious bot proves the game is
// winnable; the reckless bot (no ghost avoidance) proves the ghosts can
// kill. The cautious bot's former losses all traced to the lethal
// frightened-contact bug fixed under audit 025, so losability is now
// checked against a policy that actually meets the ghosts.
if (process.argv[2] === 'autopilot') {
  console.log('cautious policy (avoidance radius 2):');
  const cautious = autopilot(2);
  console.log('reckless policy (avoidance radius 0):');
  const reckless = autopilot(0);
  const gate = cautious.wins >= 1 && reckless.losses >= 1;
  console.log(gate ? 'balance gate: PASS (winnable and non-trivial)'
                   : 'balance gate: FAIL');
  process.exitCode = gate ? 0 : 1;
  return;
}
if (failures === 0) console.log('all pacman behavior tests passed');
else { console.log(`${failures} test(s) failed`); process.exitCode = 1; }
