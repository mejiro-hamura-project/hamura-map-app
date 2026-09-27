import type { VenueHotspot } from '../shared/types';

/**
 * 「全体」地図（venue-all.png）の上での、第1〜第3会場のだいたいの範囲（仮の値）。
 * 会場ごとの正確な区画合わせは今回は行っていない。地図の見た目（上部＝第1会場、
 * 左下＝第2会場、右下＝第3会場）に合わせたおおよその四角形。
 */
export const MOCK_VENUE_HOTSPOTS: VenueHotspot[] = [
  { venueId: 1, x: 0, y: 0, width: 100, height: 45 },
  { venueId: 2, x: 0, y: 45, width: 50, height: 55 },
  { venueId: 3, x: 50, y: 45, width: 50, height: 55 },
];
