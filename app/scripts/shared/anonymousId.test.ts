import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { webcrypto } from 'node:crypto';
import { ANONYMOUS_ID_KEY, getAnonymousId } from '../../src/shared/utils/deviceUser';

const values = new Map<string, string>();
const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

beforeEach(() => {
  values.clear();
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    localStorage: { getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); } },
  } });
});
afterEach(() => {
  Reflect.deleteProperty(globalThis, 'window');
  if (originalCrypto) Object.defineProperty(globalThis, 'crypto', originalCrypto);
});

test('UUID v4 is saved once and reused by both features and a new page scope', () => {
  const id = getAnonymousId();
  assert.match(id, pattern);
  assert.equal(JSON.parse(values.get(ANONYMOUS_ID_KEY)!), id);
  assert.equal(getAnonymousId(), id);
  const store = window.localStorage;
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: store } });
  assert.equal(getAnonymousId(), id);
});

test('old test identifiers and unrelated storage are neither migrated nor cleared', () => {
  values.set('posts.deviceUserId', JSON.stringify('user-old-test'));
  values.set('stampRally.v1', JSON.stringify({ participantId: 'old-participant' }));
  values.set('unrelated.preference', 'keep');
  const before = new Map(values);
  assert.match(getAnonymousId(), pattern);
  for (const [key, value] of before) assert.equal(values.get(key), value);
});

test('a malformed saved value is replaced and independent browsers get different IDs', () => {
  values.set(ANONYMOUS_ID_KEY, JSON.stringify('invalid'));
  const first = getAnonymousId();
  const secondValues = new Map<string, string>();
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    localStorage: { getItem: (key: string) => secondValues.get(key) ?? null,
      setItem: (key: string, value: string) => { secondValues.set(key, value); } },
  } });
  const second = getAnonymousId();
  assert.match(first, pattern); assert.match(second, pattern); assert.notEqual(first, second);
});

test('Safari fallback uses cryptographic random bytes when randomUUID is unavailable', () => {
  Object.defineProperty(globalThis, 'crypto', { configurable: true,
    value: { getRandomValues: webcrypto.getRandomValues.bind(webcrypto) } });
  assert.match(getAnonymousId(), pattern);
});

test('blocked localStorage keeps a stable ID for the current page without crashing', () => {
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: {
    getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); },
  } } });
  const first = getAnonymousId();
  assert.match(first, pattern); assert.equal(getAnonymousId(), first);
});
