import type { BoothStyle, Spot, Store } from '../shared/types';
import { venueToAllMapPercent } from '../shared/utils/mapCoords';
import storesData from './data/stores.json';
import storeDetails from './data/store-details.json';
import { BOOTHS_BY_VENUE } from './booths';
import { MOCK_MAPS } from './maps';

/**
 * 店登録ツールで作った、ブースの記号に紐づく店データ（全会場ぶん）。
 * 店登録ツールは色ごとに店を管理し、全色をまとめて1つのファイルに書き出すため、会場では分けていない。
 * 記号は色ごとに全会場で重ならない（例：ピンク1〜54は第2会場、55〜59は第3会場）ので、色＋記号で店が決まる。
 *
 * 説明文（detail）は店登録ツールが扱わない項目のため、別ファイル（store-details.json、キーは「色:記号」）に置き、
 * ここで合わせる。店登録ツールで店名やジャンルを直して書き出し直しても、説明文は消えない。
 */
const DETAILS: Record<string, string> = storeDetails;

export const STORES: Store[] = (storesData as Store[]).map((store) => ({
  ...store,
  detail: store.detail ?? DETAILS[`${store.style}:${store.code}`],
}));

/** 店は「色（style）＋記号（code）」の組み合わせで一意に決まる */
export function findStore(stores: Store[], style: BoothStyle, code: string): Store | undefined {
  return stores.find((store) => store.style === style && store.code === code);
}

/**
 * 店のスポットのid（色＋記号）。複数のテントを使う店は、先頭の記号のidを使う。
 * 口コミ（Post.spotId）はこのidで店に紐づく。
 */
export function storeSpotId(store: Pick<Store, 'style' | 'code'>): string {
  return `store-${store.style}-${store.code}`;
}

/**
 * 疑似スポットid（storeSpotIdの形式）から、元の店データを会場をまたいで探す。
 * 投稿タブのフィードなど、本物のSpotデータだけでは見つからないブースの店の
 * 投稿について、店名・ジャンルを引けるようにするため。
 */
export function findStoreBySpotId(spotId: string): Store | undefined {
  return STORES.find((store) => storeSpotId(store) === spotId);
}

// ブースの色ごとの、共通カテゴリ（イベント一覧のタブ）。地図の色分けと同じ区分
const CATEGORY_BY_STYLE: Record<BoothStyle, string> = {
  pink: 'gourmet',
  pr: 'pr',
  band: 'goods',
  orange: 'specialty',
};

const EVENT_ID = 'festival-2026';
const ALL_MAP = MOCK_MAPS.find((venueMap) => venueMap.venueId == null);

/** 色＋記号から、そのブースがある会場番号と、会場地図上のブースの位置（％）を探す */
function findBoothLocation(style: BoothStyle, code: string): { venueId: number; x: number; y: number } | undefined {
  for (const [venueId, booths] of Object.entries(BOOTHS_BY_VENUE)) {
    const booth = booths.find((b) => b.style === style && b.codes.includes(code));
    if (booth) return { venueId: Number(venueId), x: booth.x, y: booth.y };
  }
  return undefined;
}

/**
 * 店データを、検索・イベント一覧・口コミで扱えるスポット（Spot）にしたもの。
 * 複数のテントを使う店（同じ色で同じ店名が続く記号）は1つにまとめ、名前を「2・3：店名」のようにする。
 * 位置（x, y）は他のスポットと同じく「全体」地図上の％で、ブースの位置から変換している。
 */
/** 店のスポットが、どの会場のどのブースにあるか（地図で光らせる・拡大するために使う） */
export type StoreSpotBooth = {
  venueId: number;
  style: BoothStyle;
  codes: string[];
  /** 会場地図上のブースの位置（％） */
  x: number;
  y: number;
};

function buildStoreSpots(): { spots: Spot[]; byStoreKey: Map<string, Spot>; boothBySpotId: Map<string, StoreSpotBooth> } {
  const spots: Spot[] = [];
  const byStoreKey = new Map<string, Spot>();
  const boothBySpotId = new Map<string, StoreSpotBooth>();
  let index = 0;
  while (index < STORES.length) {
    const first = STORES[index];
    const group = [first];
    while (
      index + group.length < STORES.length &&
      STORES[index + group.length].style === first.style &&
      STORES[index + group.length].name === first.name
    ) {
      group.push(STORES[index + group.length]);
    }
    index += group.length;

    const location = findBoothLocation(first.style, first.code);
    const venueMap = location && MOCK_MAPS.find((venueMap) => venueMap.venueId === location.venueId);
    const allMapPoint = location && venueMap && ALL_MAP ? venueToAllMapPercent(location, venueMap, ALL_MAP) : undefined;

    const spot: Spot = {
      id: storeSpotId(first),
      name: `${group.map((store) => store.code).join('・')}：${first.name}`,
      categoryId: CATEGORY_BY_STYLE[first.style],
      tagIds: [],
      genreId: first.genreId || undefined,
      description: first.detail ?? '',
      images: [],
      mapId: ALL_MAP?.id ?? '',
      x: allMapPoint?.x ?? 0,
      y: allMapPoint?.y ?? 0,
      eventId: EVENT_ID,
      venueId: location?.venueId,
    };
    spots.push(spot);
    for (const store of group) byStoreKey.set(`${store.style}:${store.code}`, spot);
    if (location) {
      boothBySpotId.set(spot.id, {
        venueId: location.venueId,
        style: first.style,
        codes: group.map((store) => store.code),
        x: location.x,
        y: location.y,
      });
    }
  }
  return { spots, byStoreKey, boothBySpotId };
}

const STORE_SPOT_INDEX = buildStoreSpots();

/** 全店のスポット。検索・イベント一覧・口コミの投稿先に使う */
export const STORE_SPOTS: Spot[] = STORE_SPOT_INDEX.spots;

/** ブースの店一覧で選ばれた店に対応するスポット（複数テントの店は、どの記号から選んでも同じスポット） */
export function findStoreSpot(store: Pick<Store, 'style' | 'code'>): Spot | undefined {
  return STORE_SPOT_INDEX.byStoreKey.get(`${store.style}:${store.code}`);
}

/** 店のスポットがあるブース（会場・色・記号・位置）。店以外のスポットや、ブースが無い店は undefined */
export function findStoreSpotBooth(spotId: string): StoreSpotBooth | undefined {
  return STORE_SPOT_INDEX.boothBySpotId.get(spotId);
}
