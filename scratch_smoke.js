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
    this.hidden = false;
  }

  appendChild(node) {
    this.children.push(node);
    if (node && node.textContent) {
      this.textContent += node.textContent;
      this.innerHTML += node.textContent;
    }
    if (node && node.tagName === 'br') {
      this.innerHTML += '<br>';
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
    return this.attributes[name] || null;
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
      this.byId[id] = new FakeElement(id === 'games' ? 'select' : 'div', id);
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

function gameNameFromArg(gameArg) {
  return path.basename(gameArg.endsWith('.txt') ? gameArg : `${gameArg}.txt`, '.txt');
}

function compileGameJson(root, gameArg) {
  const result = spawnSync('python3', ['compile-game-json.py', gameArg], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || '').trim());
  }
  return JSON.parse(result.stdout);
}

function createRuntime(root, compiledData) {
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
    navigator: { userAgent: 'Node Scratch Smoke' },
    document,
    window,
    gameData: compiledData,
    Event,
    KeyboardEvent,
    prompt: () => null,
  };
  context.globalThis = context;

  vm.createContext(context);
  const source = fs.readFileSync(path.join(root, 'ua4k.js'), 'utf8');
  vm.runInContext(source, context, { filename: 'ua4k.js' });
  vm.runInContext('window.UA4K.startStandalone(gameData)', context);
  return { context, document };
}

function pressKey(document, key) {
  document.dispatchEvent(new KeyboardEvent('keypress', {
    key,
    charCode: key.charCodeAt(0),
    bubbles: true,
  }));
}

function visibleBoardText(document) {
  return document.getElementById('display').textContent || '';
}

function assertNoVisibleFacingMarker(document, context, key) {
  vm.runInContext('window.UA4K.restartLevel()', context);
  pressKey(document, key);
  const visible = visibleBoardText(document);
  if (/[<>^v]/.test(visible)) {
    throw new Error(`visible facing marker leaked after ${JSON.stringify(key)}: ${JSON.stringify(visible)}`);
  }
}

function runCrashLandingSmoke(context, document) {
  for (const key of ['W', 'S', 'A', 'D', 'w', 's', 'a', 'd']) {
    assertNoVisibleFacingMarker(document, context, key);
  }
}

function run() {
  const root = process.cwd();
  const gameArg = process.argv[2] || 'dockstep';
  const gameName = gameNameFromArg(gameArg);
  const compiledData = compileGameJson(root, gameArg);
  const { context, document } = createRuntime(root, compiledData);

  const original = vm.runInContext('window.UA4K.originalLevelText()', context);
  const invalid = vm.runInContext(
    `window.UA4K.startScratchLevelFromText(${JSON.stringify(`${original}\n<bad>`)})`,
    context
  );
  if (invalid.ok) {
    throw new Error('invalid scratch board unexpectedly passed validation');
  }

  const edited = original.replace('1', '-');
  const result = vm.runInContext(
    `window.UA4K.startScratchLevelFromText(${JSON.stringify(edited)})`,
    context
  );
  if (!result.ok) {
    throw new Error(`valid scratch board failed validation: ${result.errors.join('; ')}`);
  }

  const levelLabel = document.getElementById('level').textContent;
  if (!levelLabel.startsWith('Scratch Level:')) {
    throw new Error(`scratch level label was not shown: ${levelLabel}`);
  }

  if (gameName === 'crash-landing') {
    runCrashLandingSmoke(context, document);
  }

  console.log(JSON.stringify({
    ok: true,
    game: gameName,
    invalidErrors: invalid.errors.length,
    rows: result.rows.length,
  }, null, 2));
}

try {
  run();
  process.exit(0);
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(2);
}
