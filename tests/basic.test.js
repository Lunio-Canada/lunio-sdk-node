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

test('tax.calculate validates inputs', async () => {
  const lunio = new Lunio('test_key');
  await assert.rejects(() => lunio.tax.calculate({}), LunioSDKError);
  await assert.rejects(() => lunio.tax.calculate({ province_code: 123, amount: 100 }), LunioSDKError);
  await assert.rejects(() => lunio.tax.calculate({ province_code: 'NL', amount: 'abc' }), LunioSDKError);
  await assert.rejects(() => lunio.tax.calculate({ province_code: 'NL', amount: NaN }), LunioSDKError);
  await assert.rejects(() => lunio.tax.calculate({ province_code: 'NL', amount: Infinity }), LunioSDKError);
});

test('tax.reverse validates inputs', async () => {
  const lunio = new Lunio('test_key');
  await assert.rejects(() => lunio.tax.reverse({}), LunioSDKError);
  await assert.rejects(() => lunio.tax.reverse({ province_code: 123, total: 100 }), LunioSDKError);
  await assert.rejects(() => lunio.tax.reverse({ province_code: 'NL', total: 'abc' }), LunioSDKError);
  await assert.rejects(() => lunio.tax.reverse({ province_code: 'NL', total: NaN }), LunioSDKError);
  await assert.rejects(() => lunio.tax.reverse({ province_code: 'NL', total: Infinity }), LunioSDKError);
});