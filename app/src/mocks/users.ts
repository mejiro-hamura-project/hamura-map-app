import type { User } from '../shared/types';

// 投稿の表示名はnicknameではなく、userIdから機械的に決まる架空ニックネーム
// （shared/utils/postAuthor.ts）を使う。ここは実在のユーザーレコードとして持っているだけ。
export const MOCK_USERS: User[] = [
  { id: 'user-taro', nickname: 'たろう' },
  { id: 'user-mika', nickname: 'みか' },
  { id: 'user-ito', nickname: 'いとう' },
  { id: 'user-aya', nickname: 'あや' },
  { id: 'user-rio', nickname: 'りお' },
  // ログイン機能がまだ無いため、自分で投稿したものはこの仮ユーザーとして扱う
  { id: 'user-you', nickname: 'あなた' },
];
