#!/usr/bin/env node
// Behavioral contract R2-R12 and R15-R21b for parameterized ATOMIC.

const assert = require('assert');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const harness = require(path.join(root, 'node_harness.js'));

const GAME = 'tests/fixtures/fixture-capture-adversarial.txt';
const { data } = harness.compileGameJson(root, GAME);
let passed = 0;

function fresh(randomValue) {
  const runtime = harness.createRuntime(root, data, { userAgent: 'capture-adversarial' });
  if (randomValue !== undefined) {
    runtime.context.__testRandomValue = randomValue;
    vm.runInContext(
      'Math = Object.create(Math); Math.random = function () { return __testRandomValue; };',
      runtime.context
    );
  }
  return runtime;
}

function check(name, key, before, expected, options = {}) {
  const { context } = fresh(options.random);
  harness.setBoard(context, before);
  harness.gameAction(context, key);
  assert.deepStrictEqual(harness.getBoard(context), expected, name);
  passed += 1;
}

check('R2 failed candidate bindings do not leak', 'b', ['AYBX'], ['AYBE']);
check('R3 greedy binding does not backtrack across children', 'c', ['A-B-BZ'], ['A-B-BZ']);
check('R4 failed mandatory restores board and binding for fallback', 'd', ['A-#BQ'], ['A-#BE']);
check('R5 side effects see capture characters literally', 'e', ['A-'], ['A-']);
check('R6/R7 failed nested branch restores outer environment', 'f', ['A-#B-'], ['A-#BE']);
check('R8 nested locals expire; outer bindings and literal CALL survive', 'g',
  ['AaCcCmAq2l1z'], ['AbCdCnAe2e1y']);
check('R9 unbound destination resolves before any write', 'h', ['Q-'], ['Q-']);
check('R10 random carries the selected candidate binding', 'j', ['A-B-C-'], ['A-BEC-'], { random: 0.4 });
check('R11 lastmatch carries the last candidate binding', 'k', ['A-B-C-'], ['A-B-CE']);

{
  const { context } = fresh();
  harness.setBoard(context, ['Ax-']);
  vm.runInContext(`
    globalThis.__captureBindOnlyCalls = 0;
    const __captureOrigApplyRuleAt = applyRuleAt;
    applyRuleAt = function (rule, ...args) {
      if (rule.from && rule.from[0] === '1') __captureBindOnlyCalls++;
      return __captureOrigApplyRuleAt.call(this, rule, ...args);
    };
  `, context);
  harness.gameAction(context, 'r');
  assert.deepStrictEqual(harness.getBoard(context), ['AxA'], 'R15 committed bind survives no-progress stop');
  assert.strictEqual(context.__captureBindOnlyCalls, 1, 'R15 REPEAT stops after one bind-only success');
  passed += 1;
}

check('R16 NOT class matches Unicode outside compiled alphabet', 'n', ['CΩ-'], ['CΩΩ']);
check('R16 NOT class rejects #', 'n', ['C#-'], ['C#-']);
check('R16 NOT class rejects =', 'n', ['C=-'], ['C=-']);
check('R18 quoted class captures literal space', 'w', ['C -'], ['C  ']);
check('R19 negated-space class accepts injected Unicode', 's', ['CΩ-'], ['CΩΩ']);
check('R19 negated-space class rejects space', 's', ['C -'], ['C -']);
check('R20 concrete anchor selects playfield rather than register-like cells', 'a', ['!A', 'CB'], ['!A', 'CE']);
check('R21 bound wildcard writes literally and equality accepts it', 'q', ['C?-K?'], ['C??KZ']);
check('R21 bound wildcard equality rejects a non-wildcard cell', 'q', ['C?-KA'], ['C?-KA']);
check('R21b hidden-line character is present on the underlying board', 'p', ['C%-'], ['C%%']);

{
  const command = data.rules.rotate;
  const simple = [];
  (function walk(rule) {
    if (rule.type === 'simple') simple.push(rule);
    for (const child of rule.rules || []) walk(child);
  })(command);
  assert.strictEqual(simple.length, 6, 'R12 emits four rotations and two horizontal reflections');
  for (const rule of simple) {
    for (const side of ['from', 'to']) {
      const offsets = rule[`${side}Variables`] || [];
      assert.strictEqual(offsets.length, 1, `R12 ${side} has one transformed mask`);
      const width = rule[side][0].length;
      const offset = offsets[0];
      assert.strictEqual(rule[side][Math.floor(offset / width)][offset % width], '1',
        `R12 ${side} mask stays on the variable cell`);
    }
  }
  passed += 1;
}

{
  const literalRule = data.rules.literal_capture.rules[0];
  assert.strictEqual(literalRule.fromVariables, undefined, 'R17 literal capture character outside scope is unmasked');
  const { context, window } = fresh();
  const result = window.UA4K.validateBoardRows(['1z']);
  assert.strictEqual(result.ok, true, 'R17 scratch alphabet retains literal capture character');
  harness.setBoard(context, ['1z']);
  // `literal_capture` is intentionally not bound; R8 exercises it through CALL.
  passed += 1;
}

{
  const scanData = harness.compileGameJson(root, 'tests/fixtures/fixture-scan-continuation.txt').data;
  const { context } = harness.createRuntime(root, scanData, { userAgent: 'scan-continuation' });
  harness.gameAction(context, 'x');
  assert.deepStrictEqual(harness.getBoard(context), ['A-BE'],
    'D30 browser continues after a candidate application fails');
  const lastRuntime = harness.createRuntime(root, scanData, { userAgent: 'scan-continuation-last' });
  harness.gameAction(lastRuntime.context, 'y');
  assert.deepStrictEqual(harness.getBoard(lastRuntime.context), ['AEB-'],
    'D30 browser lastmatch continues backward after a candidate application fails');
  passed += 2;
}

console.log(`capture adversarial: ${passed} assertions passed`);
