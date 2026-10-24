import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { COURSES, findCheckpointByQrValue } from '../../src/features/stamprally/data/checkpoints';
import { createStampRallyReadPort } from '../../src/features/stamprally/integrations/readPort';
import { EMPTY_STATE, loadState, STORAGE_KEY } from '../../src/features/stamprally/lib/stateStorage';
import { issueNextParticipantNumber } from '../../src/features/stamprally/hooks/useStampRally';
import type { StampRallyState } from '../../src/features/stamprally/types';

const values = new Map<string, string>();
const registration = { nickname: 'Fixture participant', gender: 'other' as const, age: 20, isStudent: false };

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

test('current v2 fixture keeps registration, progress, course IDs and exchange timestamps', () => {
  const fixture: StampRallyState = {
    registration,
    participantId: 'fixture-id',
    participantNumber: 12,
    courseId: 2,
    collectedIds: [10, 8],
    phraseSlots: [8, null, 10, null, null, null, null],
    phraseSolved: false,
    prizeExchanged: false,
    startedAt: '2026-09-28T00:00:00.000Z',
    exchangedAt: null,
  };
  values.set(STORAGE_KEY, JSON.stringify(fixture));
  assert.deepEqual(loadState(), fixture);
  const exchangedAt = '2026-09-28T01:00:00.000Z';
  values.set(STORAGE_KEY, JSON.stringify({ ...fixture, phraseSolved: true, prizeExchanged: true, exchangedAt }));
  assert.equal(loadState().exchangedAt, exchangedAt);
});

test('incomplete v2 fixtures are read without inventing a course or rewriting storage', () => {
  const raw = JSON.stringify({ registration, collectedIds: [1], phraseSlots: [1] });
  values.set(STORAGE_KEY, raw);
  const state = loadState();
  assert.equal(state.courseId, null);
  assert.equal(state.participantNumber, null);
  assert.deepEqual(state.phraseSlots, [1, null, null, null, null, null, null]);
  assert.equal(values.get(STORAGE_KEY), raw);
  assert.equal(createStampRallyReadPort().getCheckpointStatuses(), null);
});

test('legacy v1 state is not migrated or deleted', () => {
  const legacyKey = 'stampRally.v1';
  const raw = JSON.stringify({ registration, courseId: 1, collectedIds: [1] });
  values.set(legacyKey, raw);
  assert.deepEqual(loadState(), EMPTY_STATE);
  assert.equal(values.get(legacyKey), raw);
  assert.equal(values.has(STORAGE_KEY), false);
});

test('empty and malformed storage retain the legacy empty fallback', () => {
  assert.deepEqual(loadState(), EMPTY_STATE);
  values.set(STORAGE_KEY, '{broken JSON');
  assert.deepEqual(loadState(), EMPTY_STATE);
});

test('each course maps internal IDs to seven physical positions', () => {
  for (const course of COURSES) {
    for (const checkpoint of course.checkpoints) {
      const position = checkpoint.phraseIndex + 1;
      assert.equal(findCheckpointByQrValue(course.id, `stamp-rally-position-${position}`)?.id, (course.id - 1) * 7 + position);
      const state: StampRallyState = {
        ...EMPTY_STATE, registration, courseId: course.id, collectedIds: [checkpoint.id],
      };
      const port = createStampRallyReadPort(() => state);
      assert.equal(port.isRegistered(), true);
      assert.deepEqual(port.getCheckpointStatuses(), Array.from({ length: 7 }, (_, index) => ({
        checkpointId: index + 1,
        collected: index === checkpoint.phraseIndex,
      })));
    }
    assert.equal(findCheckpointByQrValue(course.id, 'unrelated-qr'), undefined);
  }
});

test('read adapter rereads persisted progress instead of owning a second state', () => {
  const port = createStampRallyReadPort();
  assert.equal(port.isRegistered(), false);
  values.set(STORAGE_KEY, JSON.stringify({ ...EMPTY_STATE, registration, courseId: 2, collectedIds: [8] }));
  assert.equal(port.getCheckpointStatuses()?.[0].collected, true);
  values.set(STORAGE_KEY, JSON.stringify({ ...EMPTY_STATE, registration, courseId: 2 }));
  assert.equal(port.getCheckpointStatuses()?.[0].collected, false);
});

test('participant counter keeps its raw format independently of main state and both sync queue keys', () => {
  const counterKey = 'stampRally.participantCounter.v1';
  const oldQueueKey = 'stampRally.sheetSyncQueue.v1';
  const d1QueueKey = 'stampRally.d1Sync.v1';
  values.set(counterKey, '12');
  values.set(oldQueueKey, '[{"participantNumber":11}]');
  values.set(d1QueueKey, '{"anonymousId":"queued"}');
  assert.equal(issueNextParticipantNumber(), 12);
  assert.equal(values.get(counterKey), '13');
  values.set(STORAGE_KEY, JSON.stringify(EMPTY_STATE));
  assert.equal(issueNextParticipantNumber(), 13);
  assert.equal(values.get(counterKey), '14');
  assert.equal(values.get(oldQueueKey), '[{"participantNumber":11}]');
  assert.equal(values.get(d1QueueKey), '{"anonymousId":"queued"}');
});
