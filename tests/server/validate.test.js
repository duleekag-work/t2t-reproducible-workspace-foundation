import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeName } from '../../src/server/src/validate.js';

describe('normalizeName', () => {
  test('trims surrounding whitespace', () => {
    assert.equal(normalizeName('  reproducible  '), 'reproducible');
  });

  test('rejects empty and whitespace-only input', () => {
    assert.equal(normalizeName(''), null);
    assert.equal(normalizeName('   '), null);
  });

  test('rejects non-string input', () => {
    assert.equal(normalizeName(undefined), null);
    assert.equal(normalizeName({ $ne: null }), null);
  });

  test('rejects input beyond the length limit', () => {
    assert.equal(normalizeName('x'.repeat(81)), null);
  });
});
