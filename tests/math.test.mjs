import assert from 'node:assert/strict';
import test from 'node:test';
import { MathProblemGenerator } from '../src/systems/MathProblemGenerator.ts';
import { nextNumber } from '../src/utils/constants.ts';

test('all 190 possible problems have positive operands and a sum no greater than 20', () => {
  const problems = new Set();
  for (let i = 0; i < 190; i++) {
    const problem = new MathProblemGenerator(() => (i + 0.5) / 190).generate();
    assert.ok(problem.first >= 1 && problem.second >= 1);
    assert.ok(problem.answer >= 1 && problem.answer <= 20);
    assert.equal(problem.answer, problem.first + problem.second);
    assert.equal(problem.display, `${problem.first} + ${problem.second}`);
    problems.add(problem.display);
  }
  assert.equal(problems.size, 190);
});

test('the next problem differs even when randomness repeatedly returns the same value', () => {
  for (const random of [0, 0.5, 0.999999]) {
    const generator = new MathProblemGenerator(() => random);
    const first = generator.generate();
    const second = generator.generate(first);
    assert.notEqual(first.display, second.display);
  }
});

test('generated values cannot mutate the generator’s problem bank', () => {
  const generator = new MathProblemGenerator(() => 0);
  const original = generator.generate();
  original.answer = 500;
  assert.equal(generator.generate().answer, 2);
});

test('the answer advances once through 0–20 and wraps back to 0', () => {
  let value = 0;
  for (let expected = 1; expected <= 20; expected++) {
    value = nextNumber(value);
    assert.equal(value, expected);
  }
  assert.equal(nextNumber(value), 0);
  assert.equal(nextNumber(nextNumber(value)), 1);
});
