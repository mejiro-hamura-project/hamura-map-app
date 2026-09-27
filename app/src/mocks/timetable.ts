import type { DailyStageTimetable } from '../shared/types';

/**
 * ステージのタイムテーブル見本データ。
 * 今年の正式な演目データが決まり次第、このファイルだけ差し替える想定
 * （表示・判定の仕組みには手を加えなくてよい）。
 * 現在の内容は去年のチラシ由来のダミー（docs/ステージタイムテーブル_2列版_見本.html 参照）。
 */
export const MOCK_TIMETABLE: DailyStageTimetable[] = [
  {
    date: '2026-10-31',
    dateLabel: '10/31(土)',
    stages: {
      main: [
        { start: '11:00', end: '11:20', title: '羽村市立西小学校（楽器演奏）' },
        { start: '11:20', end: '11:45', title: '羽村市立富士見小学校（楽器演奏）' },
        { start: '11:45', end: '12:15', title: '東京ミッドウエスト吹奏楽団ジュニア部' },
        { start: '12:15', end: '12:45', title: 'DANCE STUDIO BUZZ 羽村校（ダンス）' },
        { start: '12:45', end: '13:00', title: '想ふ華月（よさこい）' },
        { start: '13:00', end: '13:20', title: '開会式' },
        { start: '13:20', end: '13:50', title: '羽村太鼓普及会（和太鼓演奏）' },
        { start: '13:50', end: '14:20', title: 'ウニアン・ドス・アマドーリス（サンバ）' },
        { start: '14:20', end: '14:50', title: 'A-VICTORY DANCE STUDIO' },
        { start: '14:50', end: '15:20', title: 'カントリーラインダンス Apple Jack' },
        { start: '15:20', end: '15:50', title: 'NFPFD（ダンス）' },
        { start: '15:50', end: '16:00', title: '閉会式' },
      ],
      sub: [
        { start: '11:00', end: '11:30', title: '羽村第一小学校（合唱）' },
        { start: '11:30', end: '12:00', title: 'はむら子どもみこし太鼓' },
        { start: '12:00', end: '12:40', title: 'フラダンス教室 アロハ' },
        { start: '13:00', end: '13:30', title: 'ダンスサークル Rhythm' },
        { start: '13:30', end: '14:10', title: '大道芸パフォーマンス' },
        { start: '14:30', end: '15:10', title: 'よさこい連 華舞' },
        { start: '15:10', end: '15:40', title: 'アコースティックバンド' },
      ],
    },
  },
  {
    date: '2026-11-01',
    dateLabel: '11/1(日)',
    stages: {
      main: [
        { start: '11:00', end: '11:30', title: '羽村市立小学校（楽器演奏）' },
        { start: '11:30', end: '12:10', title: '吹奏楽フェスティバル' },
        { start: '12:20', end: '12:50', title: 'キッズダンス発表会' },
        { start: '13:00', end: '13:30', title: '和太鼓 響' },
        { start: '13:40', end: '14:20', title: '民謡と踊り' },
        { start: '14:30', end: '15:10', title: 'フィナーレステージ' },
      ],
      sub: [
        { start: '11:00', end: '11:40', title: '子どもコーラス' },
        { start: '12:00', end: '12:40', title: 'マジックショー' },
        { start: '13:00', end: '13:50', title: 'ジャズ演奏' },
        { start: '14:00', end: '14:40', title: 'フォークダンス' },
      ],
    },
  },
];
