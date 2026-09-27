import type { VenueMap } from '../shared/types';

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
  },
  {
    id: 'map-2',
    name: '第2会場',
    imageUrl: '/maps/venue-2.png',
    width: 1395,
    height: 930,
    venueId: 2,
  },
  {
    id: 'map-3',
    name: '第3会場',
    imageUrl: '/maps/venue-3.png',
    width: 1122,
    height: 1344,
    venueId: 3,
  },
];
