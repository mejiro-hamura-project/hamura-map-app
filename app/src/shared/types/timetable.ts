/** ステージの1演目（開始・終了時刻・演目名） */
export interface StageProgram {
  /** "11:00" のような24時間表記 */
  start: string;
  end: string;
  title: string;
}

/** どちらのステージか。地図上のSpotのstageKeyと対応させる */
export type StageKey = 'main' | 'sub';

/** 1日分のステージ別タイムテーブル */
export interface DailyStageTimetable {
  /** "2026-10-31" のようなISO日付。端末の今日の日付との突き合わせに使う */
  date: string;
  /** 画面表示用の日付ラベル。例："10/31(土)" */
  dateLabel: string;
  stages: Record<StageKey, StageProgram[]>;
}
