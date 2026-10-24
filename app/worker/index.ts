import { POST_TARGETS } from '../src/shared/postTargets';
import { GENRES } from '../src/shared/taxonomy';
import type { Post } from '../src/shared/types';
import {
  MAX_AGE,
  MIN_AGE,
  isAgeStudentCategoryValid,
} from '../src/features/stamprally/data/ageValidation';
import { getCourseById } from '../src/features/stamprally/data/checkpoints';
import type { StudentCategory } from '../src/features/stamprally/types';

// Worker型をブラウザアプリから独立させるため、利用するD1 APIだけを構造的に定義する。
interface Statement {
  bind(...values: (string | number | null)[]): Statement;
  all<T>(): Promise<{ results: T[] }>;
}
export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB?: { prepare(sql: string): Statement; batch<T>(statements: Statement[]): Promise<{ results: T[] }[]> };
  POSTS_ENABLED?: string;
  RALLY_SYNC_ENABLED?: string;
  POST_RATE_LIMIT_SECRET?: string;
}
interface Row {
  id: string;
  spot_id: string;
  caption: string;
  created_at: string;
  status: 'visible' | 'hidden';
  author_hash: string;
}

const MAX_BODY_BYTES = 8192;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const targets = new Map(POST_TARGETS.map((spot) => [spot.id, spot]));
const genres = new Set(GENRES.map((genre) => genre.id));
const genders = new Set(['male', 'female', 'other']);
const studentCategories = new Set<StudentCategory>([
  'elementary',
  'juniorHigh',
  'highSchool',
  'university',
]);
const postsReady = (env: Env) =>
  Boolean(env.DB && env.POSTS_ENABLED === 'true' && (env.POST_RATE_LIMIT_SECRET?.length ?? 0) >= 32);
const rallyReady = (env: Env) =>
  Boolean(
    env.DB && env.RALLY_SYNC_ENABLED === 'true' && (env.POST_RATE_LIMIT_SECRET?.length ?? 0) >= 32,
  );

function json(value: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    },
  });
}
const error = (message: string, status = 400) => json({ error: message }, status);

function post(row: Row): Post {
  return {
    id: row.id,
    userId: 'anonymous',
    spotId: row.spot_id,
    caption: row.caption,
    images: [],
    likeCount: 0,
    createdAt: row.created_at,
  };
}

function filterValues(url: URL, name: string, allowed: Set<string>): string[] | null {
  const raw = url.searchParams.get(name);
  if (raw === null) return [];
  const values = [...new Set(raw.split(','))];
  return values.length <= 100 && values.every((value) => allowed.has(value)) ? values : null;
}

async function list(url: URL, env: Env) {
  const limitRaw = url.searchParams.get('limit') ?? '20';
  if (!/^\d{1,2}$/.test(limitRaw) || +limitRaw < 1 || +limitRaw > 50) {
    return error('取得件数が不正です。');
  }
  const spotIds = filterValues(url, 'spotIds', new Set(targets.keys()));
  const genreIds = filterValues(url, 'genreIds', genres);
  if (!spotIds || !genreIds) return error('絞り込み条件が不正です。');
  if (!env.DB) return error('投稿の保存先が未設定です。', 503);

  const clauses = ["status = 'visible'"];
  const values: (string | number)[] = [];
  if (spotIds.length || genreIds.length) {
    const selected = POST_TARGETS.filter(
      (spot) =>
        (!spotIds.length || spotIds.includes(spot.id)) &&
        (!genreIds.length || (spot.genreId && genreIds.includes(spot.genreId))),
    ).map((spot) => spot.id);
    if (!selected.length) return json({ posts: [], nextCursor: null, acceptingPosts: postsReady(env) });
    // 投稿対象全体はD1のbind上限を超え得るため、JSONを一つのbind値として渡す。
    clauses.push('spot_id IN (SELECT value FROM json_each(?))');
    values.push(JSON.stringify(selected));
  }

  const cursor = url.searchParams.get('cursor');
  if (cursor !== null) {
    try {
      if (cursor.length > 200) throw new Error();
      const parsed: unknown = JSON.parse(atob(cursor));
      if (
        !Array.isArray(parsed) ||
        parsed.length !== 2 ||
        typeof parsed[0] !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(parsed[0]) ||
        !UUID.test(parsed[1])
      ) {
        throw new Error();
      }
      clauses.push('(created_at < ? OR (created_at = ? AND id < ?))');
      values.push(parsed[0], parsed[0], parsed[1]);
    } catch {
      return error('ページ情報が不正です。');
    }
  }

  const { results } = await env.DB.prepare(
    `SELECT id, spot_id, caption, created_at FROM posts WHERE ${clauses.join(' AND ')} ORDER BY created_at DESC, id DESC LIMIT ?`,
  )
    .bind(...values, +limitRaw + 1)
    .all<Row>();
  const page = results.slice(0, +limitRaw);
  const last = page.at(-1);
  return json({
    posts: page.map(post),
    nextCursor:
      results.length > +limitRaw && last ? btoa(JSON.stringify([last.created_at, last.id])) : null,
    acceptingPosts: postsReady(env),
  });
}

