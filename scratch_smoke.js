#!/usr/bin/env node
// Smoke test for the scratch-level editor API, driven through the real
// browser runtime.

const vm = require('vm');

const harness = require('./node_harness.js');

function visibleBoardText(document) {
  return document.getElementById('display').textContent || '';
}

function assertNoVisibleFacingMarker(document, context, key) {
  vm.runInContext('window.UA4K.restartLevel()', context);
  harness.pressKey(document, key);
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
  const { gameName, data } = harness.compileGameJson(root, gameArg);
  const { context, document } = harness.createRuntime(root, data, {
    userAgent: 'Node Scratch Smoke',
  });

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
