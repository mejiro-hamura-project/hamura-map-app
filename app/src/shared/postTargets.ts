import { MOCK_SPOTS } from '../mocks/spots';
import { STORES_BY_VENUE, storeSpotId } from '../mocks/stores';
import type { Spot } from './types';

// 地図・投稿UI・Workerで共通のIDとジャンルを使用する。
const candidates: Spot[] = [
  ...MOCK_SPOTS.filter((spot) => spot.categoryId !== 'stamp-qr'),
  ...Object.entries(STORES_BY_VENUE).flatMap(([venue, stores]) => stores.map((store): Spot => ({
    id: storeSpotId(store), name: store.name, genreId: store.genreId,
    categoryId: '', tagIds: [], description: store.detail ?? '', images: [],
    mapId: `map-venue-${venue}`, venueId: Number(venue), x: 0, y: 0, eventId: 'festival-2026',
  }))),
];

// 同一内容の重複レコードは一つにまとめ、異なる対象の同じIDは拒否する。
const unique = new Map<string, Spot>();
for (const target of candidates) {
  const previous = unique.get(target.id);
  if (previous && JSON.stringify(previous) !== JSON.stringify(target)) {
    throw new Error('Conflicting post target IDs: reconcile map/store IDs before enabling posts');
  }
  unique.set(target.id, target);
}
export const POST_TARGETS = [...unique.values()];
