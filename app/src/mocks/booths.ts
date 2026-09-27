import type { Booth } from '../shared/types';
import boothsVenue1 from './data/booths-venue-1.json';

/**
 * ブース配置ツールで作った配置データ（会場番号→ブース配列）。
 * 今は第1会場ぶんだけ。第2・第3会場は配置ツールでデータができ次第、同じ形で追加する。
 */
export const BOOTHS_BY_VENUE: Record<number, Booth[]> = {
  1: boothsVenue1 as Booth[],
};
