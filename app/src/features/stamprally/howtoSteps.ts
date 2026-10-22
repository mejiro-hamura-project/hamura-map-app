/**
 * スタンプラリーの5つの手順（①〜⑤）と、各画面・進捗状態との対応を一元管理する。
 * 手順の文言は i18n の flow.steps にあり、番号付きの表示は必ず formatStepInstruction を通す
 * （画面上部の操作指示と遊び方画面の見出しを完全に一致させるため）。
 */
export type FlowStepNumber = 1 | 2 | 3 | 4 | 5;

export const FLOW_STEP_COUNT = 5;

/**
 * 各画面が何番の手順にあたるか。
 * null＝手順より前の画面（注意事項・遊び方）。この2画面ではプログレスバー自体を表示しない。
 */
export const FLOW_STEP_BY_SCREEN = {
  notice: null,
  howto: null,
  register: 1,
  /** 7つ揃う前のスタンプ一覧・カメラ・取得演出：QRコードを読み取ってスタンプを集める */
  rallyCollecting: 2,
  camera: 2,
  reveal: 2,
  /** 7つ揃った後のスタンプ一覧（「文字を並べる」へ進む画面） */
  rallyComplete: 3,
  /** 文字の並べ替え・判定の画面 */
  challenge: 4,
  /** お題の正解後（正解表示・スタンプ一覧）：次にするのは景品交換 */
  afterPhraseSolved: 5,
  exchange: 5,
} as const satisfies Record<string, FlowStepNumber | null>;

const CIRCLED_NUMBERS = ['①', '②', '③', '④', '⑤'] as const;

/** 「① 参加登録をしよう！」の形式に整える（画面上部・遊び方画面で共通）。 */
export function formatStepInstruction(step: number, instruction: string): string {
  return `${CIRCLED_NUMBERS[step - 1]} ${instruction}`;
}

export type StepStatus = 'done' | 'current' | 'todo';

/** 進捗の判定に使う既存の状態（useStampRally の値をそのまま渡す。新しい保存項目は作らない）。 */
export interface ExistingProgress {
  registered: boolean;
  isComplete: boolean;
  phraseSolved: boolean;
  prizeExchanged: boolean;
}

/** 既存の保存データから「実際に完了している」最後の手順番号を求める（0＝まだ何も完了していない）。 */
function lastStepCompletedByData({ registered, isComplete, phraseSolved, prizeExchanged }: ExistingProgress): number {
  if (prizeExchanged) return 5; // 景品交換済み
  if (phraseSolved) return 4; // お題（キーワード）正解＝整理・判定まで完了
  if (isComplete) return 2; // 7つのスタンプを取得済み＝読み取りまで完了
  if (registered) return 1; // 参加登録済み
  return 0;
}

/**
 * 各手順（1〜5）の状態。
 * - 完了：既存の保存データで完了が確認できる手順と、今の画面より前の手順（画面遷移上、通過済み）
 * - 操作中：今の画面の手順（景品交換まで終わっていれば、すべて完了として表示）
 * - 未着手：それ以外
 * 今の画面の手順は、開いただけでは完了にしない。
 */
export function getStepStatuses(current: FlowStepNumber | null, progress: ExistingProgress): StepStatus[] {
  const lastDone = lastStepCompletedByData(progress);
  return Array.from({ length: FLOW_STEP_COUNT }, (_, i) => {
    const step = i + 1;
    if (step === current && !progress.prizeExchanged) return 'current';
    if (step <= lastDone || (current !== null && step < current)) return 'done';
    return 'todo';
  });
}
