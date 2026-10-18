import { storage } from '../storage/storage';

const DEVICE_USER_KEY = 'posts.deviceUserId';

/**
 * この端末の投稿者ID。ログイン機能が無いため、端末ごとに一度だけランダムに作って保存し、以後使い回す。
 * 口コミの投稿者名（架空ニックネーム）はこのIDから決まるため、同じ端末の投稿は同じ名前になり、
 * 別の端末の投稿とは名前が分かれる。個人を特定する情報は含まない。
 */
export function getDeviceUserId(): string {
  const saved = storage.get<string | null>(DEVICE_USER_KEY, null);
  if (saved) return saved;
  const id = `user-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  storage.set(DEVICE_USER_KEY, id);
  return id;
}
