import type { Spot } from '../shared/types';

const EVENT_ID = 'festival-2026';
// スポットのx, yは「全体」地図（venue-all.png）の座標系で決めた仮の値。
// 会場ごとの画像（venue-1/2/3.png）上での正確な位置合わせは今回は行っていない。
const MAP_ID = 'map-all';

/** 出店・団体・ステージの見本データ（UIプロトタイプの実例に合わせた名称） */
const SHOP_SPOTS: Spot[] = [
  {
    id: 'spot-11',
    name: '11：焼きそば横丁',
    reading: 'やきそばよこちょう',
    categoryId: 'gourmet',
    genreId: 'food-menrui',
    tagIds: ['drink', 'meat', 'recommended'],
    description: '定番の屋台グルメ。ドリンクもあります。',
    images: [],
    mapId: MAP_ID,
    x: 40,
    y: 78,
    eventId: EVENT_ID,
    venueId: 2,
  },
  {
    id: 'spot-07',
    name: '7：炭火焼き鳥',
    reading: 'すみびやきとり',
    categoryId: 'gourmet',
    genreId: 'food-yakimono',
    tagIds: ['meat', 'recommended'],
    description: '炭火でじっくり焼き上げる焼き鳥。',
    images: [],
    mapId: MAP_ID,
    x: 50,
    y: 80,
    eventId: EVENT_ID,
    venueId: 2,
  },
  {
    id: 'spot-d',
    name: 'D：クラフトドリンク店',
    reading: 'くらふとどりんくてん',
    categoryId: 'gourmet',
    genreId: 'food-drink',
    tagIds: ['drink'],
    description: '地ビール・ソフトドリンクを提供。',
    images: [],
    mapId: MAP_ID,
    x: 45,
    y: 76,
    eventId: EVENT_ID,
    venueId: 1,
  },
  {
    id: 'spot-p',
    name: 'P：公園遊具体験',
    reading: 'こうえんゆうぐたいけん',
    categoryId: 'play-land',
    genreId: 'goods-taiken',
    tagIds: ['workshop'],
    description: 'お子さま向けの大型遊具コーナー。',
    images: [],
    mapId: MAP_ID,
    x: 55,
    y: 30,
    eventId: EVENT_ID,
    venueId: 1,
  },
  {
    id: 'spot-pr1',
    name: 'はむらまちゼミ',
    reading: 'はむらまちぜみ',
    categoryId: 'pr',
    genreId: 'goods-info',
    tagIds: [],
    description: '地域団体による活動紹介。',
    images: [],
    mapId: MAP_ID,
    x: 15,
    y: 60,
    eventId: EVENT_ID,
    venueId: 1,
  },
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
    x: 55,
    y: 65,
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
    description: '得意演奏やミニ発表を行う小さめのステージです。',
    images: [],
    mapId: MAP_ID,
    x: 80,
    y: 60,
    eventId: EVENT_ID,
    venueId: 3,
    stageKey: 'sub',
  },
  {
    id: 'spot-goods1',
    name: '特産品ワゴン',
    reading: 'とくさんひんわごん',
    categoryId: 'goods',
    genreId: 'goods-shokuhin',
    tagIds: [],
    description: '地元の特産品を販売。',
    images: [],
    mapId: MAP_ID,
    x: 60,
    y: 10,
    eventId: EVENT_ID,
    venueId: 1,
  },
  {
    id: 'spot-specialty1',
    name: '農産物直売',
    reading: 'のうさんぶつちょくばい',
    categoryId: 'specialty',
    genreId: 'goods-shokuhin',
    tagIds: [],
    description: '採れたて野菜を直売。',
    images: [],
    mapId: MAP_ID,
    x: 12,
    y: 8,
    eventId: EVENT_ID,
    venueId: 3,
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

export const MOCK_SPOTS: Spot[] = [...SHOP_SPOTS, ...STAMP_QR_SPOTS];
