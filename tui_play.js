#!/usr/bin/env node
// Interactive terminal player driven through the real browser runtime.

const readline = require('readline');

const harness = require('./node_harness.js');

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
    harness.applySequence(document, input);
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

  let levelIndex = 0;
  if (levelArg !== undefined) {
    levelIndex = Number(levelArg);
    if (!Number.isInteger(levelIndex) || levelIndex < 0) {
      throw new Error(`Invalid level-index: ${levelArg}`);
    }
  }

  const { data } = harness.compileGameJson(root, gameArg);
  const { document } = harness.createRuntime(root, data, {
    userAgent: 'Node TUI',
    level: levelIndex,
  });

  if (keySequence) {
    harness.applySequence(document, keySequence);
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
