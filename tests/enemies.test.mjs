import assert from 'node:assert/strict';
import test from 'node:test';
import { ENEMY_VARIANTS } from '../src/entities/enemyVariants.ts';
import { EnemyRoster } from '../src/systems/EnemyRoster.ts';

test('all eight characters appear once in each group of eight encounters', () => {
  assert.equal(ENEMY_VARIANTS.length, 8);
  assert.equal(new Set(ENEMY_VARIANTS.map(variant => variant.id)).size, 8);
  const expected = new Set(ENEMY_VARIANTS.map(variant => variant.id));
  for (const value of [0, 0.25, 0.5, 0.999999]) {
    const roster = new EnemyRoster(() => value);
    for (let round = 0; round < 10; round++) {
      const encountered = Array.from({ length: 8 }, () => roster.next().id);
      assert.deepEqual(new Set(encountered), expected);
    }
  }
});

test('the last character in one group never immediately returns in the next', () => {
  let seed = 97;
  const roster = new EnemyRoster(() => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  });
  let previous;
  for (let i = 0; i < 800; i++) {
    const current = roster.next().id;
    assert.notEqual(current, previous);
    previous = current;
  }
});

test('restart discards the partial group and begins a fresh set of eight', () => {
  const roster = new EnemyRoster(() => 0.5);
  for (let i = 0; i < 3; i++) roster.next();
  roster.reset();
  assert.equal(new Set(Array.from({ length: 8 }, () => roster.next().id)).size, 8);
});
