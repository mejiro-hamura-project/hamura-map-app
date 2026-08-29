import { useCallback, useEffect, useState } from 'react';
import type { Registration, StampRallyState } from '../types';
import { TOTAL_STAMPS } from '../data/checkpoints';

const STORAGE_KEY = 'stampRally.v1';

const EMPTY_STATE: StampRallyState = {
  registration: null,
  collectedIds: [],
  phraseSolved: false,
  prizeExchanged: false,
};

function loadState(): StampRallyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return {
      registration: parsed.registration ?? null,
      collectedIds: Array.isArray(parsed.collectedIds) ? parsed.collectedIds : [],
      phraseSolved: Boolean(parsed.phraseSolved),
      prizeExchanged: Boolean(parsed.prizeExchanged),
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function useStampRally() {
  const [state, setState] = useState<StampRallyState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const register = useCallback((registration: Registration) => {
    setState((prev) => ({ ...prev, registration }));
  }, []);

  const addStamp = useCallback((id: number) => {
    setState((prev) =>
      prev.collectedIds.includes(id)
        ? prev
        : { ...prev, collectedIds: [...prev.collectedIds, id] },
    );
  }, []);

  const solvePhrase = useCallback(() => {
    setState((prev) => ({ ...prev, phraseSolved: true }));
  }, []);

  const exchangePrize = useCallback(() => {
    setState((prev) => ({ ...prev, prizeExchanged: true }));
  }, []);

  const resetAll = useCallback(() => {
    setState(EMPTY_STATE);
  }, []);

  const isCollected = useCallback(
    (id: number) => state.collectedIds.includes(id),
    [state.collectedIds],
  );

  const isComplete = state.collectedIds.length >= TOTAL_STAMPS;

  return {
    registration: state.registration,
    collectedIds: state.collectedIds,
    phraseSolved: state.phraseSolved,
    prizeExchanged: state.prizeExchanged,
    collectedCount: state.collectedIds.length,
    isComplete,
    canChallenge: isComplete && !state.phraseSolved,
    register,
    addStamp,
    solvePhrase,
    exchangePrize,
    isCollected,
    resetAll,
  };
}

export type UseStampRally = ReturnType<typeof useStampRally>;
