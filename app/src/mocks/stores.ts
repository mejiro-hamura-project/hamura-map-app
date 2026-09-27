import type { BoothStyle, Store } from '../shared/types';
import storesVenue1 from './data/stores-venue-1.json';

/**
 * ブースの記号に紐づく店のダミーデータ（会場番号→店配列）。
 * 今は第1会場ぶんだけ。第2・第3会場は店登録ツールでデータができ次第、同じ形で追加する。
 */
export const STORES_BY_VENUE: Record<number, Store[]> = {
  1: storesVenue1 as Store[],
};

/** 店は「色（style）＋記号（code）」の組み合わせで一意に決まる */
export function findStore(stores: Store[], style: BoothStyle, code: string): Store | undefined {
  return stores.find((store) => store.style === style && store.code === code);
}
