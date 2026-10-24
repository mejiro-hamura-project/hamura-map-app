import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { type Env } from './index';
import { MOCK_SPOTS } from '../src/mocks/spots';
import { STORE_SPOTS } from '../src/mocks/stores';
import { buildPostTargets, POST_TARGETS } from '../src/shared/postTargets';
import { GENRES } from '../src/shared/taxonomy';
import { COURSES } from '../src/features/stamprally/data/checkpoints';

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
  RALLY_SYNC_ENABLED: 'true',
  POST_RATE_LIMIT_SECRET: 'a'.repeat(32),
};
const headers = {
  'Content-Type': 'application/json',
  'Idempotency-Key': '00000000-0000-4000-8000-000000000001',
};
function request(input: unknown, overrides: Record<string, string> = {}) {
  return new Request('https://festival.example/api/posts', {
    method: 'POST',
    headers: { ...headers, ...overrides },
    body: JSON.stringify(input),
  });
}
const anonymousId = 'A0B1C2D3-E4F5-4A67-8B90-123456789ABC';
const valid = { anonymousId, spotId: POST_TARGETS[0].id, caption: '投稿テスト' };
const validParticipant = {
  anonymousId,
  registeredAt: '2026-10-25T01:02:03.000Z',
  gender: 'female',
  age: 20,
  isStudent: true,
  studentCategory: 'university',
  courseId: COURSES[0].id,
  exchangedAt: null,
};

interface RecordedStatement {
  sql: string;
  values: (string | number | null)[];
  bind(...values: (string | number | null)[]): RecordedStatement;
  all<T>(): Promise<{ results: T[] }>;
}

function recordingDatabase(onAll?: (statement: RecordedStatement) => unknown[]) {
  const statements: RecordedStatement[] = [];
  const DB = {
    prepare(sql: string) {
      const statement: RecordedStatement = {
        sql,
        values: [],
        bind(...values) {
          statement.values = values;
          return statement;
        },
        async all<T>() {
          statements.push(statement);
          return { results: (onAll?.(statement) ?? []) as T[] };
        },
      };
      return statement;
    },
    async batch<T>(batch: RecordedStatement[]) {
      const [insert] = batch;
      statements.push(...batch);
      return [
        { results: [] as T[] },
        {
          results: [
            {
              id: insert.values[0],
              spot_id: insert.values[1],
              caption: insert.values[2],
              created_at: insert.values[3],
              status: 'visible',
              author_hash: insert.values[6],
            },
          ] as T[],
        },
      ];
    },
  };
  return { DB: DB as unknown as NonNullable<Env['DB']>, statements };
}

function participantRequest(input: unknown, overrides: Record<string, string> = {}) {
  return new Request('https://festival.example/api/stamprally/participant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...overrides },
    body: JSON.stringify(input),
  });
}

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

