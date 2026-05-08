import { test } from 'node:test';
import assert from 'node:assert';
import { Lunio } from '../src/index.js';
import { LunioSDKError } from '../src/errors.js';

test('Lunio requires API key', () => {
  assert.throws(() => new Lunio(), LunioSDKError);
  assert.throws(() => new Lunio(''), LunioSDKError);
});

test('Lunio instantiates with API key', () => {
  const lunio = new Lunio('test_key');
  assert(lunio instanceof Lunio);
  assert(lunio.tax);
});