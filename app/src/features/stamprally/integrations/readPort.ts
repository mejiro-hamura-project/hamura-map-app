import type { StampRallyReadPort } from '../../../shared/integrations/stampRally/types';
import type { StampRallyState } from '../types';
import { getCourseById } from '../data/checkpoints';
import { loadState } from '../lib/stateStorage';

/** 永続化された既存状態を読むだけ。hook/stateの2つ目の所有者を作らない。 */
export function createStampRallyReadPort(readState: () => StampRallyState = loadState): StampRallyReadPort {
  return {
    isRegistered() {
      return readState().registration !== null;
    },
    getCheckpointStatuses() {
      const state = readState();
      if (!state.registration || state.courseId === null) return null;
      const course = getCourseById(state.courseId);
      if (!course) return null;
      return course.checkpoints.map((checkpoint) => ({
        checkpointId: checkpoint.phraseIndex + 1,
        collected: state.collectedIds.includes(checkpoint.id),
      }));
    },
  };
}

export const stampRallyReadPort = createStampRallyReadPort();
