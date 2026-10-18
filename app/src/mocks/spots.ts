import type { Spot } from '../shared/types';
import { AREA_SPOTS } from './areaSpots';
import { STORE_SPOTS } from './stores';
import { STAGE_SPOTS } from './stageSpots';
import { PROGRAM_SPOTS } from './programSpots';

const EVENT_ID = 'festival-2026';
// スポットのx, yは「全体」地図（venue-all.png）上の％。会場の地図に出すときは offsetInAllMap で変換する。
const MAP_ID = 'map-all';

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

/**
 * ステージ・店（ブース）・エリア・ステージの演目・スタンプQR。
 * 店は店登録ツールのデータ（mocks/stores.ts）、演目はタイムテーブル（mocks/timetable.ts）から作る。
 */
export const MOCK_SPOTS: Spot[] = [...STAGE_SPOTS, ...STORE_SPOTS, ...AREA_SPOTS, ...PROGRAM_SPOTS, ...STAMP_QR_SPOTS];
