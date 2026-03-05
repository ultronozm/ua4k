#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

class FakeEventTarget {
  constructor() {
    this.listeners = {};
  }

  addEventListener(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  dispatchEvent(event) {
    event.target = this;
    const callbacks = this.listeners[event.type] || [];
    for (const callback of callbacks) {
      callback.call(this, event);
    }
    return true;
  }
}

class FakeElement extends FakeEventTarget {
  constructor(tagName, id = null) {
    super();
    this.tagName = String(tagName || 'div').toLowerCase();
    this.id = id;
    this.children = [];
    this.attributes = {};
    this.innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.className = '';
    this.src = '';
  }

  appendChild(node) {
    this.children.push(node);
    if (this.tagName === 'select' && node.tagName === 'option' && !this.value) {
      this.value = node.value;
    }
    return node;
  }

  blur() {}

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    if (name in this.attributes) {
      return this.attributes[name];
    }
    return null;
  }

  getElementsByClassName(className) {
    return this.children.filter((child) => child.className === className);
  }
}

class FakeDocument extends FakeEventTarget {
  constructor() {
    super();
    this.byId = {};
  }

  getElementById(id) {
    if (!this.byId[id]) {
      const tagName = id === 'games' ? 'select' : 'div';
      this.byId[id] = new FakeElement(tagName, id);
    }
    return this.byId[id];
  }

  createElement(tagName) {
    return new FakeElement(tagName);
  }

  createTextNode(text) {
    return { nodeType: 'text', textContent: String(text) };
  }
}

class Event {
  constructor(type) {
    this.type = type;
  }
}

class KeyboardEvent extends Event {
  constructor(type, init = {}) {
    super(type);
    this.key = init.key || '';
    this.charCode = init.charCode || 0;
    this.bubbles = Boolean(init.bubbles);
  }
}

function compileGame(root, gameName) {
  const result = spawnSync('python3', ['make-data.py', `${gameName}.txt`], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    const stdout = (result.stdout || '').trim();
    throw new Error(`compile failed for ${gameName}.txt\n${stderr || stdout}`);
  }
}

function loadGamesData(root) {
  const text = fs.readFileSync(path.join(root, 'gamesData.js'), 'utf8');
  const prefix = 'let gamesData = ';
  if (!text.startsWith(prefix)) {
    throw new Error('Unexpected gamesData.js format');
  }
  let payload = text.slice(prefix.length).trim();
  if (payload.endsWith(';')) {
    payload = payload.slice(0, -1);
  }
  return JSON.parse(payload);
}

function createRuntime(root, gamesData) {
  const document = new FakeDocument();
  const window = new FakeEventTarget();
  window.location = { hash: '', search: '' };
  const context = {
    console,
    Math,
    JSON,
    URLSearchParams,
    setInterval,
    clearInterval,
    setTimeout,
    clearTimeout,
    navigator: { userAgent: 'Node Solver' },
    document,
    window,
    gamesData,
    Event,
    KeyboardEvent,
    prompt: () => null,
  };
  context.globalThis = context;

  vm.createContext(context);
  const source = fs.readFileSync(path.join(root, 'ua4k.js'), 'utf8');
  vm.runInContext(source, context, { filename: 'ua4k.js' });
  window.dispatchEvent(new Event('load'));
  return context;
}

function boardKey(board) {
  return board.join('\n');
}

function getBoard(ctx) {
  return JSON.parse(vm.runInContext('JSON.stringify(board)', ctx));
}

function setBoard(ctx, board) {
  vm.runInContext(`board = ${JSON.stringify(board)}; board_history = [];`, ctx);
}

function runAction(ctx, board, key) {
  setBoard(ctx, board);
  vm.runInContext(`gameAction(${JSON.stringify(key)})`, ctx);
  const nextBoard = getBoard(ctx);
  const complete = vm.runInContext('levelComplete()', ctx);
  return { nextBoard, complete };
}

function solveLevel(ctx, actions, maxDepth, maxStates) {
  const startBoard = getBoard(ctx);
  if (vm.runInContext('levelComplete()', ctx)) {
    return { sequence: '', explored: 0 };
  }

  const startKey = boardKey(startBoard);
  const queue = [{ board: startBoard, sequence: '', key: startKey }];
  let queueHead = 0;
  const visited = new Set([startKey]);
  let explored = 0;

  while (queueHead < queue.length) {
    const current = queue[queueHead];
    queueHead += 1;
    explored += 1;
    if (explored > maxStates) {
      return { sequence: null, explored, reason: 'state_limit' };
    }

    if (current.sequence.length >= maxDepth) {
      continue;
    }

    for (const key of actions) {
      const { nextBoard, complete } = runAction(ctx, current.board, key);
      const keyStr = boardKey(nextBoard);
      if (keyStr === current.key) {
        continue;
      }
      if (visited.has(keyStr)) {
        continue;
      }

      const nextSequence = current.sequence + key;
      if (complete) {
        return { sequence: nextSequence, explored };
      }

      visited.add(keyStr);
      queue.push({ board: nextBoard, sequence: nextSequence, key: keyStr });
    }
  }

  return { sequence: null, explored, reason: 'no_solution' };
}

function main() {
  const gameName = process.argv[2];
  const levelIndex = Number(process.argv[3] || 0);
  const maxDepth = Number(process.argv[4] || 50);
  const maxStates = Number(process.argv[5] || 200000);
  if (!gameName) {
    console.error('usage: node solve_level.js <game-name> [level-index] [max-depth] [max-states]');
    process.exit(2);
  }
  if (!Number.isInteger(levelIndex) || levelIndex < 0) {
    console.error('level-index must be a non-negative integer');
    process.exit(2);
  }

  const root = process.cwd();
  compileGame(root, gameName);
  const gamesData = loadGamesData(root);
  if (!(gameName in gamesData)) {
    throw new Error(`Game not found in gamesData.js: ${gameName}`);
  }
  const ctx = createRuntime(root, gamesData);
  const doc = ctx.document;
  const dropdown = doc.getElementById('games');
  dropdown.value = gameName;
  dropdown.dispatchEvent(new Event('change'));

  vm.runInContext(`level_number = ${levelIndex}; initLevel(); drawBoard();`, ctx);
  const actions = JSON.parse(vm.runInContext('JSON.stringify(Object.keys(binds).sort())', ctx));
  const result = solveLevel(ctx, actions, maxDepth, maxStates);
  if (result.sequence == null) {
    console.log(
      JSON.stringify(
        {
          solved: false,
          game: gameName,
          level: levelIndex,
          explored: result.explored,
          reason: result.reason,
          actions,
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        solved: true,
        game: gameName,
        level: levelIndex,
        sequence: result.sequence,
        length: result.sequence.length,
        explored: result.explored,
        actions,
      },
      null,
      2
    )
  );
}

try {
  main();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(2);
}
