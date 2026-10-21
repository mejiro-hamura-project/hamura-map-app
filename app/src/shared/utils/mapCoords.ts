import type { VenueMap } from '../types';

type PercentPoint = { x: number; y: number };

/**
 * 会場の地図上の位置（画像に対する％）を、「全体」地図上の位置（％）に変換する。
 * 会場の地図に offsetInAllMap が無い場合は変換できないため undefined を返す。
 */
export function venueToAllMapPercent(point: PercentPoint, venueMap: VenueMap, allMap: VenueMap): PercentPoint | undefined {
  const offset = venueMap.offsetInAllMap;
  if (!offset) return undefined;
  return {
    x: ((offset.x + (point.x / 100) * venueMap.width) / allMap.width) * 100,
    y: ((offset.y + (point.y / 100) * venueMap.height) / allMap.height) * 100,
  };
}

/** 「全体」地図上の位置（％）を、会場の地図上の位置（％）に変換する（venueToAllMapPercent の逆） */
export function allMapToVenuePercent(point: PercentPoint, venueMap: VenueMap, allMap: VenueMap): PercentPoint | undefined {
  const offset = venueMap.offsetInAllMap;
  if (!offset) return undefined;
  return {
    x: (((point.x / 100) * allMap.width - offset.x) / venueMap.width) * 100,
    y: (((point.y / 100) * allMap.height - offset.y) / venueMap.height) * 100,
  };
}
