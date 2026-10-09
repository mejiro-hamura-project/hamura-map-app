import type { BoothStyle, Store } from '../shared/types';
import storesVenue1 from './data/stores-venue-1.json';

/**
 * 店登録ツールで作った、ブースの記号に紐づく店データ（会場番号→店配列）。
 * 今は第1会場ぶんだけ。第2・第3会場は店登録ツールでデータができ次第、同じ形で追加する。
 */
export const STORES_BY_VENUE: Record<number, Store[]> = {
  1: storesVenue1 as Store[],
};

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
  for (const stores of Object.values(STORES_BY_VENUE)) {
    const found = stores.find((store) => storeSpotId(store) === spotId);
    if (found) return found;
  }
  return undefined;
}
