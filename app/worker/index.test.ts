import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { type Env } from './index';
import { MOCK_SPOTS } from '../src/mocks/spots';
import { STORE_SPOTS } from '../src/mocks/stores';
import { buildPostTargets, POST_TARGETS } from '../src/shared/postTargets';
import { GENRES } from '../src/shared/taxonomy';

const unavailableDB = {
  prepare() {
    throw new Error('Unexpected SQL');
  },
  async batch() {
    throw new Error('Unexpected SQL');
  },
};
const assets = { async fetch() { return new Response('static asset'); } };
const enabled: Env = {
  ASSETS: assets,
  DB: unavailableDB,
  POSTS_ENABLED: 'true',
  POST_RATE_LIMIT_SECRET: 'a'.repeat(32),
};
const headers = {
  'Content-Type': 'application/json',
  'Idempotency-Key': '00000000-0000-4000-8000-000000000001',
  'CF-Connecting-IP': '192.0.2.1',
};
function request(input: unknown, overrides: Record<string, string> = {}) {
  return new Request('https://festival.example/api/posts', {
    method: 'POST',
    headers: { ...headers, ...overrides },
    body: JSON.stringify(input),
  });
}
const valid = { spotId: POST_TARGETS[0].id, caption: '投稿テスト' };

test('post target catalogue contains each current non-QR spot exactly once', () => {
  const expected = MOCK_SPOTS.filter((spot) => spot.categoryId !== 'stamp-qr');
  assert.equal(POST_TARGETS.length, expected.length);
  assert.equal(new Set(POST_TARGETS.map((spot) => spot.id)).size, POST_TARGETS.length);
  assert.deepEqual(
    POST_TARGETS.map((spot) => spot.id).sort(),
    expected.map((spot) => spot.id).sort(),
  );
  assert.ok(STORE_SPOTS.every((spot) => POST_TARGETS.some((target) => target.id === spot.id)));
  assert.ok(POST_TARGETS.every((spot) => spot.categoryId !== 'stamp-qr'));
});

test('post target catalogue deduplicates identical records and rejects conflicting IDs', () => {
  const target = POST_TARGETS[0];
  assert.deepEqual(buildPostTargets([target, { ...target }]), [target]);
  assert.throws(
    () => buildPostTargets([target, { ...target, name: `${target.name}（別対象）` }]),
    /Conflicting post target IDs/,
  );
});

test('posting fails closed with disabled flag, missing DB, or insufficient secret', async () => {
  for (const env of [
    { ...enabled, POSTS_ENABLED: undefined },
    { ...enabled, POSTS_ENABLED: 'false' },
    { ...enabled, DB: undefined },
    { ...enabled, POST_RATE_LIMIT_SECRET: undefined },
    { ...enabled, POST_RATE_LIMIT_SECRET: 'short' },
  ]) {
    const response = await worker.fetch(request(valid), env);
    assert.equal(response.status, 503);
    assert.match(response.headers.get('Cache-Control')!, /no-store/);
  }
});

test('missing trustworthy IP fails before SQL', async () => {
  const input = request(valid);
  input.headers.delete('CF-Connecting-IP');
  assert.equal((await worker.fetch(input, enabled)).status, 503);
});

test('invalid input and oversized JSON fail before SQL', async () => {
  for (const input of [
    null,
    [],
    {},
    { ...valid, caption: '' },
    { ...valid, caption: ' '.repeat(20) },
    { ...valid, caption: '😀'.repeat(501) },
    { ...valid, caption: '\u0000' },
    { ...valid, caption: '\ud800' },
    { ...valid, spotId: 'unknown' },
    { ...valid, images: [] },
  ]) {
    assert.equal((await worker.fetch(request(input), enabled)).status, 400);
  }
  assert.equal(
    (await worker.fetch(request({ ...valid, caption: 'x'.repeat(9000) }), enabled)).status,
    413,
  );
  assert.equal(
    (
      await worker.fetch(
        new Request('https://festival.example/api/posts', { method: 'POST', headers, body: '{' }),
        enabled,
      )
    ).status,
    400,
  );
});

test('cross-origin writes and invalid transport metadata are rejected', async () => {
  assert.equal((await worker.fetch(request(valid, { Origin: 'https://other.example' }), enabled)).status, 403);
  assert.equal((await worker.fetch(request(valid, { 'Sec-Fetch-Site': 'cross-site' }), enabled)).status, 403);
  assert.equal((await worker.fetch(request(valid, { 'Content-Type': 'text/plain' }), enabled)).status, 415);
  assert.equal((await worker.fetch(request(valid, { 'Idempotency-Key': 'invalid' }), enabled)).status, 400);
});

test('GET bounds and cursor validation happen before SQL', async () => {
  for (const query of [
    'limit=0',
    'limit=51',
    'limit=-1',
    'limit=1.5',
    'cursor=bad',
    'spotIds=unknown',
    'genreIds=unknown',
  ]) {
    assert.equal(
      (await worker.fetch(new Request(`https://festival.example/api/posts?${query}`), enabled)).status,
      400,
    );
  }
});

test('GET without DB fails even when valid filters have an empty intersection', async () => {
  const spot = POST_TARGETS.find((target) => target.genreId)!;
  const otherGenre = GENRES.find((genre) => genre.id !== spot.genreId)!;
  const query = new URLSearchParams({ spotIds: spot.id, genreIds: otherGenre.id });
  const input = new Request(`https://festival.example/api/posts?${query}`);
  const response = await worker.fetch(input, { ...enabled, DB: undefined });
  assert.equal(response.status, 503);
  assert.match(response.headers.get('Cache-Control')!, /no-store/);
  const connected = await worker.fetch(input, enabled);
  assert.equal(connected.status, 200);
  assert.deepEqual(await connected.json(), { posts: [], nextCursor: null, acceptingPosts: true });
});

test('API paths never fall through to SPA; non-API paths use assets', async () => {
  for (const path of ['/api', '/api/unknown', '/api/posts/unknown']) {
    const response = await worker.fetch(new Request(`https://festival.example${path}`), enabled);
    assert.equal(response.status, 404);
    assert.match(response.headers.get('Content-Type')!, /application\/json/);
  }
  assert.equal(
    (await worker.fetch(new Request('https://festival.example/api/posts', { method: 'DELETE' }), enabled)).status,
    405,
  );
  assert.equal(
    await (await worker.fetch(new Request('https://festival.example/stamprally'), enabled)).text(),
    'static asset',
  );
});
