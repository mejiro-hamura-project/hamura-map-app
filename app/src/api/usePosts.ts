import { useEffect, useSyncExternalStore } from 'react';
import type { Post } from '../shared/types';
import { MOCK_POSTS } from '../mocks';
import { getDeviceUserId } from '../shared/utils/deviceUser';
import { POSTS_API_URL, fetchSheetPosts, sendSheetLike, sendSheetPost } from './postsSheet';

// シートを読み直す間隔。運営がシートで消した口コミは、遅くともこの間隔でアプリから消える
const REFRESH_INTERVAL_MS = 60_000;
// 送ったばかりの口コミがシートに反映されるまで、この端末の画面に出し続けておく時間
const PENDING_KEEP_MS = 3 * 60_000;

type PostsState = { posts: Post[]; likedPostIds: ReadonlySet<string>; isLoading: boolean };

// 投稿タブと地図の口コミ表示が同じ一覧を見るよう、口コミと「いいね」はアプリ全体で1つだけ持つ
let sheetPosts: Post[] = [];
let sheetLikedPostIds = new Set<string>();
let pendingPosts: Post[] = [];
// 押したばかりでシートにまだ反映されていない「いいね」（口コミのid → 押した／取り消した）
const pendingLikes = new Map<string, boolean>();
let state: PostsState = { posts: [], likedPostIds: new Set(), isLoading: true };
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
  // シートの状態が押した通りになった「いいね」は、もう上書きしなくてよい
  for (const [postId, liked] of pendingLikes) {
    if (sheetLikedPostIds.has(postId) === liked) pendingLikes.delete(postId);
  }

  const likedPostIds = new Set(sheetLikedPostIds);
  for (const [postId, liked] of pendingLikes) {
    if (liked) likedPostIds.add(postId);
    else likedPostIds.delete(postId);
  }
  // 数は「シートの数」に、まだ反映されていない自分の押した／取り消した分だけ足し引きする
  const withLikes = (post: Post): Post => {
    const pending = pendingLikes.get(post.id);
    if (pending === undefined || pending === sheetLikedPostIds.has(post.id)) return post;
    return { ...post, likeCount: Math.max(0, post.likeCount + (pending ? 1 : -1)) };
  };

  state = {
    posts: [...pendingPosts, ...sheetPosts].sort(newestFirst).map(withLikes),
    likedPostIds,
    isLoading,
  };
  listeners.forEach((listener) => listener());
}

async function refresh() {
  if (!POSTS_API_URL) {
    sheetPosts = MOCK_POSTS;
    publish();
    return;
  }
  try {
    const result = await fetchSheetPosts(POSTS_API_URL, getDeviceUserId());
    sheetPosts = result.posts;
    sheetLikedPostIds = result.likedPostIds;
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
 * 「いいね」を押す／取り消す。すぐ画面に反映し、シート連携が設定されていればシートにも送る
 * （シートでは同じ端末・同じ口コミは1回まで）。
 */
export function toggleLike(postId: string) {
  const willLike = !state.likedPostIds.has(postId);
  pendingLikes.set(postId, willLike);
  publish(state.isLoading);
  if (POSTS_API_URL) sendSheetLike(POSTS_API_URL, postId, getDeviceUserId(), willLike);
}

/**
 * 口コミの一覧を取得するフック。シート連携（VITE_POSTS_API_URL）があればシートの内容と「いいね」の数を、
 * 無ければモックデータ（空）を返す（その場合「いいね」はこの端末の画面内だけで数える）。
 * 画面に戻ったとき（タブの切り替え等）にも読み直す。
 */
export function usePosts() {
  const { posts, likedPostIds, isLoading } = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    function handleVisible() {
      if (document.visibilityState === 'visible') void refresh();
    }
    document.addEventListener('visibilitychange', handleVisible);
    return () => document.removeEventListener('visibilitychange', handleVisible);
  }, []);

  return { posts, likedPostIds, isLoading, addPost, toggleLike };
}