function writeTransportError(request: Request): Response | null {
  const origin = request.headers.get('Origin');
  if (
    (origin && origin !== new URL(request.url).origin) ||
    request.headers.get('Sec-Fetch-Site') === 'cross-site'
  ) {
    return error('同じサイトから送信してください。', 403);
  }
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return error('JSONで送信してください。', 415);
  }
  return null;
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
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

async function internalKey(anonymousId: string, secretValue: string): Promise<string> {
  const secret = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretValue),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    secret,
    new TextEncoder().encode(anonymousId.toLowerCase()),
  );
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function parseBodyError(cause: unknown) {
  return error(
    cause instanceof RangeError ? '送信データが大きすぎます。' : 'JSONが不正です。',
    cause instanceof RangeError ? 413 : 400,
  );
}

async function create(request: Request, env: Env) {
  if (!postsReady(env) || !env.DB) return error('現在、投稿の受付を停止しています。', 503);
  const transportError = writeTransportError(request);
  if (transportError) return transportError;
  const key = request.headers.get('Idempotency-Key') ?? '';
  if (!UUID.test(key)) return error('送信識別子が不正です。');

  let input: unknown;
  try {
    input = await body(request);
  } catch (cause) {
    return parseBodyError(cause);
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return error('投稿データが不正です。');
  }
  const data = input as Record<string, unknown>;
  if (
    Object.keys(data).some(
      (name) => name !== 'anonymousId' && name !== 'spotId' && name !== 'caption',
    ) ||
    typeof data.anonymousId !== 'string' ||
    !UUID.test(data.anonymousId) ||
    typeof data.spotId !== 'string' ||
    !targets.has(data.spotId) ||
    typeof data.caption !== 'string'
  ) {
    return error('投稿先または本文が不正です。');
  }
  const caption = data.caption.trim();
  const characters = [...caption];
  const invalidCharacter = characters.some((character) => {
    const code = character.codePointAt(0)!;
    return (
      (code < 32 && code !== 9 && code !== 10 && code !== 13) ||
      code === 127 ||
      (code >= 0xd800 && code <= 0xdfff)
    );
  });
  if (!caption || characters.length > 500 || invalidCharacter) {
    return error('本文は1〜500文字で入力してください。');
  }

  const author = await internalKey(data.anonymousId, env.POST_RATE_LIMIT_SECRET!);
  const id = crypto.randomUUID();
  const now = Date.now();

  // COUNTとINSERTを一つのSQLにし、D1 batchでINSERTと再送照会を同じtransactionにする。
  const [, selected] = await env.DB.batch<Row>([
    env.DB.prepare(`INSERT INTO posts (id, spot_id, caption, created_at, created_ms, request_key, author_hash)
      SELECT ?, ?, ?, ?, ?, ?, ?
      WHERE (SELECT COUNT(*) FROM posts WHERE author_hash = ? AND created_ms > ?) < 5
      ON CONFLICT(request_key) DO NOTHING`).bind(
      id,
      data.spotId,
      caption,
      new Date(now).toISOString(),
      now,
      key.toLowerCase(),
      author,
      author,
      now - 60000,
    ),
    env.DB.prepare(
      'SELECT id, spot_id, caption, created_at, status, author_hash FROM posts WHERE request_key = ?',
    ).bind(key.toLowerCase()),
  ]);
  const row = selected.results[0];
  if (!row) {
    return json(
      { error: '投稿が続いています。1分ほど待って再度お試しください。' },
      429,
      { 'Retry-After': '60' },
    );
  }
  if (
    row.status !== 'visible' ||
    row.author_hash !== author ||
    row.spot_id !== data.spotId ||
    row.caption !== caption
  ) {
    return error('この送信識別子では投稿できません。', 409);
  }
  return json({ post: post(row) }, row.id === id ? 201 : 200);
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_TIMESTAMP.test(value)) return false;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) && new Date(milliseconds).toISOString() === value;
}

