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
};

/** シートに残っている口コミを読み込む（本文が空の行・削除された行は Apps Script 側で除かれている） */
export async function fetchSheetPosts(url: string): Promise<Post[]> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`posts sheet responded ${response.status}`);
  const data = (await response.json()) as { posts?: SheetPostRow[] };
  return (data.posts ?? []).map((row) => ({
    id: row.id,
    userId: row.userId,
    spotId: row.spotId,
    caption: row.caption,
    images: [],
    likeCount: 0,
    createdAt: row.createdAt,
  }));
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
