#!/usr/bin/env node
// Replay a key sequence against one level and print each board state.
// The essential authoring loop is: solve_level.js finds a sequence, this
// script shows what it actually does, board by board.
//
// usage: node replay_level.js <game-name-or-file> [level-index] [keys]

const harness = require('./node_harness.js');

function main() {
  const gameArg = process.argv[2];
  const levelIndex = Number(process.argv[3] || 0);
  const sequence = process.argv[4] || '';
  if (!gameArg) {
    console.error('usage: node replay_level.js <game-name-or-file> [level-index] [keys]');
    process.exit(2);
  }
  if (!Number.isInteger(levelIndex) || levelIndex < 0) {
    console.error('level-index must be a non-negative integer');
    process.exit(2);
  }

  const root = process.cwd();
  const { data } = harness.compileGameJson(root, gameArg);
  const { context } = harness.createRuntime(root, data, {
    userAgent: 'Node Replay',
    level: levelIndex,
  });

  const show = (label) => {
    console.log(label);
    console.log(harness.getBoard(context).join('\n'));
    console.log('');
  };

  show('t=0');
  let prev = harness.getBoard(context).join('\n');
  for (let i = 0; i < sequence.length; i++) {
    const key = sequence[i];
    if (/\s/.test(key)) {
      continue;
    }
    harness.gameAction(context, key);
    const now = harness.getBoard(context).join('\n');
    const suffix = now === prev ? ' (no-op)' : '';
    prev = now;
    show(`t=${i + 1} key=${key}${suffix}`);
    if (harness.levelComplete(context)) {
      console.log('LEVEL COMPLETE');
      return;
    }
  }
}

try {
  main();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(2);
}
