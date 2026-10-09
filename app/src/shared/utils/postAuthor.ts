import type { Post } from '../types';

/**
 * 投稿者名の表示方針：本名っぽい固定名（mocks/users.tsのnickname）は使わない。
 * ユーザーは名前について一切操作できない（設定・変更不可）。この5つの架空ニックネームを
 * 投稿者（userId）ごとに固定で割り当てて使い回す（自分の投稿も含め、全員同じ仕組み）。
 * 投稿タブ・地図の口コミ表示など、投稿者名を出すすべての箇所からこの関数を使い回し、
 * 表示ロジックを二重に作らない。
 */
const FAKE_NICKNAMES = ['はむらの達人', 'チューリップ姫', '井戸端トーク', 'レッサーパンダ推し', '市民祭り大好き'];

export function fakeNicknameForUserId(userId: string): string {
  // djb2ハッシュ。短い文字列(userId)でも偏りなく5択に振り分けるため、
  // 1文字ごとにmodするのではなく最後にまとめてmodする。
  let hash = 5381;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash * 33) ^ userId.charCodeAt(i)) >>> 0;
  }
  return FAKE_NICKNAMES[hash % FAKE_NICKNAMES.length];
}

export function resolveAuthorNickname(post: Post): string {
  return fakeNicknameForUserId(post.userId);
}
