import { useEffect, useSyncExternalStore } from 'react';
import type { Post } from '../shared/types';
import { MOCK_POSTS } from '../mocks';
import { POSTS_API_URL, fetchSheetPosts, sendSheetPost } from './postsSheet';

// シートを読み直す間隔。運営がシートで消した口コミは、遅くともこの間隔でアプリから消える
const REFRESH_INTERVAL_MS = 60_000;
// 送ったばかりの口コミがシートに反映されるまで、この端末の画面に出し続けておく時間
const PENDING_KEEP_MS = 3 * 60_000;

type PostsState = { posts: Post[]; isLoading: boolean };

// 投稿タブと地図の口コミ表示が同じ一覧を見るよう、口コミはアプリ全体で1つだけ持つ
let sheetPosts: Post[] = [];
let pendingPosts: Post[] = [];
let state: PostsState = { posts: [], isLoading: true };
const listeners = new Set<() => void>();
let refreshTimer: ReturnType<typeof setInterval> | undefined;

function newestFirst(a: Post, b: Post): number {
  return b.createdAt.localeCompare(a.createdAt);
}

function publish(isLoading = false) {
  const now = Date.now();
  // シートに載った投稿と、送ったばかりでまだ載っていない投稿を合わせて出す。
  // 一定時間たっても載らない投稿（送信失敗・運営が削除済み）は出さない
  pendingPosts = pendingPosts.filter(
    (post) => !sheetPosts.some((p) => p.id === post.id) && now - Date.parse(post.createdAt) < PENDING_KEEP_MS,
  );
  state = { posts: [...pendingPosts, ...sheetPosts].sort(newestFirst), isLoading };
  listeners.forEach((listener) => listener());
}

async function refresh() {
  if (!POSTS_API_URL) {
    sheetPosts = MOCK_POSTS;
    publish();
    return;
  }
  try {
    sheetPosts = await fetchSheetPosts(POSTS_API_URL);
  } catch {
    // 読み込めなかったときは、前回読み込めた内容のまま表示を続ける
  }
  publish();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    void refresh();
    refreshTimer = setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = undefined;
    }
  };
}

function getSnapshot(): PostsState {
  return state;
}

/** 口コミを投稿する。すぐ画面に出し、シート連携が設定されていればシートにも送る */
export function addPost(post: Post, spotName: string) {
  pendingPosts = [post, ...pendingPosts];
  publish(state.isLoading);
  if (POSTS_API_URL) sendSheetPost(POSTS_API_URL, post, spotName);
}

/**
 * 口コミの一覧を取得するフック。シート連携（VITE_POSTS_API_URL）があればシートの内容を、
 * 無ければモックデータ（空）を返す。画面に戻ったとき（タブの切り替え等）にも読み直す。
 */
export function usePosts() {
  const { posts, isLoading } = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    function handleVisible() {
      if (document.visibilityState === 'visible') void refresh();
    }
    document.addEventListener('visibilitychange', handleVisible);
    return () => document.removeEventListener('visibilitychange', handleVisible);
  }, []);

  return { posts, isLoading, addPost };
}
