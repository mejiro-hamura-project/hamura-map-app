import { storage } from '../storage/storage';

const RECENT_SPOTS_KEY = 'posts.recentSpotIds';
const MAX_RECENT_SPOTS = 5;

/**
 * 最近詳細を見た店・イベント（スポット）のid。新しい順。
 * 口コミの投稿画面で「最近見た店・イベント」として並べ、店名を検索しなくても投稿先を選べるようにする。
 * この端末の中だけに保存する（どこにも送らない）。
 */
export function getRecentSpotIds(): string[] {
  return storage.get<string[]>(RECENT_SPOTS_KEY, []);
}

/** 詳細を見たスポットを「最近見た」の先頭に入れる（同じものは先頭に移すだけ） */
export function rememberRecentSpot(spotId: string): void {
  const next = [spotId, ...getRecentSpotIds().filter((id) => id !== spotId)].slice(0, MAX_RECENT_SPOTS);
  storage.set(RECENT_SPOTS_KEY, next);
}
