import type { Spot } from '../shared/types';

const EVENT_ID = 'festival-2026';
// スポットのx, yは「全体」地図（venue-all.png）上の％。会場の地図に出すときは offsetInAllMap で変換する。
const MAP_ID = 'map-all';

/** ステージ（メイン＝第2会場、サブ＝第3会場ウッドデッキ）。位置は今年版の会場図に合わせた値 */
export const STAGE_SPOTS: Spot[] = [
  {
    // 演目名は日によって変わるため持たせず、タイムテーブル（mocks/timetable.ts）から
    // 「今の演目」を都度取得して表示する（イベント一覧・地図の吹き出しで共通）。
    id: 'spot-stage1',
    name: 'メインステージ',
    reading: 'めいんすてーじ',
    categoryId: 'main-stage',
    tagIds: [],
    description: '歌・ダンス・楽器演奏など、祭りのメインの催し物を行うステージです。',
    images: [],
    mapId: MAP_ID,
    x: 31,
    y: 73.8,
    eventId: EVENT_ID,
    venueId: 2,
    stageKey: 'main',
    // 第2会場の地図上のステージの範囲。タップで詳細、検索で演目を選んだときに光らせる
    area: { mapId: 'map-2', x: 46.6, y: 34.4, width: 18, height: 13.7 },
  },
  {
    id: 'spot-stage2',
    name: 'サブステージ',
    reading: 'さぶすてーじ',
    categoryId: 'sub-stage',
    tagIds: [],
    description: '第3会場のウッドデッキで、歌・ダンス・演奏などを行うステージです。',
    images: [],
    mapId: MAP_ID,
    x: 71.6,
    y: 62.9,
    eventId: EVENT_ID,
    venueId: 3,
    stageKey: 'sub',
    // 第3会場の地図上のウッドデッキの範囲
    area: { mapId: 'map-3', x: 27.1, y: 35.7, width: 19.1, height: 6.1 },
  },
];
