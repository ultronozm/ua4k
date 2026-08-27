#!/usr/bin/env node
// End-to-end redirected-wildcard contract W2-W8.

const assert = require('assert');
const { spawnSync } = require('child_process');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const harness = require(path.join(root, 'node_harness.js'));

const redirected = harness.compileGameJson(root, 'tests/fixtures/fixture-wildcard.txt').data;
const capture = harness.compileGameJson(root, 'tests/fixtures/fixture-wildcard-capture.txt').data;
const legacy = harness.compileGameJson(root, 'tests/fixtures/fixture-capture.txt').data;
let passed = 0;

{
  const { context, window } = harness.createRuntime(root, redirected, { userAgent: 'wildcard-adversarial' });
  assert.strictEqual(window.UA4K.validateBoardRows(['???']).ok, true,
    'W5 redirected literal ? is scratch-alphabet evidence');
  assert.strictEqual(window.UA4K.validateBoardRows(['***']).ok, false,
    'W5 wildcard-only * syntax is not literal scratch-alphabet evidence');
  const actions = JSON.parse(vm.runInContext('JSON.stringify(currentTouchActions())', context));
  assert(actions.some((action) => action.key === 'a' && action.label),
    'W7 touch controls remain bind-driven under redirected wildcard');
  passed += 3;
}

function checkCapture(name, key, before, expected) {
  const { context } = harness.createRuntime(root, capture, { userAgent: 'wildcard-capture' });
  harness.setBoard(context, before);
  harness.gameAction(context, key);
  assert.deepStrictEqual(harness.getBoard(context), expected, name);
  passed += 1;
}

checkCapture('W3 capture binds and writes the effective wildcard literally', 'c', ['C*-'], ['C**']);
checkCapture('D26 ? is a legal capture name after WILDCARD *', 'q', ['A-'], ['AE']);
checkCapture('W2 unmasked ? is an ordinary literal', 'l', ['?Q'], ['!Q']);

{
  const rules = capture.rules.rotate.rules;
  assert.strictEqual(rules.length, 4, 'W4 ROTATE emits four wildcard-bearing rules');
  for (const rule of rules) {
    assert(rule.from.join('').includes('*') && rule.to.join('').includes('*'),
      'W4 wildcard moves geometrically without changing character');
  }
  passed += 1;
}

assert.strictEqual(Object.prototype.hasOwnProperty.call(legacy, 'wildcardChar'), false,
  'W8 undeclared games omit wildcardChar');
passed += 1;

for (const [name, command, expectedText] of [
  ['solver', ['solve_level.js', 'tests/fixtures/fixture-wildcard.txt', '0', '5', '100'], '"sequence": "aa"'],
  ['replay', ['replay_level.js', 'tests/fixtures/fixture-wildcard.txt', '0', 'aa'], 'LEVEL COMPLETE'],
]) {
  const result = spawnSync(process.execPath, command, { cwd: root, encoding: 'utf8' });
  assert.strictEqual(result.status, 0, `W7 ${name} exits successfully: ${result.stderr}`);
  assert(result.stdout.includes(expectedText), `W7 ${name} observes redirected wildcard semantics`);
  passed += 1;
}

console.log(`wildcard adversarial: ${passed} assertions passed`);

