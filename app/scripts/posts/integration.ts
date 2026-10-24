import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { access, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { POST_TARGETS } from '../../src/shared/postTargets';
import { spotDisplayName } from '../../src/shared/utils/spotSearch';

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const wrangler = path.join(app, 'node_modules/wrangler/bin/wrangler.js');
const scratch = path.join(app, '.wrangler');
await mkdir(scratch, { recursive: true });
const runtime = await mkdtemp(path.join(scratch, 'posts-integration-'));
const config = path.join(runtime, 'enabled.json');
const noDbConfig = path.join(runtime, 'no-db.json');
const persist = path.join(runtime, 'd1');
const upgradeConfig = path.join(runtime, 'upgrade.json');
const upgradePersist = path.join(runtime, 'upgrade-d1');
const target = POST_TARGETS.find((item) => item.genreId)!;
const other = POST_TARGETS.find((item) => item.id !== target.id && item.genreId !== target.genreId)!;
const servers: ChildProcess[] = [];
let browser: Browser | undefined;
let persistentContext: BrowserContext | undefined;
let passed = 0;
const check = (name: string) => { passed++; console.log(`PASS ${name}`); };

type RallyState = {
  registration: { nickname: string; gender: 'other'; age: number; isStudent: false } | null;
  participantId: string | null;
  participantNumber: number | null;
  courseId: number | null;
  collectedIds: number[];
  phraseSlots: (number | null)[];
  phraseSolved: boolean;
  prizeExchanged: boolean;
  startedAt: string | null;
  exchangedAt: string | null;
};
const ANONYMOUS_ID_KEY = 'app.anonymousId.v1';
const RALLY_STATE_KEY = 'stampRally.v2';
const RALLY_QUEUE_KEY = 'stampRally.d1Sync.v1';
const incomplete: RallyState = {
  registration: { nickname: 'テスト参加者', gender: 'other', age: 30, isStudent: false },
  participantId: '00000000-0000-4000-8000-000000000101', participantNumber: 1, courseId: 1,
  collectedIds: [1], phraseSlots: [1, null, null, null, null, null, null],
  phraseSolved: false, prizeExchanged: false, startedAt: '2026-10-25T00:00:00.000Z', exchangedAt: null,
};
const complete: RallyState = {
  ...incomplete, collectedIds: [1, 2, 3, 4, 5, 6, 7], phraseSlots: [1, 2, 3, 4, 5, 6, 7],
};

async function runWrangler(args: string[]) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(process.execPath, [wrangler, ...args], {
      cwd: app, stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, CI: 'true', BROWSER: 'none', WRANGLER_SEND_METRICS: 'false' },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve(stdout) : reject(new Error(`Wrangler exited ${code}: ${stdout}${stderr}`)));
  });
}
async function sql(statement: string) {
  const file = path.join(runtime, `${randomUUID()}.sql`);
  await writeFile(file, statement);
  try {
    await runWrangler(['d1', 'execute', 'hamura-posts-local', '--local', '--config', config, '--persist-to', persist, '--file', file]);
  } finally { await rm(file, { force: true }); }
}
async function query<T extends Record<string, unknown>>(statement: string): Promise<T[]> {
  const output = await runWrangler([
    'd1', 'execute', 'hamura-posts-local', '--local', '--config', config, '--persist-to', persist,
    '--command', statement, '--json',
  ]);
  const parsed = JSON.parse(output) as Array<{ results?: T[] }>;
  return parsed[0]?.results ?? [];
}
async function freePort() {
  const socket = net.createServer();
  await new Promise<void>((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = (socket.address() as net.AddressInfo).port;
  await new Promise<void>((resolve) => socket.close(() => resolve()));
  return port;
}
async function startServer(configPath: string, expectedStatus: number, persisted?: string, requestedPort?: number) {
  const port = requestedPort ?? await freePort();
  const origin = `http://127.0.0.1:${port}`;
  const args = ['dev', '--local', '--show-interactive-dev-session=false', '--config', configPath, '--ip', '127.0.0.1', '--port', String(port)];
  if (persisted) args.push('--persist-to', persisted);
  const child = spawn(process.execPath, [wrangler, ...args], {
    cwd: app, stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, CI: 'true', BROWSER: 'none', WRANGLER_SEND_METRICS: 'false' },
  });
  servers.push(child);
  let log = '';
  child.stdout!.on('data', (chunk) => { log = (log + chunk).slice(-16000); });
  child.stderr!.on('data', (chunk) => { log = (log + chunk).slice(-16000); });
  for (let attempt = 0; ; attempt++) {
    try { if ((await fetch(origin + '/api/posts', { signal: AbortSignal.timeout(2000) })).status === expectedStatus) return origin; } catch { /* starting */ }
    if (attempt > 240 || child.exitCode !== null) throw new Error(`Local Worker did not start: ${log}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}
async function stopServer(child: ChildProcess) {
  if (!child.pid || child.exitCode !== null) return;
  if (process.platform !== 'win32') { child.kill('SIGTERM'); return; }
  await new Promise<void>((resolve) => {
    const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    killer.on('error', () => resolve());
    killer.on('exit', () => resolve());
  });
}
async function request(origin: string, route = '/api/posts', init: RequestInit = {}) {
  const response = await fetch(origin + route, { signal: AbortSignal.timeout(15000), ...init });
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  assert.match(response.headers.get('content-type') ?? '', /application\/json/);
  return { status: response.status, data: await response.json() as any, response };
}
function create(origin: string, caption: string, anonymousId = randomUUID(), ip = '192.0.2.1', key = randomUUID(), spotId = target.id) {
  return request(origin, '/api/posts', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, 'CF-Connecting-IP': ip },
    body: JSON.stringify({ anonymousId, spotId, caption }),
  });
}
function participant(origin: string, anonymousId: string, overrides: Record<string, unknown> = {}) {
  return request(origin, '/api/stamprally/participant', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      anonymousId, registeredAt: '2026-10-25T00:00:00.000Z', gender: 'other', age: 30,
      isStudent: false, studentCategory: null, courseId: 1, exchangedAt: null, ...overrides,
    }),
  });
}
async function localOnly(context: BrowserContext, origin: string) {
  const allowed = new URL(origin).origin;
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== allowed && !['data:', 'blob:'].includes(url.protocol)) {
      await route.abort('blockedbyclient');
      throw new Error(`Integration test blocked external request: ${url.origin}`);
    }
    await route.continue();
  });
}
async function setRallyState(page: Page, origin: string, state: RallyState | null) {
  await page.goto(origin + '/');
  await page.evaluate((value) => value === null
    ? localStorage.removeItem('stampRally.v2')
    : localStorage.setItem('stampRally.v2', JSON.stringify(value)), state);
}
async function withHistoryState(page: Page, origin: string, route: string, state: unknown) {
  await page.goto(origin + '/');
  await page.evaluate(({ route, state }) => history.replaceState({ usr: state, key: 'integration', idx: 0 }, '', route), { route, state });
  await page.reload();
}
async function assertNav(page: Page) {
  const nav = page.getByRole('navigation', { name: 'メインナビゲーション' });
  await nav.waitFor({ state: 'visible' });
  assert.equal(await nav.getByRole('link').count(), 4);
  const box = await nav.boundingBox();
  assert.ok(box && box.y >= 0 && box.y + box.height <= page.viewportSize()!.height + 1);
}
async function openComposer(page: Page) {
  await page.getByRole('button', { name: '投稿する', exact: true }).click();
  await page.getByPlaceholder('店名・イベント名を入力（例：や）').fill(spotDisplayName(target.name));
  await page.getByRole('button').filter({ hasText: target.name }).first().click();
  return page.getByPlaceholder('感想を書く…');
}
async function registerThroughUi(page: Page, origin: string) {
  await page.goto(origin + '/stamprally/register');
  await page.getByLabel(/ニックネーム/).fill('架空の参加者');
  await page.getByLabel(/性別/).selectOption('other');
  await page.getByLabel(/年齢/).fill('30');
  await page.getByLabel(/学生ですか/).selectOption('no');
  const syncRequest = page.waitForRequest((item) =>
    item.method() === 'POST' && new URL(item.url()).pathname === '/api/stamprally/participant');
  await page.getByRole('button', { name: /参加する/ }).click();
  await page.waitForURL(/\/stamprally\/rally$/);
  return (await syncRequest).postDataJSON() as Record<string, unknown>;
}

try {
  await readFile(path.join(app, 'dist/index.html'));
  const base = {
    main: path.join(app, 'worker/index.ts'), compatibility_date: '2026-09-26',
    assets: { directory: path.join(app, 'dist'), binding: 'ASSETS', not_found_handling: 'single-page-application', run_worker_first: ['/api', '/api/*'] },
    vars: { POSTS_ENABLED: 'true', RALLY_SYNC_ENABLED: 'true', POST_RATE_LIMIT_SECRET: 'synthetic-local-integration-secret-00000000' },
  };
  await writeFile(config, JSON.stringify({
    ...base, name: 'hamura-posts-integration-local',
    d1_databases: [{ binding: 'DB', database_name: 'hamura-posts-local', migrations_dir: path.join(app, 'migrations'), remote: false }],
  }));
  await writeFile(noDbConfig, JSON.stringify({ ...base, name: 'hamura-posts-no-db-local' }));

  const legacyMigrations = path.join(runtime, 'legacy-migrations');
  await mkdir(legacyMigrations);
  await copyFile(path.join(app, 'migrations/0001_posts.sql'), path.join(legacyMigrations, '0001_posts.sql'));
  const upgradeDatabase = [{
    binding: 'DB', database_name: 'hamura-posts-upgrade-local', migrations_dir: legacyMigrations, remote: false,
  }];
  await writeFile(upgradeConfig, JSON.stringify({ ...base, name: 'hamura-posts-upgrade-local', d1_databases: upgradeDatabase }));
  await runWrangler(['d1', 'migrations', 'apply', 'hamura-posts-upgrade-local', '--local', '--config', upgradeConfig, '--persist-to', upgradePersist]);
  await writeFile(upgradeConfig, JSON.stringify({
    ...base, name: 'hamura-posts-upgrade-local',
    d1_databases: [{ ...upgradeDatabase[0], migrations_dir: path.join(app, 'migrations') }],
  }));
  await runWrangler(['d1', 'migrations', 'apply', 'hamura-posts-upgrade-local', '--local', '--config', upgradeConfig, '--persist-to', upgradePersist]);
  const upgradeOutput = await runWrangler([
    'd1', 'execute', 'hamura-posts-upgrade-local', '--local', '--config', upgradeConfig, '--persist-to', upgradePersist,
    '--command', "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('posts','participants') ORDER BY name", '--json',
  ]);
  assert.deepEqual(
    (JSON.parse(upgradeOutput) as Array<{ results: Array<{ name: string }> }>)[0].results.map((row) => row.name),
    ['participants', 'posts'],
  );
  await runWrangler(['d1', 'migrations', 'apply', 'hamura-posts-local', '--local', '--config', config, '--persist-to', persist]);
  // Applying the numbered migrations a second time must be a no-op.
  await runWrangler(['d1', 'migrations', 'apply', 'hamura-posts-local', '--local', '--config', config, '--persist-to', persist]);
  assert.equal(Number((await query<{ count: number }>('SELECT COUNT(*) AS count FROM d1_migrations'))[0].count), 2);
  const origin = await startServer(config, 200, persist);
  assert.equal((await request(origin)).data.acceptingPosts, true);
  check('local migration and Worker startup');

  if (!process.argv.includes('--browser-only')) {
    const persistentId = '00000000-0000-4000-8000-000000000201';
    const key = randomUUID();
    const first = await create(origin, 'synthetic persistent post', persistentId, '192.0.2.1', key);
    assert.equal(first.status, 201);
    const retry = await create(origin, 'synthetic persistent post', persistentId, '192.0.2.99', key);
    assert.equal(retry.status, 200);
    assert.equal(retry.data.post.id, first.data.post.id);
    assert.equal((await create(origin, 'changed', persistentId, '192.0.2.1', key)).status, 409);
    const publicPost = JSON.stringify(first.data);
    assert.ok(!publicPost.includes(persistentId));
    assert.doesNotMatch(publicPost, /anonymousId|author_hash|authorHash|participant_key|participantKey/);
    const parallelKey = randomUUID();
    const parallelId = '00000000-0000-4000-8000-000000000202';
    const parallel = await Promise.all(Array.from({ length: 6 }, () => create(origin, 'parallel retry', parallelId, '192.0.2.2', parallelKey)));
    assert.equal(parallel.filter((item) => item.status === 201).length, 1);
    assert.equal(new Set(parallel.map((item) => item.data.post.id)).size, 1);
    check('anonymous post body, private response, idempotency and concurrent duplicate prevention');

    for (const caption of ['', ' ', 'x'.repeat(501), '\u0000bad']) assert.equal((await create(origin, caption)).status, 400);
    assert.equal((await create(origin, 'bad target', randomUUID(), '192.0.2.1', randomUUID(), "unknown'); DROP TABLE posts;--")).status, 400);
    assert.equal((await create(origin, 'bad anonymous id', 'not-a-uuid')).status, 400);
    assert.equal((await request(origin, '/api/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': randomUUID() },
      body: JSON.stringify({ spotId: target.id, caption: 'missing anonymous id' }),
    })).status, 400);
    assert.equal((await request(origin, '/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': randomUUID(), 'CF-Connecting-IP': '192.0.2.1' }, body: '{broken' })).status, 400);
    assert.equal((await create(origin, 'x'.repeat(9000))).status, 413);
    assert.equal((await request(origin, '/api/posts', { method: 'DELETE' })).status, 405);
    assert.equal((await request(origin, '/api/posts', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{}' })).status, 415);
    assert.equal((await request(origin, '/api/posts?limit=51')).status, 400);
    assert.equal((await request(origin, '/api/posts?cursor=bad')).status, 400);
    assert.equal((await request(origin, '/api/posts?genreIds=unknown')).status, 400);
    assert.equal((await request(origin, '/api')).status, 404);
    assert.equal((await request(origin, '/api/unknown')).status, 404);
    check('validation, body limit, methods, cursor and API routes never SPA-fallback');

    const rateId = '00000000-0000-4000-8000-000000000203';
    const concurrent = await Promise.all(Array.from({ length: 10 }, (_, index) => create(origin, `rate ${index}`, rateId, `192.0.2.${50 + index}`)));
    assert.equal(concurrent.filter((item) => item.status === 201).length, 5);
    assert.equal(concurrent.filter((item) => item.status === 429).length, 5);
    assert.equal(concurrent.find((item) => item.status === 429)!.response.headers.get('retry-after'), '60');
    const sharedIp = '192.0.2.240';
    const independent = await Promise.all([
      ...Array.from({ length: 5 }, (_, index) => create(origin, `identity A ${index}`, '00000000-0000-4000-8000-000000000204', sharedIp)),
      ...Array.from({ length: 5 }, (_, index) => create(origin, `identity B ${index}`, '00000000-0000-4000-8000-000000000205', sharedIp)),
    ]);
    assert.ok(independent.every((item) => item.status === 201));
    check('atomic five-per-identity rate limit and independent identities on one IP');

    await sql(`UPDATE posts SET status='hidden' WHERE id='${first.data.post.id}';`);
    assert.ok(!(await request(origin)).data.posts.some((item: { id: string }) => item.id === first.data.post.id));
    assert.equal((await create(origin, 'synthetic persistent post', persistentId, '192.0.2.1', key)).status, 409);
    await sql(`UPDATE posts SET status='visible' WHERE id='${first.data.post.id}';`);
    assert.ok((await request(origin)).data.posts.some((item: { id: string }) => item.id === first.data.post.id));
    check('D1 hide, hidden retry rejection and restore');

    const registeredId = persistentId;
    const registered = await participant(origin, registeredId);
    assert.ok(registered.status >= 200 && registered.status < 300);
    assert.deepEqual(registered.data, { saved: true });
    let rows = await query<Record<string, unknown>>(`SELECT * FROM participants WHERE registered_at='2026-10-25T00:00:00.000Z'`);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].gender, 'other');
    assert.equal(Number(rows[0].age), 30);
    assert.equal(Number(rows[0].is_student), 0);
    assert.equal(rows[0].student_category, null);
    assert.equal(Number(rows[0].course_id), 1);
    assert.equal(rows[0].exchanged_at, null);
    const postKey = await query<{ author_hash: string }>(`SELECT author_hash FROM posts WHERE id='${first.data.post.id}'`);
    assert.equal(rows[0].participant_key, postKey[0].author_hash);
    const exchangedAt = '2026-10-25T01:00:00.000Z';
    assert.ok((await participant(origin, registeredId, { exchangedAt })).status < 300);
    assert.ok((await participant(origin, registeredId)).status < 300);
    rows = await query<Record<string, unknown>>(`SELECT * FROM participants WHERE participant_key='${postKey[0].author_hash}'`);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].exchanged_at, exchangedAt);

    const exchangeFirstId = '00000000-0000-4000-8000-000000000206';
    const exchangeFirstAt = '2026-10-25T02:00:00.000Z';
    assert.ok((await participant(origin, exchangeFirstId, { exchangedAt: exchangeFirstAt })).status < 300);
    assert.ok((await participant(origin, exchangeFirstId, { registeredAt: '2026-10-24T23:00:00.000Z' })).status < 300);
    assert.ok((await participant(origin, exchangeFirstId, { exchangedAt: exchangeFirstAt })).status < 300);
    const exchangeRows = await query<Record<string, unknown>>(`SELECT * FROM participants WHERE exchanged_at='${exchangeFirstAt}'`);
    assert.equal(exchangeRows.length, 1);
    const participantColumns = (await query<{ name: string }>('PRAGMA table_info(participants)')).map((column) => column.name);
    assert.deepEqual(participantColumns, ['participant_key', 'registered_at', 'gender', 'age', 'is_student', 'student_category', 'course_id', 'exchanged_at']);
    assert.ok(!participantColumns.some((name) => /stamp|collect|phrase/i.test(name)));
    check('participant register/exchange upsert, reverse arrival, idempotency and shared HMAC key');

    for (const invalid of [
      { anonymousId: 'bad' }, { age: 0 }, { age: 111 }, { gender: 'unknown' },
      { isStudent: false, studentCategory: 'university' }, { isStudent: true, studentCategory: null },
      { courseId: 0 }, { registeredAt: 'not-a-date' }, { exchangedAt: 'not-a-date' }, { extra: true },
    ]) assert.equal((await participant(origin, randomUUID(), invalid)).status, 400);
    assert.equal((await request(origin, '/api/stamprally/participant', {
      method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{}',
    })).status, 415);
    assert.equal((await request(origin, '/api/stamprally/participant', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: 'x'.repeat(9000) }),
    })).status, 413);
    assert.equal((await request(origin, '/api/stamprally/participant')).status, 405);
    check('participant snapshot validation and write-only endpoint');

    // Scale fixtures are used only for the API pagination check and removed before browser smoke.
    const beforeFixtures = Number((await query<{ count: number }>("SELECT COUNT(*) AS count FROM posts WHERE status='visible'"))[0].count);
    const fixtureIds = Array.from({ length: 75 }, () => randomUUID());
    await sql(fixtureIds.map((id, index) => `INSERT INTO posts(id,spot_id,caption,created_at,created_ms,status,request_key,author_hash) VALUES('${id}','${index === 0 ? target.id : other.id}','fixture ${index}','${new Date(Date.UTC(2025, 0, 1, 0, 0, index)).toISOString()}',0,'visible','${randomUUID()}','fixture');`).join('\n'));
    const filtered = await request(origin, `/api/posts?spotIds=${encodeURIComponent(target.id)}&genreIds=${encodeURIComponent(target.genreId!)}&limit=50`);
    assert.ok(filtered.data.posts.some((item: { caption: string }) => item.caption === 'fixture 0'));
    assert.ok(filtered.data.posts.every((item: { spotId: string }) => item.spotId === target.id));
    const seen: string[] = [];
    const dates: string[] = [];
    let cursor: string | null = null;
    do {
      const result = await request(origin, `/api/posts?limit=13${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      assert.ok(result.data.posts.length <= 13);
      seen.push(...result.data.posts.map((item: { id: string }) => item.id));
      dates.push(...result.data.posts.map((item: { createdAt: string }) => item.createdAt));
      cursor = result.data.nextCursor;
    } while (cursor);
    assert.equal(new Set(seen).size, seen.length);
    assert.equal(seen.length, beforeFixtures + 75);
    assert.deepEqual(dates, [...dates].sort().reverse());
    await sql(`DELETE FROM posts WHERE author_hash='fixture';`);
    check('server filtering and stable bounded newest-first pagination');
  }

  const xss = '<img src=x onerror="window.__postXss=1"><script>window.__postXss=2</script>';
  assert.equal((await create(origin, xss, '00000000-0000-4000-8000-000000000299', '192.0.2.80')).status, 201);
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (executablePath) await access(executablePath);
  browser = await chromium.launch({
    headless: true, executablePath,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });
  const context = await browser.newContext({
    serviceWorkers: 'block', extraHTTPHeaders: { 'CF-Connecting-IP': '192.0.2.90' },
    viewport: { width: 390, height: 844 },
  });
  const swContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await localOnly(context, origin);
  await localOnly(swContext, origin);
  context.setDefaultTimeout(20000);
  swContext.setDefaultTimeout(20000);
  const page = await context.newPage();
  let apiRequests = 0;
  page.on('request', (request) => { if (new URL(request.url()).pathname === '/api/posts') apiRequests++; });
  await page.goto(origin + '/posts');
  await page.getByText(xss, { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => (window as unknown as Record<string, unknown>).__postXss), undefined);
  assert.equal(await page.getByText(/いいね/).count(), 0);
  const caption = await openComposer(page);
  await caption.fill('synthetic browser persistence');
  const postFirstRequest = page.waitForRequest((item) => item.method() === 'POST' && new URL(item.url()).pathname === '/api/posts');
  await page.getByRole('button', { name: '投稿する', exact: true }).last().click();
  const postFirstBody = (await postFirstRequest).postDataJSON() as Record<string, unknown>;
  await page.getByRole('status').filter({ hasText: 'synthetic browser persistence' }).waitFor();
  const postFirstId = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), ANONYMOUS_ID_KEY) as string;
  assert.match(postFirstId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(postFirstBody.anonymousId, postFirstId);

  // Old test registrations are ignored without deleting unrelated storage.
  await page.evaluate(({ rallyKey }) => {
    localStorage.setItem('stampRally.v1', JSON.stringify({ registration: { nickname: '旧テスト' } }));
    localStorage.setItem('unrelated.integration.value', 'keep');
    localStorage.removeItem(rallyKey);
  }, { rallyKey: RALLY_STATE_KEY });
  await page.goto(origin + '/stamprally');
  await page.waitForURL(/\/stamprally\/notice$/);
  assert.equal(await page.evaluate(() => localStorage.getItem('unrelated.integration.value')), 'keep');
  const postFirstRallyBody = await registerThroughUi(page, origin);
  assert.equal(postFirstRallyBody.anonymousId, postFirstId);
  const postFirstState = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), RALLY_STATE_KEY) as RallyState;
  assert.equal(postFirstState.participantId, postFirstId);
  await page.waitForFunction((key) => localStorage.getItem(key) === null, RALLY_QUEUE_KEY);

  const swPage = await swContext.newPage();
  const rallyFirstBody = await registerThroughUi(swPage, origin);
  const rallyFirstId = await swPage.evaluate((key) => JSON.parse(localStorage.getItem(key)!), ANONYMOUS_ID_KEY) as string;
  assert.equal(rallyFirstBody.anonymousId, rallyFirstId);
  assert.notEqual(rallyFirstId, postFirstId);
  await swPage.goto(origin + '/posts');
  await swPage.getByText('synthetic browser persistence', { exact: true }).waitFor();
  const rallyFirstCaption = await openComposer(swPage);
  await rallyFirstCaption.fill('synthetic rally-first persistence');
  const rallyFirstPostRequest = swPage.waitForRequest((item) => item.method() === 'POST' && new URL(item.url()).pathname === '/api/posts');
  await swPage.getByRole('button', { name: '投稿する', exact: true }).last().click();
  const rallyFirstPostBody = (await rallyFirstPostRequest).postDataJSON() as Record<string, unknown>;
  assert.equal(rallyFirstPostBody.anonymousId, rallyFirstId);
  await swPage.getByRole('status').filter({ hasText: 'synthetic rally-first persistence' }).waitFor();
  await swPage.reload();
  await swPage.getByText('synthetic browser persistence', { exact: true }).waitFor();
  assert.equal(await swPage.evaluate((key) => JSON.parse(localStorage.getItem(key)!), ANONYMOUS_ID_KEY), rallyFirstId);
  assert.equal(await swPage.getByText(/いいね/).count(), 0);
  const commonRows = await query<{ post_key: string; participant_key: string }>(
    "SELECT posts.author_hash AS post_key, participants.participant_key FROM posts JOIN participants ON posts.author_hash=participants.participant_key WHERE posts.caption IN ('synthetic browser persistence','synthetic rally-first persistence') ORDER BY posts.caption",
  );
  assert.equal(commonRows.length, 2);
  assert.ok(commonRows.every((row) => row.post_key === row.participant_key));
  check('post-first/rally-first common IDs, independent contexts, v1 ignored, reload, no likes and escaped XSS');

  const offlineContext = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  await localOnly(offlineContext, origin);
  offlineContext.setDefaultTimeout(20000);
  const offlinePage = await offlineContext.newPage();
  await offlinePage.route('**/api/stamprally/participant', (route) => route.abort('internetdisconnected'));
  const offlineRegistrationBody = await registerThroughUi(offlinePage, origin);
  const queuedRegistration = await offlinePage.evaluate((key) => JSON.parse(localStorage.getItem(key)!), RALLY_QUEUE_KEY) as Record<string, unknown>;
  assert.deepEqual(queuedRegistration, offlineRegistrationBody);
  assert.deepEqual(Object.keys(queuedRegistration).sort(), [
    'age', 'anonymousId', 'courseId', 'exchangedAt', 'gender', 'isStudent', 'registeredAt', 'studentCategory',
  ]);
  assert.equal(queuedRegistration.exchangedAt, null);
  const offlineState = await offlinePage.evaluate((key) => JSON.parse(localStorage.getItem(key)!), RALLY_STATE_KEY) as RallyState;
  assert.equal(offlineState.participantId, queuedRegistration.anonymousId);
  await offlinePage.unroute('**/api/stamprally/participant');
  await offlinePage.reload();
  await offlinePage.waitForFunction((key) => localStorage.getItem(key) === null, RALLY_QUEUE_KEY);

  await offlinePage.route('**/api/stamprally/participant', (route) => route.abort('internetdisconnected'));
  await offlinePage.evaluate(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), {
    key: RALLY_STATE_KEY,
    state: {
      ...complete,
      registration: offlineState.registration,
      participantId: offlineState.participantId,
      participantNumber: offlineState.participantNumber,
      courseId: offlineState.courseId,
      startedAt: offlineState.startedAt,
      phraseSolved: true,
    },
  });
  await offlinePage.goto(origin + '/stamprally/exchange');
  const staff = offlinePage.getByTestId('staff-long-press');
  await staff.scrollIntoViewIfNeeded();
  const staffBox = await staff.boundingBox();
  assert.ok(staffBox);
  await offlinePage.mouse.move(staffBox.x + staffBox.width / 2, staffBox.y + staffBox.height / 2);
  await offlinePage.mouse.down();
  await offlinePage.waitForTimeout(1000);
  await offlinePage.mouse.up();
  await offlinePage.getByText('本当に交換しますか？', { exact: true }).waitFor();
  const exchangeRequest = offlinePage.waitForRequest((item) =>
    item.method() === 'POST' && new URL(item.url()).pathname === '/api/stamprally/participant');
  await offlinePage.getByRole('button', { name: '交換する', exact: true }).click();
  const exchangeBody = (await exchangeRequest).postDataJSON() as Record<string, unknown>;
  await offlinePage.getByText('交換済み', { exact: true }).waitFor();
  const queuedExchange = await offlinePage.evaluate((key) => JSON.parse(localStorage.getItem(key)!), RALLY_QUEUE_KEY) as Record<string, unknown>;
  assert.deepEqual(queuedExchange, exchangeBody);
  assert.equal(typeof queuedExchange.exchangedAt, 'string');
  assert.equal(queuedExchange.anonymousId, queuedRegistration.anonymousId);
  await offlinePage.unroute('**/api/stamprally/participant');
  await offlinePage.evaluate(() => window.dispatchEvent(new Event('online')));
  await offlinePage.waitForFunction((key) => localStorage.getItem(key) === null, RALLY_QUEUE_KEY);
  const retriedRows = await query<{ exchanged_at: string }>(`SELECT exchanged_at FROM participants WHERE exchanged_at='${queuedExchange.exchangedAt}'`);
  assert.equal(retriedRows.length, 1);
  await offlineContext.close();
  check('latest snapshot queue preserves local progress and retries registration/exchange on access and online');

  const persistentProfile = path.join(runtime, 'persistent-browser-profile');
  persistentContext = await chromium.launchPersistentContext(persistentProfile, {
    headless: true, executablePath, viewport: { width: 390, height: 844 }, serviceWorkers: 'block',
  });
  await localOnly(persistentContext, origin);
  const persistentPage = persistentContext.pages()[0] ?? await persistentContext.newPage();
  await registerThroughUi(persistentPage, origin);
  const beforeRestartId = await persistentPage.evaluate((key) => JSON.parse(localStorage.getItem(key)!), ANONYMOUS_ID_KEY);
  await persistentContext.close();
  persistentContext = undefined;
  persistentContext = await chromium.launchPersistentContext(persistentProfile, {
    headless: true, executablePath, viewport: { width: 390, height: 844 }, serviceWorkers: 'block',
  });
  await localOnly(persistentContext, origin);
  const restartedPage = persistentContext.pages()[0] ?? await persistentContext.newPage();
  await restartedPage.goto(origin + '/');
  assert.equal(await restartedPage.evaluate((key) => JSON.parse(localStorage.getItem(key)!), ANONYMOUS_ID_KEY), beforeRestartId);
  await persistentContext.close();
  persistentContext = undefined;
  check('anonymous ID survives isolated persistent-browser restart');

  await withHistoryState(page, origin, '/posts', { createPostForSpotId: target.id });
  await page.getByRole('heading', { name: '投稿する', exact: true }).waitFor();
  await page.getByText(target.name, { exact: true }).waitFor();
  await page.getByRole('button', { name: '戻る', exact: true }).click();
  await page.goto(origin + `/posts?spotId=${encodeURIComponent(target.id)}`);
  await page.getByRole('button', { name: '投稿を絞り込む' }).waitFor();
  assert.ok((await page.locator('#root').innerText()).includes('synthetic'));
  check('map route state selects the composer target and spotId URL restores filtering');

  await page.waitForTimeout(300);
  const settled = apiRequests;
  await page.waitForTimeout(1500);
  assert.equal(apiRequests, settled);
  for (const route of ['/', '/events', '/stamprally']) {
    await page.goto(origin + route);
    assert.ok((await page.locator('#root').innerText()).length > 0);
    await assertNav(page);
  }
  assert.equal(apiRequests, settled);
  check('no periodic/global post fetch and existing SPA route smoke');

  await page.route('**/api/posts*', (route) => route.abort('failed'));
  await page.goto(origin + '/posts');
  await page.getByRole('alert').filter({ hasText: '投稿を取得できませんでした' }).waitFor();
  await page.unroute('**/api/posts*');
  await page.getByRole('button', { name: '更新', exact: true }).click();
  await page.getByText(xss, { exact: true }).waitFor();
  const retainedCaption = await openComposer(page);
  await retainedCaption.fill('synthetic retained after failure');
  const keys: string[] = [];
  await page.route('**/api/posts', (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    keys.push(route.request().headers()['idempotency-key']);
    return route.abort('failed');
  });
  await page.getByRole('button', { name: '投稿する', exact: true }).last().click();
  await page.getByRole('alert').filter({ hasText: '入力を保持しています' }).waitFor();
  assert.equal(await retainedCaption.inputValue(), 'synthetic retained after failure');
  await page.getByRole('button', { name: '投稿する', exact: true }).last().click();
  await page.waitForTimeout(300);
  assert.equal(keys.length, 2);
  assert.equal(keys[0], keys[1]);
  await page.unroute('**/api/posts');
  check('visible load/create failure, retained input and retry idempotency key');

  const routeCases: Array<[string, RallyState | null]> = [
    ['/stamprally', null], ['/stamprally/notice', null], ['/stamprally/howto', null], ['/stamprally/register', null],
    ['/stamprally/rally', incomplete], ['/stamprally/camera', incomplete], ['/stamprally/challenge', complete],
    ['/stamprally/exchange', { ...complete, phraseSolved: true }],
    ['/stamprally/result', { ...complete, phraseSolved: true }],
  ];
  for (const [route, state] of routeCases) {
    await setRallyState(page, origin, state);
    await page.goto(origin + route);
    await assertNav(page);
  }
  await setRallyState(page, origin, incomplete);
  await withHistoryState(page, origin, '/stamprally/reveal', { checkpointId: 1 });
  await assertNav(page);
  check('shared footer remains visible on every stamp-rally route');

  const restores: Array<[RallyState | null, RegExp]> = [
    [null, /notice$/], [incomplete, /rally$/], [complete, /challenge$/],
    [{ ...complete, phraseSolved: true }, /exchange$/],
    [{ ...complete, phraseSolved: true, prizeExchanged: true, exchangedAt: '2026-10-25T03:00:00.000Z' }, /exchange$/],
  ];
  for (const [state, expected] of restores) {
    await setRallyState(page, origin, state);
    await page.goto(origin + '/stamprally');
    await page.waitForURL(expected);
    await assertNav(page);
  }
  const restored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), RALLY_STATE_KEY);
  assert.equal(restored.registration.nickname, 'テスト参加者');
  assert.equal(restored.courseId, 1);
  assert.deepEqual(restored.collectedIds, [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(restored.phraseSolved, true);
  assert.equal(restored.prizeExchanged, true);
  assert.equal(restored.exchangedAt, '2026-10-25T03:00:00.000Z');
  check('entry restores registration, course, stamps, answer and exchange state');

  await swPage.evaluate(async () => { await navigator.serviceWorker.register('/sw.js'); await navigator.serviceWorker.ready; });
  await swPage.reload();
  await swPage.getByText(xss, { exact: true }).waitFor();
  const xssRow = (await request(origin)).data.posts.find((item: { caption: string }) => item.caption === xss);
  await sql(`UPDATE posts SET status='hidden' WHERE id='${xssRow.id}';`);
  await swPage.getByRole('button', { name: '更新', exact: true }).click();
  await swPage.getByText(xss, { exact: true }).waitFor({ state: 'detached' });
  const cachedApis = await swPage.evaluate(async () => {
    const requests = (await Promise.all((await caches.keys()).map(async (key) => (await (await caches.open(key)).keys()).map((item) => item.url)))).flat();
    return requests.filter((url) => new URL(url).pathname.startsWith('/api'));
  });
  assert.deepEqual(cachedApis, []);
  await swPage.reload();
  assert.equal(await swPage.getByText(xss, { exact: true }).count(), 0);
  check('production Service Worker neither caches API nor resurrects hidden posts');

  const oldDist = process.env.HAMURA_OLD_DIST;
  if (oldDist) {
    await access(path.join(oldDist, 'index.html'));
    const oldPwaConfig = path.join(runtime, 'old-pwa.json');
    const newPwaConfig = path.join(runtime, 'new-pwa.json');
    await writeFile(oldPwaConfig, JSON.stringify({
      ...base, name: 'hamura-old-pwa-local',
      assets: { ...base.assets, directory: oldDist },
    }));
    await writeFile(newPwaConfig, JSON.stringify({ ...base, name: 'hamura-new-pwa-local' }));
    const pwaPort = await freePort();
    const oldPwaOrigin = await startServer(oldPwaConfig, 503, undefined, pwaPort);
    const oldPwaServer = servers.at(-1)!;
    const pwaContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await localOnly(pwaContext, oldPwaOrigin);
    const pwaPage = await pwaContext.newPage();
    await pwaPage.goto(oldPwaOrigin + '/');
    await pwaPage.evaluate(async () => { await navigator.serviceWorker.register('/sw.js'); await navigator.serviceWorker.ready; });
    const updateId = '00000000-0000-4000-8000-000000000401';
    await pwaPage.evaluate(({ idKey, rallyKey, id }) => {
      localStorage.setItem(idKey, JSON.stringify(id));
      localStorage.setItem(rallyKey, JSON.stringify({ registration: { nickname: '旧版テスト' } }));
      localStorage.setItem('pwa-update-unrelated', 'keep');
    }, { idKey: ANONYMOUS_ID_KEY, rallyKey: 'stampRally.v1', id: updateId });
    await stopServer(oldPwaServer);
    servers.splice(servers.indexOf(oldPwaServer), 1);
    await startServer(newPwaConfig, 503, undefined, pwaPort);
    await pwaPage.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
      registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
    });
    await pwaPage.waitForTimeout(1000);
    await pwaPage.reload();
    await pwaPage.waitForTimeout(1000);
    await pwaPage.reload();
    assert.equal(await pwaPage.evaluate((key) => JSON.parse(localStorage.getItem(key)!), ANONYMOUS_ID_KEY), updateId);
    assert.equal(await pwaPage.evaluate(() => localStorage.getItem('pwa-update-unrelated')), 'keep');
    assert.ok(await pwaPage.evaluate(() => localStorage.getItem('stampRally.v1') !== null));
    assert.equal(await pwaPage.evaluate((key) => localStorage.getItem(key), RALLY_STATE_KEY), null);
    await pwaPage.goto(oldPwaOrigin + '/stamprally');
    await pwaPage.waitForURL(/\/stamprally\/notice$/);
    await pwaContext.close();
    check('old production Service Worker updates to new assets without replacing anonymous or unrelated storage');
  } else {
    console.log('SKIP old Service Worker update: HAMURA_OLD_DIST is not set');
  }

  const disabledOrigin = await startServer(noDbConfig, 503);
  const noDbGet = await request(disabledOrigin);
  assert.equal(noDbGet.status, 503);
  assert.match(noDbGet.data.error, /保存先/);
  const noDbPost = await create(disabledOrigin, 'must not save', randomUUID(), '192.0.2.200');
  assert.equal(noDbPost.status, 503);
  assert.match(noDbPost.data.error, /受付を停止/);
  const noDbParticipant = await participant(disabledOrigin, randomUUID());
  assert.equal(noDbParticipant.status, 503);
  const html = await fetch(disabledOrigin + '/stamprally');
  assert.equal(html.status, 200);
  assert.match(html.headers.get('content-type') ?? '', /text\/html/);
  const disabledContext = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await localOnly(disabledContext, disabledOrigin);
  disabledContext.setDefaultTimeout(20000);
  const disabledPage = await disabledContext.newPage();
  await disabledPage.goto(disabledOrigin + '/posts');
  await disabledPage.getByText('現在、投稿受付を停止しています。投稿は保存できません。', { exact: true }).waitFor();
  assert.equal(await disabledPage.getByRole('button', { name: '投稿する', exact: true }).count(), 0);
  await withHistoryState(disabledPage, disabledOrigin, '/posts', { createPostForSpotId: target.id });
  await disabledPage.getByRole('alert').filter({ hasText: '投稿受付を停止' }).waitFor();
  assert.equal(await disabledPage.getByRole('button', { name: '投稿する', exact: true }).last().isDisabled(), true);
  await assertNav(disabledPage);
  const disabledRallyPage = await disabledContext.newPage();
  const disabledRallyBody = await registerThroughUi(disabledRallyPage, disabledOrigin);
  await disabledRallyPage.waitForURL(/\/stamprally\/rally$/);
  assert.equal(disabledRallyBody.anonymousId,
    await disabledRallyPage.evaluate((key) => JSON.parse(localStorage.getItem(key)!), ANONYMOUS_ID_KEY));
  assert.ok(await disabledRallyPage.evaluate((key) => localStorage.getItem(key) !== null, RALLY_QUEUE_KEY));
  await disabledContext.close();
  check('missing D1 returns no-store JSON 503 while posts and local rally registration continue');

  console.log(`PASS ${passed} integration groups; local D1 only; no deploy/remote operations`);
} finally {
  await persistentContext?.close();
  await browser?.close();
  for (const child of servers.reverse()) await stopServer(child);
  await rm(runtime, { recursive: true, force: true, maxRetries: 20, retryDelay: 300 });
}
