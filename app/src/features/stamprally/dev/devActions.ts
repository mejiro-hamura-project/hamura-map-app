/**
 * 開発モード専用のテスト操作（DEVパネルからだけ使う）。
 * 以前は useStampRally の中にあった処理を、内容を変えずにここへ移した。
 * useStampRally は import.meta.env.DEV のときだけこれを呼ぶため、本番ビルドには含まれない。
 */
import type { Dispatch, SetStateAction } from 'react';
import type { StampRallyState } from '../types';
import { EMPTY_STATE } from '../lib/stateStorage';
import { TOTAL_STAMPS, getCourseById } from '../data/checkpoints';

export function createDevActions(setState: Dispatch<SetStateAction<StampRallyState>>) {
  return {
    // テスト用: 現在のコースのスタンプをすべて取得済みにする。
    testCompleteAllStamps() {
      setState((prev) => {
        if (prev.courseId === null) return prev;
        const course = getCourseById(prev.courseId);
        if (!course) return prev;
        return { ...prev, collectedIds: course.checkpoints.map((c) => c.id) };
      });
    },
    // テスト用: スタンプ・お題・交換の進行状況だけを初期化する。
    // 参加者情報（登録内容）は削除しない。
    resetProgress() {
      setState((prev) => ({
        ...prev,
        collectedIds: [],
        phraseSlots: new Array(TOTAL_STAMPS).fill(null),
        phraseSolved: false,
        prizeExchanged: false,
      }));
    },
    // テスト用: デモを最初からやり直す（このブラウザの状態をすべて初期化する）。
    resetAll() {
      setState(EMPTY_STATE);
    },
  };
}

export type DevActions = ReturnType<typeof createDevActions>;
