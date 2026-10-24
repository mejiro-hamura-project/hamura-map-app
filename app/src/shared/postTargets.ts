import { MOCK_SPOTS } from '../mocks/spots';
import type { Spot } from './types';

// 地図・投稿UI・Workerで同じ投稿先IDとジャンルを使用する。
// MOCK_SPOTSには現行の店舗、ステージ、演目、エリアがすでに含まれている。
// スタンプQRは投稿先ではないため除外する。
const candidates = MOCK_SPOTS.filter((spot) => spot.categoryId !== 'stamp-qr');

/** 同一内容の重複は一つにし、投稿が別の場所へ誤って紐付くID衝突は拒否する。 */
export function buildPostTargets(source: Spot[]): Spot[] {
  const unique = new Map<string, Spot>();
  for (const target of source) {
    const previous = unique.get(target.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(target)) {
      throw new Error('Conflicting post target IDs: reconcile map/store IDs before enabling posts');
    }
    unique.set(target.id, target);
  }
  return [...unique.values()];
}

export const POST_TARGETS = buildPostTargets(candidates);
