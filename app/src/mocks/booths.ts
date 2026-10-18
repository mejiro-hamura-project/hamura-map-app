import type { Booth } from '../shared/types';
import boothsVenue1 from './data/booths-venue-1.json';
import boothsVenue2 from './data/booths-venue-2.json';
import boothsVenue3 from './data/booths-venue-3.json';

/**
 * ブース配置ツールで作った配置データ（会場番号→ブース配列）。
 * 第4会場（テニス体験）はブースが無いため対象外。
 */
export const BOOTHS_BY_VENUE: Record<number, Booth[]> = {
  1: boothsVenue1 as Booth[],
  2: boothsVenue2 as Booth[],
  3: boothsVenue3 as Booth[],
};
