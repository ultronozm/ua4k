// Shared scaffolding for the Node harnesses (solver, TUI, smoke tests,
// replay). Provides a minimal fake DOM, a VM-based ua4k.js runtime, and
// game-file resolution/compilation helpers.

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function serializeFakeNode(node) {
  if (!node) {
    return '';
  }
  if (node.nodeType === 'text') {
    return escapeHtml(node.textContent || '');
  }
  const tagName = node.tagName;
  if (tagName === 'br') {
    return '<br>';
  }
  if (tagName === 'img') {
    return `<img src="${escapeHtml(node.src || '')}">`;
  }
  const attrs = Object.entries(node.attributes || {})
    .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
    .join('');
  const content = node.innerHTML || escapeHtml(node.textContent || '');
  return `<${tagName}${attrs}>${content}</${tagName}>`;
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
    this.hidden = false;
  }

  appendChild(node) {
    this.children.push(node);
    if (this.tagName === 'select' && node.tagName === 'option' && !this.value) {
      this.value = node.value;
    }
    this.innerHTML += serializeFakeNode(node);
    if (node && node.textContent) {
      this.textContent += node.textContent;
    }
    return node;
  }

  blur() {}
  focus() {}

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'class') {
      this.className = String(value);
    }
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

function findGameFiles(dir, result = []) {
  if (!fs.existsSync(dir)) {
    return result;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findGameFiles(fullPath, result);
    } else if (entry.isFile() && entry.name.endsWith('.txt')) {
      result.push(fullPath);
    }
  }
  return result;
}

function resolveGameFile(root, gameArg) {
  const direct = path.resolve(root, gameArg);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return direct;
  }

  const directWithSuffix = gameArg.endsWith('.txt') ? direct : `${direct}.txt`;
  if (fs.existsSync(directWithSuffix) && fs.statSync(directWithSuffix).isFile()) {
    return directWithSuffix;
  }

  const targetName = gameArg.endsWith('.txt') ? path.basename(gameArg) : `${path.basename(gameArg)}.txt`;
  const matches = findGameFiles(path.join(root, 'games')).filter((candidate) => {
    return path.basename(candidate) === targetName;
  }).sort();
  if (matches.length === 0) {
    throw new Error(`Game file not found: ${gameArg}`);
  }
  if (matches.length > 1) {
    throw new Error(`Ambiguous game name ${gameArg}; use one of: ${matches.map((p) => path.relative(root, p)).join(', ')}`);
  }
  return matches[0];
}

function gameNameFromFile(gameFile) {
  return path.basename(gameFile, '.txt');
}

// Compile one game to its JSON data without touching gamesData.js.
function compileGameJson(root, gameArg) {
  const gameFile = resolveGameFile(root, gameArg);
  const result = spawnSync('python3', ['compile-game-json.py', path.relative(root, gameFile)], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    const stdout = (result.stdout || '').trim();
    throw new Error(`compile failed for ${path.relative(root, gameFile)}\n${stderr || stdout}`);
  }
  return { gameName: gameNameFromFile(gameFile), data: JSON.parse(result.stdout) };
}

// Boot ua4k.js in a VM against the fake DOM and start the given game.
function createRuntime(root, data, options = {}) {
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
    navigator: { userAgent: options.userAgent || 'Node Harness' },
    document,
    window,
    gameData: data,
    Event,
    KeyboardEvent,
    prompt: () => null,
  };
  context.globalThis = context;

  vm.createContext(context);
  const source = fs.readFileSync(path.join(root, 'ua4k.js'), 'utf8');
  vm.runInContext(source, context, { filename: 'ua4k.js' });
  const level = Number.isInteger(options.level) ? options.level : 0;
  vm.runInContext(`window.UA4K.startStandalone(gameData, { level: ${level} })`, context);
  vm.runInContext(
    'globalThis.__ua4kSetBoard = function (nextBoard) { board = nextBoard.slice(); board_history = []; };',
    context
  );
  return { context, document, window };
}

function setLevel(context, levelIndex) {
  vm.runInContext(`level_number = ${levelIndex}; initLevel(); drawBoard();`, context);
}

function getBoard(context) {
  return JSON.parse(vm.runInContext('JSON.stringify(board)', context));
}

function setBoard(context, board) {
  context.__ua4kSetBoard(board);
}

function levelComplete(context) {
  return vm.runInContext('levelComplete()', context);
}

function gameAction(context, key) {
  vm.runInContext(`gameAction(${JSON.stringify(key)})`, context);
}

function boundActions(context) {
  return JSON.parse(vm.runInContext('JSON.stringify(Object.keys(binds).sort())', context));
}

function prepareSolverContext(context) {
  if (context.__ua4kSolverPrepared) {
    return;
  }
  vm.runInContext(
    'drawBoard = function () {}; updateMovesDisplay = function () {}; checkEndLevel = function () {};',
    context
  );
  context.__ua4kSolverPrepared = true;
}

function pressKey(document, key) {
  const event = new KeyboardEvent('keypress', {
    key,
    charCode: key.charCodeAt(0),
    bubbles: true,
  });
  document.dispatchEvent(event);
}

function applySequence(document, sequence) {
  for (const ch of sequence) {
    if (/\s/.test(ch)) {
      continue;
    }
    pressKey(document, ch);
  }
}

module.exports = {
  FakeEventTarget,
  FakeElement,
  FakeDocument,
  Event,
  KeyboardEvent,
  escapeHtml,
  serializeFakeNode,
  findGameFiles,
  resolveGameFile,
  gameNameFromFile,
  compileGameJson,
  createRuntime,
  setLevel,
  getBoard,
  setBoard,
  levelComplete,
  gameAction,
  boundActions,
  prepareSolverContext,
  pressKey,
  applySequence,
};
