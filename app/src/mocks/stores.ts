import type { BoothStyle, Store } from '../shared/types';
import storesData from './data/stores.json';
import storeDetails from './data/store-details.json';

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
 * ブースの店をタップしたときに組み立てる疑似スポットのid。
 * ダミー投稿のspotIdもこの形式に合わせることで、どの店の投稿かを突き合わせられるようにする。
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
