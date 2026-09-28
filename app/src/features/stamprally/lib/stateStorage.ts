import type { StampRallyState } from '../types';
import { TOTAL_STAMPS } from '../data/checkpoints';
import { storage } from '../../../shared/storage/storage';

export const STORAGE_KEY = 'stampRally.v1';

export const EMPTY_STATE: StampRallyState = {
  registration: null,
  participantId: null,
  participantNumber: null,
  courseId: null,
  collectedIds: [],
  phraseSlots: new Array(TOTAL_STAMPS).fill(null),
  phraseSolved: false,
  prizeExchanged: false,
  startedAt: null,
};


export function loadState(): StampRallyState {
  try {
    const raw = storage.getRaw(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    const phraseSlots = Array.isArray(parsed.phraseSlots)
      ? parsed.phraseSlots.slice(0, TOTAL_STAMPS)
      : [];
    while (phraseSlots.length < TOTAL_STAMPS) phraseSlots.push(null);
    return {
      registration: parsed.registration ?? null,
      participantId: typeof parsed.participantId === 'string' ? parsed.participantId : null,
      participantNumber: typeof parsed.participantNumber === 'number' ? parsed.participantNumber : null,
      courseId: typeof parsed.courseId === 'number' ? parsed.courseId : null,
      collectedIds: Array.isArray(parsed.collectedIds) ? parsed.collectedIds : [],
      phraseSlots,
      phraseSolved: Boolean(parsed.phraseSolved),
      prizeExchanged: Boolean(parsed.prizeExchanged),
      startedAt: typeof parsed.startedAt === 'string' ? parsed.startedAt : null,
    };
  } catch {
    return EMPTY_STATE;
  }
}
