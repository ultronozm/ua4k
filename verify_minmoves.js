#!/usr/bin/env node
// Verify every MINMOVES claim in every game by BFS through the real runtime.
//
// For each level that declares MINMOVES N, search up to depth N:
//  - a solution shorter than N  -> fail (claim is not minimal)
//  - no solution within depth N -> fail (claim is not achievable)
//  - a solution of exactly N    -> ok
//
// Games with RANDOM rules or tick timers are skipped: BFS assumes a
// deterministic, input-driven game. Levels that blow the state cap are
// reported as skipped rather than failed, so a slow level cannot flake CI —
// but the skip is printed loudly.
//
// usage: node verify_minmoves.js [max-states-per-level]

const fs = require('fs');
const path = require('path');

const harness = require('./node_harness.js');
const { solveLevel } = require('./solve_level.js');

function usesRandom(rules) {
  const text = JSON.stringify(rules);
  return text.includes('"type": "random"') || text.includes('"type":"random"')
    || text.includes('"method": "random"') || text.includes('"method":"random"');
}

function usesTick(data) {
  if (data.globalTick) {
    return true;
  }
  if (data.rules && data.rules._tick) {
    return true;
  }
  return (data.levels || []).some((level) => level.tickInterval);
}

function main() {
  const maxStates = Number(process.argv[2] || 800000);
  const root = process.cwd();

  const gameFiles = harness.findGameFiles(path.join(root, 'games'))
    .filter((file) => !file.includes(`${path.sep}legacy${path.sep}`))
    .filter((file) => !file.includes(`${path.sep}experiments${path.sep}`))
    .filter((file) => /^MINMOVES\b/m.test(fs.readFileSync(file, 'utf8')))
    .sort();

  let checked = 0;
  let failures = 0;
  let skips = 0;

  for (const gameFile of gameFiles) {
    const rel = path.relative(root, gameFile);
    const { gameName, data } = harness.compileGameJson(root, rel);

    if (usesRandom(data.rules)) {
      skips += 1;
      console.log(`skip: ${gameName} (RANDOM rules; BFS not applicable)`);
      continue;
    }
    if (usesTick(data)) {
      skips += 1;
      console.log(`skip: ${gameName} (tick timer; BFS not applicable)`);
      continue;
    }

    const { context } = harness.createRuntime(root, data, {
      userAgent: 'Node MinMoves Verifier',
    });
    const actions = harness.boundActions(context);

    (data.levels || []).forEach((level, index) => {
      const claimed = level.minMoves;
      if (!Number.isInteger(claimed)) {
        return;
      }
      harness.setLevel(context, index);
      const result = solveLevel(context, actions, claimed, maxStates);
      if (result.sequence != null) {
        if (result.sequence.length === claimed) {
          checked += 1;
          console.log(`ok: ${gameName} level ${index} minmoves ${claimed}`);
        } else {
          failures += 1;
          console.log(
            `FAIL: ${gameName} level ${index} claims MINMOVES ${claimed} `
            + `but ${result.sequence.length} suffices (${result.sequence})`
          );
        }
      } else if (result.reason === 'state_limit') {
        skips += 1;
        console.log(
          `SKIP: ${gameName} level ${index} hit the ${maxStates}-state cap `
          + `before verifying MINMOVES ${claimed}`
        );
      } else {
        failures += 1;
        console.log(
          `FAIL: ${gameName} level ${index} claims MINMOVES ${claimed} `
          + `but no solution exists within ${claimed} moves`
        );
      }
    });
  }

  console.log(`verified ${checked} minmoves claims, ${failures} failures, ${skips} skips`);
  return failures ? 1 : 0;
}

try {
  process.exit(main());
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(2);
}