test('posts use the canonical anonymous ID HMAC and do not depend on the client IP', async () => {
  const { DB, statements } = recordingDatabase();
  const response = await worker.fetch(
    request(valid, { 'CF-Connecting-IP': '192.0.2.1' }),
    { ...enabled, DB },
  );
  assert.equal(response.status, 201);
  const insert = statements[0];
  assert.match(insert.sql, /author_hash = \? AND created_ms > \?\) < 5/);
  assert.equal(insert.values[6], insert.values[7]);

  const participant = recordingDatabase(() => [{ participant_key: insert.values[6] }]);
  const saved = await worker.fetch(
    participantRequest({ ...validParticipant, anonymousId: anonymousId.toLowerCase() }),
    {
      ...enabled,
      DB: participant.DB,
    },
  );
  assert.equal(saved.status, 200);
  assert.equal(participant.statements[0].values[0], insert.values[6]);
  assert.doesNotMatch(await response.text(), /A0B1C2D3|author_hash|anonymousId/);

  const sameId = recordingDatabase();
  await worker.fetch(request(valid, { 'CF-Connecting-IP': '198.51.100.2' }), {
    ...enabled,
    DB: sameId.DB,
  });
  assert.equal(sameId.statements[0].values[6], insert.values[6]);

  const differentId = recordingDatabase();
  await worker.fetch(
    request(
      { ...valid, anonymousId: '00000000-0000-4000-8000-000000000002' },
      { 'CF-Connecting-IP': '192.0.2.1' },
    ),
    { ...enabled, DB: differentId.DB },
  );
  assert.notEqual(differentId.statements[0].values[6], insert.values[6]);
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
    { ...valid, anonymousId: undefined },
    { ...valid, anonymousId: 'invalid' },
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

test('participant snapshots reject disabled storage and invalid input before SQL', async () => {
  for (const env of [
    { ...enabled, RALLY_SYNC_ENABLED: undefined },
    { ...enabled, RALLY_SYNC_ENABLED: 'false' },
    { ...enabled, DB: undefined },
    { ...enabled, POST_RATE_LIMIT_SECRET: 'short' },
  ]) {
    assert.equal((await worker.fetch(participantRequest(validParticipant), env)).status, 503);
  }
  const invalid = [
    null,
    [],
    {},
    { ...validParticipant, anonymousId: 'invalid' },
    { ...validParticipant, registeredAt: '2026-10-25' },
    { ...validParticipant, gender: 'unknown' },
    { ...validParticipant, age: 0 },
    { ...validParticipant, age: 20.5 },
    { ...validParticipant, isStudent: false, studentCategory: 'university' },
    { ...validParticipant, studentCategory: 'elementary' },
    { ...validParticipant, courseId: 999999 },
    { ...validParticipant, exchangedAt: '2026-10-25T01:02:02.999Z' },
    { ...validParticipant, nickname: '保存しない' },
    { ...validParticipant, participantNumber: 1 },
    { ...validParticipant, stamps: [] },
  ];
  for (const input of invalid) {
    assert.equal((await worker.fetch(participantRequest(input), enabled)).status, 400);
  }
});

test('participant snapshot upsert preserves registration fields and only advances exchange state', async () => {
  const { DB, statements } = recordingDatabase((statement) => [
    { participant_key: statement.values[0] },
  ]);
  const response = await worker.fetch(
    participantRequest({ ...validParticipant, exchangedAt: '2026-10-25T03:00:00.000Z' }),
    { ...enabled, DB },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { saved: true });
  assert.match(response.headers.get('Cache-Control')!, /no-store/);
  assert.equal(statements.length, 1);
  const [statement] = statements;
  assert.match(statement.sql, /ON CONFLICT\(participant_key\) DO UPDATE SET/);
  assert.match(statement.sql, /WHEN excluded\.exchanged_at IS NULL THEN participants\.exchanged_at/);
  assert.match(statement.sql, /WHEN excluded\.exchanged_at < participants\.exchanged_at/);
  const updateClause = statement.sql.split('DO UPDATE SET')[1];
  assert.doesNotMatch(updateClause, /registered_at\s*=|gender\s*=|age\s*=|course_id\s*=/);
  assert.deepEqual(statement.values.slice(1), [
    validParticipant.registeredAt,
    validParticipant.gender,
    validParticipant.age,
    1,
    validParticipant.studentCategory,
    validParticipant.courseId,
    '2026-10-25T03:00:00.000Z',
  ]);
});

test('participant writes enforce origin, JSON transport, size, and POST-only routing', async () => {
  assert.equal(
    (await worker.fetch(participantRequest(validParticipant, { Origin: 'https://other.example' }), enabled))
      .status,
    403,
  );
  assert.equal(
    (await worker.fetch(participantRequest(validParticipant, { 'Sec-Fetch-Site': 'cross-site' }), enabled))
      .status,
    403,
  );
  assert.equal(
    (await worker.fetch(participantRequest(validParticipant, { 'Content-Type': 'text/plain' }), enabled))
      .status,
    415,
  );
  assert.equal(
    (
      await worker.fetch(
        participantRequest({ ...validParticipant, unexpected: 'x'.repeat(9000) }),
        enabled,
      )
    ).status,
    413,
  );
  const get = await worker.fetch(
    new Request('https://festival.example/api/stamprally/participant'),
    enabled,
  );
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('Allow'), 'POST');
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
