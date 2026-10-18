import type { Spot } from '../shared/types';
import { AREA_SPOTS } from './areaSpots';
import { STORE_SPOTS } from './stores';

const EVENT_ID = 'festival-2026';
// スポットのx, yは「全体」地図（venue-all.png）上の％。会場の地図に出すときは offsetInAllMap で変換する。
const MAP_ID = 'map-all';

/** ステージ（メイン＝第2会場、サブ＝第3会場ウッドデッキ）。位置は今年版の会場図に合わせた値 */
const STAGE_SPOTS: Spot[] = [
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
  },
];

/**
 * スタンプラリーのQR設置場所（7か所）。実際のスタンプラリー
 * （app/src/features/stamprally/data/checkpoints.ts）の物理QR位置数に合わせている。
 * 座標・会場番号は仮の値（正確な位置合わせは今回は行っていない）。
 */
const STAMP_QR_SPOTS: Spot[] = Array.from({ length: 7 }, (_, index) => {
  const checkpointId = index + 1;
  return {
    id: `stamp-qr-${checkpointId}`,
    name: `スタンプQR ${checkpointId}`,
    categoryId: 'stamp-qr',
    tagIds: [],
    description: '会場に設置されたスタンプラリーのQRコードです。',
    images: [],
    mapId: MAP_ID,
    x: 10 + checkpointId * 10,
    y: 10 + ((checkpointId * 17) % 80),
    eventId: EVENT_ID,
    stampCheckpointId: checkpointId,
    venueId: ((checkpointId - 1) % 3) + 1,
  } satisfies Spot;
});

/** 店（ブース）・エリア・ステージ・スタンプQR。店は店登録ツールのデータから作る（mocks/stores.ts） */
export const MOCK_SPOTS: Spot[] = [...STAGE_SPOTS, ...STORE_SPOTS, ...AREA_SPOTS, ...STAMP_QR_SPOTS];
