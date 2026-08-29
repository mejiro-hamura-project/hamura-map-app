import type { Spot } from '../shared/types';

const EVENT_ID = 'festival-2026';
const MAP_ID = 'map-main';

/** 出店・団体・ステージの見本データ（UIプロトタイプの実例に合わせた名称） */
const SHOP_SPOTS: Spot[] = [
  {
    id: 'spot-11',
    name: '11：焼きそば横丁',
    reading: 'やきそばよこちょう',
    categoryId: 'gourmet',
    tagIds: ['drink', 'meat', 'recommended'],
    description: '定番の屋台グルメ。ドリンクもあります。',
    images: [],
    mapId: MAP_ID,
    x: 40,
    y: 78,
    eventId: EVENT_ID,
  },
  {
    id: 'spot-07',
    name: '7：炭火焼き鳥',
    reading: 'すみびやきとり',
    categoryId: 'gourmet',
    tagIds: ['meat', 'recommended'],
    description: '炭火でじっくり焼き上げる焼き鳥。',
    images: [],
    mapId: MAP_ID,
    x: 50,
    y: 80,
    eventId: EVENT_ID,
  },
  {
    id: 'spot-d',
    name: 'D：クラフトドリンク店',
    reading: 'くらふとどりんくてん',
    categoryId: 'gourmet',
    tagIds: ['drink'],
    description: '地ビール・ソフトドリンクを提供。',
    images: [],
    mapId: MAP_ID,
    x: 45,
    y: 76,
    eventId: EVENT_ID,
  },
  {
    id: 'spot-p',
    name: 'P：公園遊具体験',
    reading: 'こうえんゆうぐたいけん',
    categoryId: 'play-land',
    tagIds: ['workshop'],
    description: 'お子さま向けの大型遊具コーナー。',
    images: [],
    mapId: MAP_ID,
    x: 55,
    y: 30,
    eventId: EVENT_ID,
  },
  {
    id: 'spot-pr1',
    name: 'はむらまちゼミ',
    reading: 'はむらまちぜみ',
    categoryId: 'pr',
    tagIds: [],
    description: '地域団体による活動紹介。',
    images: [],
    mapId: MAP_ID,
    x: 15,
    y: 60,
    eventId: EVENT_ID,
  },
  {
    id: 'spot-stage1',
    name: '和太鼓演奏',
    reading: 'わだいこえんそう',
    categoryId: 'main-stage',
    tagIds: [],
    description: 'はむら太鼓の会による演奏。',
    images: [],
    mapId: MAP_ID,
    x: 55,
    y: 65,
    schedule: '11:00〜',
    eventId: EVENT_ID,
  },
  {
    id: 'spot-goods1',
    name: '特産品ワゴン',
    reading: 'とくさんひんわごん',
    categoryId: 'goods',
    tagIds: [],
    description: '地元の特産品を販売。',
    images: [],
    mapId: MAP_ID,
    x: 60,
    y: 10,
    eventId: EVENT_ID,
  },
  {
    id: 'spot-specialty1',
    name: '農産物直売',
    reading: 'のうさんぶつちょくばい',
    categoryId: 'specialty',
    tagIds: [],
    description: '採れたて野菜を直売。',
    images: [],
    mapId: MAP_ID,
    x: 12,
    y: 8,
    eventId: EVENT_ID,
  },
];

/**
 * スタンプラリーのQR設置場所（7か所）。実際のスタンプラリー
 * （stamp-rally/src/data/checkpoints.ts）のチェックポイント数に合わせている。
 * 座標は仮の値（M2で実際のマップに合わせて調整する）。
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
  } satisfies Spot;
});

export const MOCK_SPOTS: Spot[] = [...SHOP_SPOTS, ...STAMP_QR_SPOTS];
