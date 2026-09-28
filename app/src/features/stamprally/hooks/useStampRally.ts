import { storage } from '../../../shared/storage/storage';
import { EMPTY_STATE, loadState, STORAGE_KEY } from '../lib/stateStorage';
import { useCallback, useEffect, useState } from 'react';
import type { Registration, StampRallyState } from '../types';
import { TOTAL_STAMPS, getCourseById } from '../data/checkpoints';

// 参加者番号（この端末でスタンプラリーを開始した順の通し番号）専用のカウンター。
// participantごとの状態（STORAGE_KEY）とは別に持ち、resetAll/resetProgressで
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

  useEffect(() => {
    storage.set(STORAGE_KEY, state);
  }, [state]);

  // participantId・courseId・startedAt・participantNumber は呼び出し元（登録画面）で
  // 1回だけ渡す。?? で既存値を優先するため、誤って複数回呼ばれても上書きされない。
  const register = useCallback(
    (
      registration: Registration,
      participantId: string,
      participantNumber: number,
      courseId: number,
      startedAt: string,
    ) => {
      setState((prev) => ({
        ...prev,
        registration,
        participantId: prev.participantId ?? participantId,
        participantNumber: prev.participantNumber ?? participantNumber,
        courseId: prev.courseId ?? courseId,
        startedAt: prev.startedAt ?? startedAt,
      }));
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

  // テスト用: 現在のコースのスタンプをすべて取得済みにする。
  const testCompleteAllStamps = useCallback(() => {
    setState((prev) => {
      if (prev.courseId === null) return prev;
      const course = getCourseById(prev.courseId);
      if (!course) return prev;
      return { ...prev, collectedIds: course.checkpoints.map((c) => c.id) };
    });
  }, []);

  const setPhraseSlots = useCallback((slots: (number | null)[]) => {
    setState((prev) => ({ ...prev, phraseSlots: slots }));
  }, []);

  const solvePhrase = useCallback(() => {
    setState((prev) => ({ ...prev, phraseSolved: true }));
  }, []);

  // 景品交換の確定（ローカル状態）。Googleスプレッドシートへの保存が成功した
  // 後に呼び出し元（景品交換画面）から呼ばれる。
  const exchangePrize = useCallback(() => {
    setState((prev) => ({ ...prev, prizeExchanged: true }));
  }, []);

  // テスト用: スタンプ・お題・交換の進行状況だけを初期化する。
  // 参加者情報（登録内容）は削除しない。
  const resetProgress = useCallback(() => {
    setState((prev) => ({
      ...prev,
      collectedIds: [],
      phraseSlots: new Array(TOTAL_STAMPS).fill(null),
      phraseSolved: false,
      prizeExchanged: false,
    }));
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
    participantId: state.participantId,
    participantNumber: state.participantNumber,
    courseId: state.courseId,
    collectedIds: state.collectedIds,
    phraseSlots: state.phraseSlots,
    phraseSolved: state.phraseSolved,
    prizeExchanged: state.prizeExchanged,
    startedAt: state.startedAt,
    collectedCount: state.collectedIds.length,
    isComplete,
    register,
    addStamp,
    testCompleteAllStamps,
    setPhraseSlots,
    solvePhrase,
    exchangePrize,
    resetProgress,
    resetAll,
    isCollected,
  };
}

export type UseStampRally = ReturnType<typeof useStampRally>;
