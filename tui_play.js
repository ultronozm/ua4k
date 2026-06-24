#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const readline = require('readline');
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
  }

  appendChild(node) {
    this.children.push(node);
    if (!node) {
      return node;
    }
    if (this.tagName === 'select' && node.tagName === 'option' && !this.value) {
      this.value = node.value;
    }
    this.innerHTML += serializeFakeNode(node);
    if (node.textContent) {
      this.textContent += node.textContent;
    }
    return node;
  }

  blur() {}

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

function loadGamesData(root) {
  const gamesDataPath = path.join(root, 'gamesData.js');
  if (!fs.existsSync(gamesDataPath)) {
    throw new Error('gamesData.js is missing; compile at least one game first');
  }
  const prefix = 'let gamesData = ';
  const text = fs.readFileSync(gamesDataPath, 'utf8');
  if (!text.startsWith(prefix)) {
    throw new Error('Unexpected gamesData.js format');
  }
  let payload = text.slice(prefix.length).trim();
  if (payload.endsWith(';')) {
    payload = payload.slice(0, -1);
  }
  return JSON.parse(payload);
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

function compileGame(root, gameArg) {
  const gameFile = resolveGameFile(root, gameArg);
  const result = spawnSync('python3', ['make-data.py', path.relative(root, gameFile)], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    const stdout = (result.stdout || '').trim();
    throw new Error(`Failed to compile ${path.relative(root, gameFile)}\n${stderr || stdout}`);
  }
  return gameNameFromFile(gameFile);
}

function stripHtml(line) {
  return line
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<img[^>]*>/gi, '[img]');
}

function displayLines(document) {
  const html = document.getElementById('display').innerHTML || '';
  if (!html) {
    return [];
  }
  return html.split(/<br>/i).map(stripHtml);
}

function renderState(document) {
  const level = document.getElementById('level').textContent || '';
  const moves = document.getElementById('moves').textContent || '';
  const title = document.getElementById('title').innerHTML || '';
  const description = document.getElementById('description').innerHTML || '';
  const status = document.getElementById('status').innerHTML || '';

  console.log(level + (moves ? ` | ${moves}` : ''));
  if (title) {
    console.log(`Title: ${stripHtml(title)}`);
  }
  if (description) {
    console.log(`Description: ${stripHtml(description)}`);
  }
  for (const line of displayLines(document)) {
    console.log(line);
  }
  if (status) {
    console.log(`Status: ${stripHtml(status)}`);
  }
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
    navigator: { userAgent: 'Node TUI' },
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
  return { context, document };
}

function selectGame(document, gameName) {
  const dropdown = document.getElementById('games');
  dropdown.value = gameName;
  dropdown.dispatchEvent(new Event('change'));
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

function runInteractive(document) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'keys> ',
  });

  console.log('Enter key sequences (e.g. ssdaa). Commands: :r render, :q quit');
  renderState(document);
  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();
    if (input === ':q') {
      rl.close();
      return;
    }
    if (input === ':r') {
      renderState(document);
      rl.prompt();
      return;
    }
    applySequence(document, input);
    renderState(document);
    rl.prompt();
  });
}

function main() {
  const root = process.cwd();
  const gameArg = process.argv[2];
  const keySequence = process.argv[3] || '';
  const levelArg = process.argv[4];
  if (!gameArg) {
    console.error('usage: node tui_play.js <game-name-or-file> [keys] [level-index]');
    process.exit(2);
  }

  const gameName = compileGame(root, gameArg);
  const gamesData = loadGamesData(root);
  if (!(gameName in gamesData)) {
    const names = Object.keys(gamesData).sort().join(', ');
    throw new Error(`Game ${gameName} not found in gamesData.js (available: ${names})`);
  }

  const { context, document } = createRuntime(root, gamesData);
  selectGame(document, gameName);
  if (levelArg !== undefined) {
    const levelIndex = Number(levelArg);
    if (!Number.isInteger(levelIndex) || levelIndex < 0) {
      throw new Error(`Invalid level-index: ${levelArg}`);
    }
    vm.runInContext(`level_number = ${levelIndex}; initLevel(); drawBoard();`, context);
  }

  if (keySequence) {
    applySequence(document, keySequence);
    renderState(document);
    return;
  }
  runInteractive(document);
}

try {
  main();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(2);
}
