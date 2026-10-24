import { storage } from '../../../shared/storage/storage';
import type { Gender, StampRallyState } from '../types';

export const PARTICIPANT_SYNC_QUEUE_KEY = 'stampRally.d1Sync.v1';
const PARTICIPANT_API_PATH = '/api/stamprally/participant';
const DEFAULT_TIMEOUT_MS = 10_000;

export interface ParticipantSnapshot {
  anonymousId: string;
  registeredAt: string;
  gender: Gender;
  age: number;
  isStudent: boolean;
  studentCategory: string | null;
  courseId: number;
  exchangedAt: string | null;
}

interface SyncOptions {
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

let inFlight: Promise<void> | null = null;
let rerunRequested = false;

export function createParticipantSnapshot(state: StampRallyState): ParticipantSnapshot | null {
  const { registration } = state;
  if (!registration || !state.participantId || state.courseId === null || !state.startedAt) {
    return null;
  }
  return {
    anonymousId: state.participantId,
    registeredAt: state.startedAt,
    gender: registration.gender,
    age: registration.age,
    isStudent: registration.isStudent,
    studentCategory: registration.studentCategory ?? null,
    courseId: state.courseId,
    exchangedAt: state.exchangedAt,
  };
}

/** 最新状態を先に永続化し、その後にD1 APIへベストエフォートで送る。 */
export function queueParticipantSync(
  snapshot: ParticipantSnapshot,
  options?: SyncOptions,
): Promise<void> {
  try {
    storage.set(PARTICIPANT_SYNC_QUEUE_KEY, snapshot);
  } catch {
    return Promise.resolve();
  }
  return flushParticipantSync(options);
}

/** アプリ起動時・オンライン復帰時に未送信の最新状態を再送する。 */
export function flushParticipantSync(options: SyncOptions = {}): Promise<void> {
  if (inFlight) {
    rerunRequested = true;
    return inFlight;
  }
  rerunRequested = false;
  const fetcher = options.fetcher ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  inFlight = drainQueue(fetcher, timeoutMs).finally(() => {
    inFlight = null;
    if (rerunRequested) void flushParticipantSync(options);
  });
  return inFlight;
}

async function drainQueue(fetcher: typeof fetch, timeoutMs: number): Promise<void> {
  while (true) {
    const snapshot = loadQueuedSnapshot();
    if (!snapshot) return;

    const sent = await postSnapshot(snapshot, fetcher, timeoutMs);
    if (!sent) return;

    const latest = loadQueuedSnapshot();
    if (latest && snapshotsEqual(latest, snapshot)) {
      try {
        storage.remove(PARTICIPANT_SYNC_QUEUE_KEY);
      } catch {
        return;
      }
    }
    // 送信中に登録→交換などの更新があれば、上書き済みの最新1件を続けて送る。
  }
}

function loadQueuedSnapshot(): ParticipantSnapshot | null {
  try {
    const value = storage.get<unknown>(PARTICIPANT_SYNC_QUEUE_KEY, null);
    return isParticipantSnapshot(value) ? value : null;
  } catch {
    return null;
  }
}

async function postSnapshot(
  snapshot: ParticipantSnapshot,
  fetcher: typeof fetch,
  timeoutMs: number,
): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(PARTICIPANT_API_PATH, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot),
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const result = await response.json() as { saved?: unknown };
    return result?.saved === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function snapshotsEqual(left: ParticipantSnapshot, right: ParticipantSnapshot): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isParticipantSnapshot(value: unknown): value is ParticipantSnapshot {
  if (!value || typeof value !== 'object') return false;
  const snapshot = value as Record<string, unknown>;
  return (
    typeof snapshot.anonymousId === 'string' &&
    typeof snapshot.registeredAt === 'string' &&
    (snapshot.gender === 'male' || snapshot.gender === 'female' || snapshot.gender === 'other') &&
    typeof snapshot.age === 'number' &&
    typeof snapshot.isStudent === 'boolean' &&
    (snapshot.studentCategory === null || typeof snapshot.studentCategory === 'string') &&
    typeof snapshot.courseId === 'number' &&
    (snapshot.exchangedAt === null || typeof snapshot.exchangedAt === 'string')
  );
}