async function saveParticipant(request: Request, env: Env) {
  if (!rallyReady(env) || !env.DB) {
    return error('現在、スタンプラリー情報を保存できません。', 503);
  }
  const transportError = writeTransportError(request);
  if (transportError) return transportError;

  let input: unknown;
  try {
    input = await body(request);
  } catch (cause) {
    return parseBodyError(cause);
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return error('参加者データが不正です。');
  }
  const data = input as Record<string, unknown>;
  const allowed = new Set([
    'anonymousId',
    'registeredAt',
    'gender',
    'age',
    'isStudent',
    'studentCategory',
    'courseId',
    'exchangedAt',
  ]);
  if (
    Object.keys(data).length !== allowed.size ||
    Object.keys(data).some((name) => !allowed.has(name)) ||
    typeof data.anonymousId !== 'string' ||
    !UUID.test(data.anonymousId) ||
    !isIsoTimestamp(data.registeredAt) ||
    typeof data.gender !== 'string' ||
    !genders.has(data.gender) ||
    typeof data.age !== 'number' ||
    !Number.isInteger(data.age) ||
    data.age < MIN_AGE ||
    data.age > MAX_AGE ||
    typeof data.isStudent !== 'boolean' ||
    typeof data.courseId !== 'number' ||
    !Number.isInteger(data.courseId) ||
    !getCourseById(data.courseId) ||
    (data.exchangedAt !== null && !isIsoTimestamp(data.exchangedAt))
  ) {
    return error('参加者データが不正です。');
  }
  const category = data.studentCategory;
  if (
    (data.isStudent &&
      (typeof category !== 'string' ||
        !studentCategories.has(category as StudentCategory) ||
        !isAgeStudentCategoryValid(data.age, category as StudentCategory))) ||
    (!data.isStudent && category !== null) ||
    (data.exchangedAt !== null && Date.parse(data.exchangedAt) < Date.parse(data.registeredAt))
  ) {
    return error('参加者データが不正です。');
  }

  const participantKey = await internalKey(data.anonymousId, env.POST_RATE_LIMIT_SECRET!);
  await env.DB.prepare(
    `INSERT INTO participants (
      participant_key, registered_at, gender, age, is_student, student_category, course_id, exchanged_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(participant_key) DO UPDATE SET
      exchanged_at = CASE
        WHEN excluded.exchanged_at IS NULL THEN participants.exchanged_at
        WHEN participants.exchanged_at IS NULL THEN excluded.exchanged_at
        WHEN excluded.exchanged_at < participants.exchanged_at THEN excluded.exchanged_at
        ELSE participants.exchanged_at
      END
    RETURNING participant_key`,
  )
    .bind(
      participantKey,
      data.registeredAt,
      data.gender,
      data.age,
      data.isStudent ? 1 : 0,
      data.isStudent ? (category as StudentCategory) : null,
      data.courseId,
      data.exchangedAt,
    )
    .all<{ participant_key: string }>();
  return json({ saved: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/api' && !url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }
    try {
      if (url.pathname === '/api/posts') {
        if (request.method === 'GET') return await list(url, env);
        if (request.method === 'POST') return await create(request, env);
        return json({ error: 'このメソッドは利用できません。' }, 405, { Allow: 'GET, POST' });
      }
      if (url.pathname === '/api/stamprally/participant') {
        if (request.method === 'POST') return await saveParticipant(request, env);
        return json({ error: 'このメソッドは利用できません。' }, 405, { Allow: 'POST' });
      }
      return error('APIが見つかりません。', 404);
    } catch {
      // 本文、匿名ID、secret、D1の詳細はログへ出さない。
      return error('保存サービスに接続できません。時間をおいて再度お試しください。', 503);
    }
  },
};
