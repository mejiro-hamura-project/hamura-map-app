export type Gender = 'male' | 'female' | 'other';

// 学校区分（「学生」を選んだ場合のみ使用）。
export type StudentCategory = 'elementary' | 'juniorHigh' | 'highSchool' | 'university';

export interface Registration {
  nickname: string;
  gender: Gender;
  /** 数値の年齢（プルダウンの年代区分ではなく、入力式の実年齢）。 */
  age: number;
  isStudent: boolean;
  /** isStudent が true の場合のみ保持する。学生でない場合は undefined（保存しない）。 */
  studentCategory?: StudentCategory;
}

export interface Checkpoint {
  id: number;
  qrValue: string;
  char: string;
  phraseIndex: number;
}

// スタンプラリーの1コース＝7つのチェックポイントと、それが組み上がる1つの答え。
export interface Course {
  id: number;
  answerId: string;
  checkpoints: Checkpoint[];
}

export interface StampRallyState {
  registration: Registration | null;
  /** 個人情報を含まない、参加者を識別するための内部ID（サーバー同期の突合キー）。 */
  participantId: string | null;
  /** この端末（ブラウザ）でスタンプラリーを開始した順に1から付与する番号。サーバーは使わない。 */
  participantNumber: number | null;
  /** 参加者に割り当てられたコース（登録時に1回だけ決定し、以後変化しない）。 */
  courseId: number | null;
  collectedIds: number[];
  /** お題（キーワード）の並べ替え中の状態。位置ごとのチェックポイントIDを保持する。 */
  phraseSlots: (number | null)[];
  phraseSolved: boolean;
  prizeExchanged: boolean;
  /** 参加登録が完了した日時（ISO 8601 / UTC）。 */
  startedAt: string | null;
}
