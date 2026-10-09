import { useState } from 'react';
import { storage } from '../storage/storage';

const STORAGE_KEY = 'festival.postNickname';

/**
 * 投稿で使うニックネームを端末に覚えておくフック。
 * localStorageを直接触らず、共通のstorageユーティリティ経由で読み書きする。
 * 未設定のときは空文字を返す（表示側で架空のニックネームに変換する。shared/utils/postAuthor参照）。
 */
export function useNickname(): [string, (nickname: string) => void] {
  const [nickname, setNicknameState] = useState(() => storage.get(STORAGE_KEY, ''));

  function setNickname(next: string) {
    const trimmed = next.trim();
    setNicknameState(trimmed);
    storage.set(STORAGE_KEY, trimmed);
  }

  return [nickname, setNickname];
}
