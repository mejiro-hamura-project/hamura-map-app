import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import {
  PARTICIPANT_SYNC_QUEUE_KEY,
  createParticipantSnapshot,
  flushParticipantSync,
  queueParticipantSync,
  type ParticipantSnapshot,
} from '../../src/features/stamprally/lib/participantSync';
import { EMPTY_STATE } from '../../src/features/stamprally/lib/stateStorage';

const values = new Map<string, string>();
const registrationSnapshot: ParticipantSnapshot = {
  anonymousId: '2c7445d2-4157-4e65-993c-9dc46ed4521a',
  registeredAt: '2026-10-25T01:00:00.000Z',
  gender: 'other',
  age: 20,
  isStudent: false,
  studentCategory: null,
  courseId: 2,
  exchangedAt: null,
};

beforeEach(() => {
  values.clear();
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => { values.set(key, value); },
        removeItem: (key: string) => { values.delete(key); },
      },
    },
  });
});

afterEach(() => { Reflect.deleteProperty(globalThis, 'window'); });

test('participant snapshot contains only the D1 participant fields', () => {
  const snapshot = createParticipantSnapshot({
    ...EMPTY_STATE,
    registration: {
      nickname: 'not sent',
      gender: 'female',
      age: 16,
      isStudent: true,
      studentCategory: 'highSchool',
    },
    participantId: registrationSnapshot.anonymousId,
    participantNumber: 99,
    courseId: 3,
    collectedIds: [15, 16],
    startedAt: registrationSnapshot.registeredAt,
  });
  assert.deepEqual(snapshot, {
    anonymousId: registrationSnapshot.anonymousId,
    registeredAt: registrationSnapshot.registeredAt,
    gender: 'female',
    age: 16,
    isStudent: true,
    studentCategory: 'highSchool',
    courseId: 3,
    exchangedAt: null,
  });
  assert.equal('nickname' in snapshot!, false);
  assert.equal('participantNumber' in snapshot!, false);
  assert.equal('collectedIds' in snapshot!, false);
});

test('queue is saved before POST and removed after a successful response', async () => {
  const requests: ParticipantSnapshot[] = [];
  const fetcher = (async (_input, init) => {
    assert.equal(values.get(PARTICIPANT_SYNC_QUEUE_KEY), JSON.stringify(registrationSnapshot));
    assert.equal(init?.cache, 'no-store');
    requests.push(JSON.parse(String(init?.body)) as ParticipantSnapshot);
    return new Response(JSON.stringify({ saved: true }), { status: 200 });
  }) as typeof fetch;

  await queueParticipantSync(registrationSnapshot, { fetcher });

  assert.deepEqual(requests, [registrationSnapshot]);
  assert.equal(values.has(PARTICIPANT_SYNC_QUEUE_KEY), false);
});

test('network and non-2xx failures retain the latest queued snapshot', async () => {
  const failingFetch = (async () => { throw new TypeError('offline'); }) as typeof fetch;
  await queueParticipantSync(registrationSnapshot, { fetcher: failingFetch });
  assert.equal(values.get(PARTICIPANT_SYNC_QUEUE_KEY), JSON.stringify(registrationSnapshot));

  const unavailableFetch = (async () => new Response(null, { status: 503 })) as typeof fetch;
  await flushParticipantSync({ fetcher: unavailableFetch });
  assert.equal(values.get(PARTICIPANT_SYNC_QUEUE_KEY), JSON.stringify(registrationSnapshot));
});

test('a newer exchange snapshot queued in flight is sent next and is not lost', async () => {
  let releaseFirst!: () => void;
  const firstBlocked = new Promise<void>((resolve) => { releaseFirst = resolve; });
  const bodies: ParticipantSnapshot[] = [];
  const fetcher = (async (_input, init) => {
    bodies.push(JSON.parse(String(init?.body)) as ParticipantSnapshot);
    if (bodies.length === 1) await firstBlocked;
    return new Response(JSON.stringify({ saved: true }), { status: 200 });
  }) as typeof fetch;

  const registrationSend = queueParticipantSync(registrationSnapshot, { fetcher });
  await Promise.resolve();
  const exchangeSnapshot = {
    ...registrationSnapshot,
    exchangedAt: '2026-10-25T02:00:00.000Z',
  };
  const exchangeSend = queueParticipantSync(exchangeSnapshot, { fetcher });
  assert.equal(values.get(PARTICIPANT_SYNC_QUEUE_KEY), JSON.stringify(exchangeSnapshot));

  releaseFirst();
  await Promise.all([registrationSend, exchangeSend]);

  assert.deepEqual(bodies, [registrationSnapshot, exchangeSnapshot]);
  assert.equal(values.has(PARTICIPANT_SYNC_QUEUE_KEY), false);
});

test('timed out requests retain the queue for a later app-start or online retry', async () => {
  const hangingFetch = ((_input: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    })) as typeof fetch;

  await queueParticipantSync(registrationSnapshot, { fetcher: hangingFetch, timeoutMs: 5 });
  assert.equal(values.get(PARTICIPANT_SYNC_QUEUE_KEY), JSON.stringify(registrationSnapshot));
});

test('HTML or non-saving JSON responses do not discard unsent registration', async () => {
  for (const body of ['<html>old SPA</html>', '{"saved":false}', '{"other":true}']) {
    await queueParticipantSync(registrationSnapshot, {
      fetcher: (async () => new Response(body, { status: 200 })) as typeof fetch,
    });
    assert.equal(values.get(PARTICIPANT_SYNC_QUEUE_KEY), JSON.stringify(registrationSnapshot));
  }
});
