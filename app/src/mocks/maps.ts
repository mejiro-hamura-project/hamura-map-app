import type { VenueMap } from '../shared/types';

// offsetInAllMap は、会場ごとの地図を今年版の会場図から切り出したときの、全体地図（venue-all.png）上の左上の位置。
export const MOCK_MAPS: VenueMap[] = [
  {
    id: 'map-all',
    name: '全体',
    imageUrl: '/maps/venue-all.png',
    width: 2492,
    height: 2239,
  },
  {
    id: 'map-1',
    name: '第1会場',
    // ブースは配置ツールのデータからボタンとして描画するため、背景はブース絵の無い下地マップを使う
    imageUrl: '/maps/base-map-第1会場.png',
    width: 1794,
    height: 1309,
    venueId: 1,
    offsetInAllMap: { x: 0, y: 0 },
  },
  {
    id: 'map-2',
    name: '第2会場',
    imageUrl: '/maps/venue-2.png',
    width: 1395,
    height: 930,
    venueId: 2,
    offsetInAllMap: { x: 0, y: 1309 },
  },
  {
    id: 'map-3',
    name: '第3会場',
    imageUrl: '/maps/venue-3.png',
    width: 1122,
    height: 1344,
    venueId: 3,
    offsetInAllMap: { x: 1370, y: 895 },
  },
  {
    id: 'map-4',
    name: '第4会場',
    imageUrl: '/maps/venue-4.png',
    width: 964,
    height: 1239,
    venueId: 4,
    offsetInAllMap: { x: 1506, y: 14 },
  },
];
