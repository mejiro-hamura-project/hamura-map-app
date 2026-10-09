import { CURRENT_USER_ID } from '../constants';
import type { Post } from '../types';

/**
 * 投稿者名の表示方針：本名っぽい固定名（mocks/users.tsのnickname）も「匿名」も使わない。
 * 自分の投稿はニックネーム（設定していればそれ）、それ以外（他人の投稿・自分がニックネーム
 * 未設定のとき）はこの5つの架空ニックネームを投稿者（userId）ごとに固定で割り当てて使い回す。
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

export function resolveAuthorNickname(post: Post, myNickname: string): string {
  if (post.userId === CURRENT_USER_ID && myNickname) return myNickname;
  return fakeNicknameForUserId(post.userId);
}
