import type { DailyStageTimetable, StageProgram } from '../types';

export function toMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return hours * 60 + minutes;
}

export type CurrentProgramStatus = {
  /** 今の時刻が範囲内の演目。無ければnull */
  current: StageProgram | null;
  /** 今より後に始まる、一番近い演目。無ければnull */
  next: StageProgram | null;
};

/**
 * 演目一覧と「今の時刻」から、上演中・次の演目を判定する共通ロジック。
 * イベント一覧のタイムテーブル画面・地図のステージ吹き出しの両方がこれだけを参照することで、
 * 「今何が上演中か」の判定がズレないようにする。
 * 日付はまたがない前提（時刻部分だけを比較する）。
 */
export function getCurrentProgramStatus(programs: StageProgram[], now: Date): CurrentProgramStatus {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const current = programs.find((p) => toMinutes(p.start) <= nowMinutes && nowMinutes < toMinutes(p.end)) ?? null;
  const next = programs.find((p) => toMinutes(p.start) > nowMinutes) ?? null;
  return { current, next };
}

/**
 * 「今の演目名」または、上演中の演目が無いときの状態文言（開始前です等）を返す。
 * イベント一覧のタイムテーブル・地図のステージ吹き出しの両方がこれを使うことで、
 * 「常時何かしら表示される」状態を共通で保証する。
 */
export function getStageStatusText(programs: StageProgram[], now: Date): string {
  const { current } = getCurrentProgramStatus(programs, now);
  if (current) return current.title;
  if (programs.length === 0) return '本日の演目はありません';
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes < toMinutes(programs[0].start)) return '開始前です';
  if (nowMinutes >= toMinutes(programs[programs.length - 1].end)) return '本日の上演は終了しました';
  return 'ただいま準備中です';
}

/**
 * タイムテーブルの中から「今日」に対応する1日分を選ぶ。
 * 端末の実際の日付と一致するものがあればそれを使い、無ければ（ダミーデータ・開催期間外など）
 * 先頭の1日分にフォールバックする。
 */
export function getTimetableForToday(timetable: DailyStageTimetable[], now: Date): DailyStageTimetable | undefined {
  const todayIso = now.toISOString().slice(0, 10);
  return timetable.find((day) => day.date === todayIso) ?? timetable[0];
}
