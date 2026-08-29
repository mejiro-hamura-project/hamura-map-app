import type { User } from '../shared/types';

export const MOCK_USERS: User[] = [
  { id: 'user-taro', nickname: 'たろう' },
  { id: 'user-mika', nickname: 'みか' },
  // ログイン機能がまだ無いため、自分で投稿したものはこの仮ユーザーとして表示する
  { id: 'user-you', nickname: 'あなた' },
];
