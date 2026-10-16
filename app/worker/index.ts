import { POST_TARGETS } from '../src/shared/postTargets';
import { GENRES } from '../src/shared/taxonomy';
import type { Post } from '../src/shared/types';

// The small structural interface keeps Worker types separate from the browser app.
interface Statement {
  bind(...values: (string | number)[]): Statement;
  all<T>(): Promise<{ results: T[] }>;
}
export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB?: { prepare(sql: string): Statement; batch<T>(statements: Statement[]): Promise<{ results: T[] }[]> };
  POSTS_ENABLED?: string;
  POST_RATE_LIMIT_SECRET?: string;
}
interface Row {
  id: string; spot_id: string; caption: string; created_at: string;
  status: 'visible' | 'hidden'; author_hash: string;
}
const MAX_BODY_BYTES = 8192;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const targets = new Map(POST_TARGETS.map((spot) => [spot.id, spot]));
const genres = new Set(GENRES.map((genre) => genre.id));
const ready = (env: Env) => Boolean(env.DB && env.POSTS_ENABLED === 'true' && (env.POST_RATE_LIMIT_SECRET?.length ?? 0) >= 32);
function json(value: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(value), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff', ...extra,
  } });
}
const error = (message: string, status = 400) => json({ error: message }, status);
function post(row: Row): Post {
  return { id: row.id, userId: 'anonymous', spotId: row.spot_id, caption: row.caption,
    images: [], likeCount: 0, createdAt: row.created_at };
}
function filterValues(url: URL, name: string, allowed: Set<string>): string[] | null {
  const raw = url.searchParams.get(name);
  if (raw === null) return [];
  const values = [...new Set(raw.split(','))];
  return values.length <= 100 && values.every((value) => allowed.has(value)) ? values : null;
}
async function list(url: URL, env: Env) {
  const limitRaw = url.searchParams.get('limit') ?? '20';
  if (!/^\d{1,2}$/.test(limitRaw) || +limitRaw < 1 || +limitRaw > 50) return error('取得件数が不正です。');
  const spotIds = filterValues(url, 'spotIds', new Set(targets.keys()));
  const genreIds = filterValues(url, 'genreIds', genres);
  if (!spotIds || !genreIds) return error('絞り込み条件が不正です。');
  if (!env.DB) return error('投稿の保存先が未設定です。', 503);
  const clauses = ["status = 'visible'"];
  const values: (string | number)[] = [];
  if (spotIds.length || genreIds.length) {
    const selected = POST_TARGETS.filter((spot) => (!spotIds.length || spotIds.includes(spot.id)) &&
      (!genreIds.length || (spot.genreId && genreIds.includes(spot.genreId)))).map((spot) => spot.id);
    if (!selected.length) return json({ posts: [], nextCursor: null, acceptingPosts: ready(env) });
    // The full catalogue can exceed D1's 100 bound-parameter limit. JSON is one bound parameter.
    clauses.push('spot_id IN (SELECT value FROM json_each(?))');
    values.push(JSON.stringify(selected));
  }
  const cursor = url.searchParams.get('cursor');
  if (cursor !== null) {
    try {
      if (cursor.length > 200) throw new Error();
      const parsed: unknown = JSON.parse(atob(cursor));
      if (!Array.isArray(parsed) || parsed.length !== 2 || typeof parsed[0] !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(parsed[0]) || !UUID.test(parsed[1])) throw new Error();
      clauses.push('(created_at < ? OR (created_at = ? AND id < ?))');
      values.push(parsed[0], parsed[0], parsed[1]);
    } catch { return error('ページ情報が不正です。'); }
  }
  const { results } = await env.DB.prepare(`SELECT id, spot_id, caption, created_at FROM posts WHERE ${clauses.join(' AND ')} ORDER BY created_at DESC, id DESC LIMIT ?`).bind(...values, +limitRaw + 1).all<Row>();
  const page = results.slice(0, +limitRaw);
  const last = page.at(-1);
  return json({ posts: page.map(post), nextCursor: results.length > +limitRaw && last ? btoa(JSON.stringify([last.created_at, last.id])) : null, acceptingPosts: ready(env) });
}
async function body(request: Request): Promise<unknown> {
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}
async function create(request: Request, env: Env) {
  if (!ready(env) || !env.DB) return error('現在、投稿の受付を停止しています。', 503);
  const origin = request.headers.get('Origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') return error('同じサイトから投稿してください。', 403);
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return error('JSONで送信してください。', 415);
  const key = request.headers.get('Idempotency-Key') ?? '';
  if (!UUID.test(key)) return error('送信識別子が不正です。');
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return error('投稿元を確認できません。', 503);
  let input: unknown;
  try { input = await body(request); }
  catch (cause) { return error(cause instanceof RangeError ? '送信データが大きすぎます。' : 'JSONが不正です。', cause instanceof RangeError ? 413 : 400); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return error('投稿データが不正です。');
  const data = input as Record<string, unknown>;
  if (Object.keys(data).some((name) => name !== 'spotId' && name !== 'caption') || typeof data.spotId !== 'string' || !targets.has(data.spotId) || typeof data.caption !== 'string') return error('投稿先または本文が不正です。');
  const caption = data.caption.trim();
  const characters = [...caption];
  const invalidCharacter = characters.some((character) => {
    const code = character.codePointAt(0)!;
    return (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127 || (code >= 0xD800 && code <= 0xDFFF);
  });
  if (!caption || characters.length > 500 || invalidCharacter) return error('本文は1〜500文字で入力してください。');
  const secret = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.POST_RATE_LIMIT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', secret, new TextEncoder().encode(ip));
  const author = [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const id = crypto.randomUUID();
  const now = Date.now();
  // Each INSERT's count and write are a single atomic SQLite statement. D1 batch
  // also wraps insert+read in a transaction: concurrent retries cannot add rows
  // or bypass the rolling rate limit, including when existing rows are hidden.
  const [, selected] = await env.DB.batch<Row>([
    env.DB.prepare(`INSERT INTO posts (id, spot_id, caption, created_at, created_ms, request_key, author_hash)
      SELECT ?, ?, ?, ?, ?, ?, ?
      WHERE (SELECT COUNT(*) FROM posts WHERE author_hash = ? AND created_ms > ?) < 5
      ON CONFLICT(request_key) DO NOTHING`).bind(id, data.spotId, caption, new Date(now).toISOString(), now, key.toLowerCase(), author, author, now - 60000),
    env.DB.prepare('SELECT id, spot_id, caption, created_at, status, author_hash FROM posts WHERE request_key = ?').bind(key.toLowerCase()),
  ]);
  const row = selected.results[0];
  if (!row) return json({ error: '投稿が続いています。1分ほど待って再度お試しください。' }, 429, { 'Retry-After': '60' });
  if (row.status !== 'visible' || row.author_hash !== author || row.spot_id !== data.spotId || row.caption !== caption) return error('この送信識別子では投稿できません。', 409);
  return json({ post: post(row) }, row.id === id ? 201 : 200);
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/api' && !url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (url.pathname !== '/api/posts') return error('APIが見つかりません。', 404);
    try {
      if (request.method === 'GET') return await list(url, env);
      if (request.method === 'POST') return await create(request, env);
      return json({ error: 'このメソッドは利用できません。' }, 405, { Allow: 'GET, POST' });
    } catch {
      // Do not log captions, IP addresses, secrets, or D1 error details.
      return error('投稿サービスに接続できません。時間をおいて再度お試しください。', 503);
    }
  },
};
