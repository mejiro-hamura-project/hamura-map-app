import type { Post } from '../shared/types';

// 口コミを Googleスプレッドシート（Apps Script のWebアプリ）で管理するための通信。
// 投稿するとシートに1行追加され、アプリはシートの内容を読み込んで表示する。
// 運営がシートで本文のセルを空にする（または行を削除する）と、その口コミはアプリに出なくなる。
// 設定方法とApps Scriptのコードは docs/posts/posts-sheet.md を参照。
//
// VITE_POSTS_API_URL はビルド時に埋め込まれる値。変更したら再ビルド（ローカルはViteの再起動）が必要。
// 未設定の場合は口コミをシートに送らず、その端末の画面内だけで表示する（再読み込みで消える）。
const RAW_POSTS_API_URL = import.meta.env.VITE_POSTS_API_URL as string | undefined;

// ダミー値や書き間違いを「設定済み」と誤判定しないよう、Apps Script のWebアプリのURLの形かどうかを見る
function isPlausibleAppsScriptUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'script.google.com';
  } catch {
    return false;
  }
}

export const POSTS_API_URL = isPlausibleAppsScriptUrl(RAW_POSTS_API_URL) ? RAW_POSTS_API_URL : undefined;

if (typeof window !== 'undefined' && RAW_POSTS_API_URL && !POSTS_API_URL) {
  console.error(
    '[postsSheet] VITE_POSTS_API_URL is set but does not look like a Google Apps Script web app URL ' +
      '(expected https://script.google.com/macros/.../exec). Posts are kept on this device only. See docs/posts/posts-sheet.md.',
  );
}

type SheetPostRow = {
  id: string;
  createdAt: string;
  spotId: string;
  userId: string;
  caption: string;
  /** 「いいね」の数（古い Apps Script では無い） */
  likeCount?: number;
  /** 問い合わせた端末が「いいね」を押しているか（古い Apps Script では無い） */
  liked?: boolean;
};

export type SheetPosts = { posts: Post[]; likedPostIds: Set<string> };

/**
 * シートに残っている口コミを読み込む（本文が空の行・削除された行は Apps Script 側で除かれている）。
 * 「いいね」の数と、この端末（userId）が押した口コミも一緒に受け取る
 */
export async function fetchSheetPosts(url: string, userId: string): Promise<SheetPosts> {
  const requestUrl = new URL(url);
  requestUrl.searchParams.set('userId', userId);
  const response = await fetch(requestUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`posts sheet responded ${response.status}`);
  const data = (await response.json()) as { posts?: SheetPostRow[] };
  const rows = data.posts ?? [];
  return {
    posts: rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      spotId: row.spotId,
      caption: row.caption,
      images: [],
      likeCount: row.likeCount ?? 0,
      createdAt: row.createdAt,
    })),
    likedPostIds: new Set(rows.filter((row) => row.liked).map((row) => row.id)),
  };
}

/** 「いいね」を押した（liked=true）／取り消した（liked=false）ことをシートに送る。送り方は投稿と同じ */
export function sendSheetLike(url: string, postId: string, userId: string, liked: boolean): void {
  void fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ type: liked ? 'like' : 'unlike', postId, userId }),
  }).catch(() => {
    // 送れなかった「いいね」は、次の読み込みでシートの状態に戻る
  });
}

/**
 * 口コミをシートに送る。結果は読まずに送りっぱなしにする（Apps Script はCORSのプリフライトに応答できないため、
 * スタンプラリーの送信と同じく text/plain の no-cors で送る）。投稿はすぐ画面に出し、次の読み込みでシートの内容に揃う。
 * spotName は運営がシートで見て分かるように添える（アプリの表示には使わない）。
 */
export function sendSheetPost(url: string, post: Post, spotName: string): void {
  void fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      id: post.id,
      spotId: post.spotId,
      spotName,
      userId: post.userId,
      caption: post.caption,
    }),
  }).catch(() => {
    // 送れなかった投稿は、この端末の画面に一時的に残るだけになる（シートには載らない）
  });
}
