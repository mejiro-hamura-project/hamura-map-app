import { storage } from '../../../shared/storage/storage';
import { loadState, STORAGE_KEY } from '../lib/stateStorage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Registration, StampRallyState } from '../types';
import { TOTAL_STAMPS } from '../data/checkpoints';
import { createDevActions } from '../dev/devActions';
import { getAnonymousId } from '../../../shared/utils/deviceUser';
import { createParticipantSnapshot, queueParticipantSync } from '../lib/participantSync';

// 参加者番号（この端末でスタンプラリーを開始した順の通し番号）専用のカウンター。
// participantごとの状態（STORAGE_KEY）とは別に持ち、DEVパネルのリセット（resetAll/resetProgress）で
// 消えないようにする（同じ端末で次に登録する人が「続きの番号」になるため）。
const COUNTER_KEY = 'stampRally.participantCounter.v1';


// 次に発行する参加者番号を1つ払い出し、カウンター（「次に払い出す番号」）を進める。
// サーバーは使わず、この端末のlocalStorageだけで完結する。
// 呼び出し側（RegisterScreen）で1回だけ呼ぶこと。setStateのupdater関数の中では
// 呼ばない（React 18+のStrictModeはupdater関数を開発時に二重実行するため、
// ここに副作用（localStorage書き込み）を置くとカウンターが二重に進んでしまう）。
export function issueNextParticipantNumber(): number {
  try {
    const raw = storage.getRaw(COUNTER_KEY);
    const stored = raw ? Number(raw) : NaN;
    const toAssign = Number.isFinite(stored) && stored >= 1 ? stored : 1;
    storage.setRaw(COUNTER_KEY, String(toAssign + 1));
    return toAssign;
  } catch {
    // localStorageが使えない環境では、通し番号は維持できないため常に1を返す。
    return 1;
  }
}

export function useStampRally() {
  const [state, setState] = useState<StampRallyState>(loadState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    storage.set(STORAGE_KEY, state);
  }, [state]);

  // 匿名IDと開始日時はこのhookで一度だけ確定する。共通匿名IDは口コミと同じものを使う。
  const register = useCallback(
    (registration: Registration, participantNumber: number, courseId: number) => {
      const current = stateRef.current;
      const nextState: StampRallyState = {
        ...current,
        registration,
        participantId: current.participantId ?? getAnonymousId(),
        participantNumber: current.participantNumber ?? participantNumber,
        courseId: current.courseId ?? courseId,
        startedAt: current.startedAt ?? new Date().toISOString(),
      };
      stateRef.current = nextState;
      setState(nextState);
      const snapshot = createParticipantSnapshot(nextState);
      if (snapshot) void queueParticipantSync(snapshot);
    },
    [],
  );

  const addStamp = useCallback((id: number) => {
    setState((prev) =>
      prev.collectedIds.includes(id)
        ? prev
        : { ...prev, collectedIds: [...prev.collectedIds, id] },
    );
  }, []);

  const setPhraseSlots = useCallback((slots: (number | null)[]) => {
    setState((prev) => ({ ...prev, phraseSlots: slots }));
  }, []);

  const solvePhrase = useCallback(() => {
    setState((prev) => ({ ...prev, phraseSolved: true }));
  }, []);

  // 景品交換はローカルで先に確定し、初回時刻を保持したままD1へ非同期送信する。
  const exchangePrize = useCallback(() => {
    const current = stateRef.current;
    if (current.prizeExchanged) return;
    const nextState: StampRallyState = {
      ...current,
      prizeExchanged: true,
      exchangedAt: current.exchangedAt ?? new Date().toISOString(),
    };
    stateRef.current = nextState;
    setState(nextState);
    const snapshot = createParticipantSnapshot(nextState);
    if (snapshot) void queueParticipantSync(snapshot);
  }, []);

  // 開発モード専用のテスト操作（DEVパネルからだけ使う。処理は dev/devActions.ts）。
  // import.meta.env.DEV はビルド時に false へ置き換わるため、本番ビルドでは null になり、
  // テスト操作の処理そのものがバンドルに含まれない。
  const devActions = useMemo(() => (import.meta.env.DEV ? createDevActions(setState) : null), []);

  const isCollected = useCallback(
    (id: number) => state.collectedIds.includes(id),
    [state.collectedIds],
  );

  const isComplete = state.collectedIds.length >= TOTAL_STAMPS;

  return {
    registration: state.registration,
    participantId: state.participantId,
    participantNumber: state.participantNumber,
    courseId: state.courseId,
    collectedIds: state.collectedIds,
    phraseSlots: state.phraseSlots,
    phraseSolved: state.phraseSolved,
    prizeExchanged: state.prizeExchanged,
    startedAt: state.startedAt,
    exchangedAt: state.exchangedAt,
    collectedCount: state.collectedIds.length,
    isComplete,
    register,
    addStamp,
    setPhraseSlots,
    solvePhrase,
    exchangePrize,
    devActions,
    isCollected,
  };
}

export type UseStampRally = ReturnType<typeof useStampRally>;
