import type { VenueHotspot } from '../shared/types';

/**
 * 「全体」地図（venue-all.png）の上での、第1〜第4会場のだいたいの範囲（仮の値）。
 * 地図の見た目（左上＝第1会場、右上＝第4会場、左下＝第2会場、右下＝第3会場）に合わせたおおよその四角形。
 */
export const MOCK_VENUE_HOTSPOTS: VenueHotspot[] = [
  { venueId: 1, x: 0, y: 0, width: 58, height: 56 },
  { venueId: 4, x: 58, y: 0, width: 42, height: 53 },
  { venueId: 2, x: 0, y: 56, width: 50, height: 44 },
  { venueId: 3, x: 50, y: 56, width: 50, height: 44 },
];
