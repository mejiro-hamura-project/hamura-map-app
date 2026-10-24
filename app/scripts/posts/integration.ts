import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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
const target = POST_TARGETS.find((item) => item.genreId)!;
const other = POST_TARGETS.find((item) => item.id !== target.id && item.genreId !== target.genreId)!;
const servers: ChildProcess[] = [];
let browser: Browser | undefined;
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
};
const incomplete: RallyState = {
  registration: { nickname: 'テスト参加者', gender: 'other', age: 30, isStudent: false },
  participantId: 'synthetic-test-participant', participantNumber: 1, courseId: 1,
  collectedIds: [1], phraseSlots: [1, null, null, null, null, null, null],
  phraseSolved: false, prizeExchanged: false, startedAt: '2026-10-25T00:00:00.000Z',
};
const complete: RallyState = {
  ...incomplete, collectedIds: [1, 2, 3, 4, 5, 6, 7], phraseSlots: [1, 2, 3, 4, 5, 6, 7],
};

async function runWrangler(args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [wrangler, ...args], {
      cwd: app, stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, CI: 'true', BROWSER: 'none', WRANGLER_SEND_METRICS: 'false' },
    });
    let log = '';
    child.stdout.on('data', (chunk) => { log += chunk; });
    child.stderr.on('data', (chunk) => { log += chunk; });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Wrangler exited ${code}: ${log}`)));
  });
}
async function sql(statement: string) {
  const file = path.join(runtime, `${randomUUID()}.sql`);
  await writeFile(file, statement);
  try {
    await runWrangler(['d1', 'execute', 'hamura-posts-local', '--local', '--config', config, '--persist-to', persist, '--file', file]);
  } finally { await rm(file, { force: true }); }
}
async function freePort() {
  const socket = net.createServer();
  await new Promise<void>((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = (socket.address() as net.AddressInfo).port;
  await new Promise<void>((resolve) => socket.close(() => resolve()));
  return port;
}
async function startServer(configPath: string, expectedStatus: number, persisted?: string) {
  const port = await freePort();
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
function create(origin: string, caption: string, ip = '192.0.2.1', key = randomUUID(), spotId = target.id) {
  return request(origin, '/api/posts', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, 'CF-Connecting-IP': ip },
    body: JSON.stringify({ spotId, caption }),
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
    ? localStorage.removeItem('stampRally.v1')
    : localStorage.setItem('stampRally.v1', JSON.stringify(value)), state);
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

try {
  await readFile(path.join(app, 'dist/index.html'));
  const base = {
    main: path.join(app, 'worker/index.ts'), compatibility_date: '2026-09-26',
    assets: { directory: path.join(app, 'dist'), binding: 'ASSETS', not_found_handling: 'single-page-application', run_worker_first: ['/api', '/api/*'] },
    vars: { POSTS_ENABLED: 'true', POST_RATE_LIMIT_SECRET: 'synthetic-local-integration-secret-00000000' },
  };
  await writeFile(config, JSON.stringify({
    ...base, name: 'hamura-posts-integration-local',
    d1_databases: [{ binding: 'DB', database_name: 'hamura-posts-local', migrations_dir: path.join(app, 'migrations'), remote: false }],
  }));
  await writeFile(noDbConfig, JSON.stringify({ ...base, name: 'hamura-posts-no-db-local' }));
  await runWrangler(['d1', 'migrations', 'apply', 'hamura-posts-local', '--local', '--config', config, '--persist-to', persist]);
  const origin = await startServer(config, 200, persist);
  assert.equal((await request(origin)).data.acceptingPosts, true);
  check('local migration and Worker startup');

  if (!process.argv.includes('--browser-only')) {
    const key = randomUUID();
    const first = await create(origin, 'synthetic persistent post', '192.0.2.1', key);
    assert.equal(first.status, 201);
    const retry = await create(origin, 'synthetic persistent post', '192.0.2.1', key);
    assert.equal(retry.status, 200);
    assert.equal(retry.data.post.id, first.data.post.id);
    assert.equal((await create(origin, 'changed', '192.0.2.1', key)).status, 409);
    const parallelKey = randomUUID();
    const parallel = await Promise.all(Array.from({ length: 6 }, () => create(origin, 'parallel retry', '192.0.2.2', parallelKey)));
    assert.equal(parallel.filter((item) => item.status === 201).length, 1);
    assert.equal(new Set(parallel.map((item) => item.data.post.id)).size, 1);
    check('idempotency, conflicting retry and concurrent duplicate prevention');

    for (const caption of ['', ' ', 'x'.repeat(501), '\u0000bad']) assert.equal((await create(origin, caption)).status, 400);
    assert.equal((await create(origin, 'bad target', '192.0.2.1', randomUUID(), "unknown'); DROP TABLE posts;--")).status, 400);
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

    const concurrent = await Promise.all(Array.from({ length: 10 }, (_, index) => create(origin, `rate ${index}`, '192.0.2.50')));
    assert.equal(concurrent.filter((item) => item.status === 201).length, 5);
    assert.equal(concurrent.filter((item) => item.status === 429).length, 5);
    assert.equal(concurrent.find((item) => item.status === 429)!.response.headers.get('retry-after'), '60');
    check('atomic rate limit under concurrent requests');

    await sql(`UPDATE posts SET status='hidden' WHERE id='${first.data.post.id}';`);
    assert.ok(!(await request(origin)).data.posts.some((item: { id: string }) => item.id === first.data.post.id));
    assert.equal((await create(origin, 'synthetic persistent post', '192.0.2.1', key)).status, 409);
    await sql(`UPDATE posts SET status='visible' WHERE id='${first.data.post.id}';`);
    assert.ok((await request(origin)).data.posts.some((item: { id: string }) => item.id === first.data.post.id));
    check('D1 hide, hidden retry rejection and restore');

    // Scale fixtures are used only for the API pagination check and removed before browser smoke.
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
    assert.equal(seen.length, 82);
    assert.deepEqual(dates, [...dates].sort().reverse());
    await sql(`DELETE FROM posts WHERE author_hash='fixture';`);
    check('server filtering and stable bounded newest-first pagination');
  }

  const xss = '<img src=x onerror="window.__postXss=1"><script>window.__postXss=2</script>';
  assert.equal((await create(origin, xss, '192.0.2.80')).status, 201);
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
  assert.equal(await page.getByText('いいね（準備中）', { exact: true }).first().isDisabled(), true);
  const caption = await openComposer(page);
  await caption.fill('synthetic browser persistence');
  await page.getByRole('button', { name: '投稿する', exact: true }).last().click();
  await page.getByRole('status').filter({ hasText: 'synthetic browser persistence' }).waitFor();
  const swPage = await swContext.newPage();
  await swPage.goto(origin + '/posts');
  await swPage.getByText('synthetic browser persistence', { exact: true }).waitFor();
  await swPage.reload();
  await swPage.getByText('synthetic browser persistence', { exact: true }).waitFor();
  check('browser save, cross-context read, reload, disabled likes and escaped XSS');

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
    [{ ...complete, phraseSolved: true, prizeExchanged: true }, /exchange$/],
  ];
  for (const [state, expected] of restores) {
    await setRallyState(page, origin, state);
    await page.goto(origin + '/stamprally');
    await page.waitForURL(expected);
    await assertNav(page);
  }
  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem('stampRally.v1')!));
  assert.equal(restored.registration.nickname, 'テスト参加者');
  assert.equal(restored.courseId, 1);
  assert.deepEqual(restored.collectedIds, [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(restored.phraseSolved, true);
  assert.equal(restored.prizeExchanged, true);
  check('entry restores registration, course, stamps, answer and exchange state');

  await context.addInitScript(() => {
    (window as unknown as Record<string, number>).__cameraStops = 0;
    if (typeof MediaStreamTrack === 'undefined') return;
    const original = MediaStreamTrack.prototype.stop;
    MediaStreamTrack.prototype.stop = function (...args) {
      (window as unknown as Record<string, number>).__cameraStops++;
      return original.apply(this, args as []);
    };
  });
  const cameraPage = await context.newPage();
  await cameraPage.context().grantPermissions(['camera'], { origin });
  await setRallyState(cameraPage, origin, incomplete);
  await cameraPage.goto(origin + '/stamprally/camera');
  await cameraPage.locator('video').waitFor({ state: 'visible' });
  await cameraPage.waitForFunction(() => Boolean((document.querySelector('video') as HTMLVideoElement | null)?.srcObject));
  await cameraPage.getByRole('link', { name: /ホーム/ }).click();
  await cameraPage.waitForURL(origin + '/');
  await cameraPage.waitForFunction(() => (window as unknown as Record<string, number>).__cameraStops > 0);
  await cameraPage.getByRole('link', { name: /スタンプラリー/ }).click();
  await cameraPage.waitForURL(/\/stamprally\/rally$/);
  await cameraPage.getByRole('button', { name: /取得済み/ }).first().waitFor();
  check('footer exit stops camera tracks and returning to Stamp restores map progress');

  const shortContext = await browser.newContext({ viewport: { width: 390, height: 480 }, serviceWorkers: 'block' });
  await localOnly(shortContext, origin);
  shortContext.setDefaultTimeout(20000);
  const shortPage = await shortContext.newPage();
  await setRallyState(shortPage, origin, incomplete);
  await shortPage.goto(origin + '/stamprally/rally');
  const cameraCta = shortPage.getByRole('button', { name: /QRコードを読み取る/ });
  await cameraCta.scrollIntoViewIfNeeded();
  const cameraBox = await cameraCta.boundingBox();
  assert.ok(cameraBox && cameraBox.y >= 0 && cameraBox.y + cameraBox.height <= 480);
  await assertNav(shortPage);
  await setRallyState(shortPage, origin, { ...complete, phraseSolved: true });
  await shortPage.goto(origin + '/stamprally/exchange');
  const staff = shortPage.getByTestId('staff-long-press');
  await staff.scrollIntoViewIfNeeded();
  const staffBox = await staff.boundingBox();
  assert.ok(staffBox && staffBox.y >= 0 && staffBox.y + staffBox.height <= 480);
  await assertNav(shortPage);
  await shortContext.close();
  check('480px viewport reaches camera and staff controls without footer overlap');

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

  const disabledOrigin = await startServer(noDbConfig, 503);
  const noDbGet = await request(disabledOrigin);
  assert.equal(noDbGet.status, 503);
  assert.match(noDbGet.data.error, /保存先/);
  const noDbPost = await create(disabledOrigin, 'must not save', '192.0.2.200');
  assert.equal(noDbPost.status, 503);
  assert.match(noDbPost.data.error, /受付を停止/);
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
  await disabledContext.close();
  check('missing D1 returns no-store JSON 503 while normal routes and read-only UI work');

  console.log(`PASS ${passed} integration groups; local D1 only; no deploy/remote operations`);
} finally {
  await browser?.close();
  for (const child of servers.reverse()) await stopServer(child);
  await rm(runtime, { recursive: true, force: true, maxRetries: 20, retryDelay: 300 });
}
