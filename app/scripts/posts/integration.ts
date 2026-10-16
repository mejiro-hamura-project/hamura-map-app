// Local only: build first, then run `npx tsx scripts/posts/integration.ts`.
// Every database, browser profile and Worker process belongs to this invocation.
import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { chromium, type Browser } from '@playwright/test';
import { POST_TARGETS } from '../../src/shared/postTargets';

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const wrangler = path.join(app, 'node_modules/wrangler/bin/wrangler.js');
const runtime = await mkdtemp(path.join(tmpdir(), 'hamura-posts-test-'));
const config = path.join(runtime, 'wrangler.json');
const persist = path.join(runtime, 'd1');
const target = POST_TARGETS.find((item) => item.genreId)!;
const other = POST_TARGETS.find((item) => item.id !== target.id && item.genreId !== target.genreId)!;
let server: ChildProcess | undefined;
let browser: Browser | undefined;
let output = '';
let passed = 0;
const check = (name: string) => { passed++; console.log(`PASS ${name}`); };

async function command(args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [wrangler, ...args], { cwd: app, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } });
    let log = '';
    child.stdout.on('data', (chunk) => { log += chunk; });
    child.stderr.on('data', (chunk) => { log += chunk; });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Wrangler exited ${code}: ${log}`)));
  });
}
async function sql(statement: string) {
  const filename = path.join(runtime, 'fixture.sql');
  await writeFile(filename, statement);
  await command(['d1', 'execute', 'hamura-posts-local', '--local', '--config', config, '--persist-to', persist, '--file', filename]);
}
async function freePort() {
  const socket = net.createServer();
  await new Promise<void>((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = (socket.address() as net.AddressInfo).port;
  await new Promise<void>((resolve) => socket.close(() => resolve()));
  return port;
}
const port = await freePort();
const origin = `http://127.0.0.1:${port}`;
async function request(route = '/api/posts', init: RequestInit = {}) {
  const response = await fetch(origin + route, { signal: AbortSignal.timeout(15000), ...init });
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  assert.match(response.headers.get('content-type') ?? '', /application\/json/);
  return { status: response.status, data: await response.json(), response };
}
function create(caption: string, ip = '192.0.2.1', key = randomUUID(), spotId = target.id) {
  return request('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, 'CF-Connecting-IP': ip }, body: JSON.stringify({ spotId, caption }) });
}
try {
  await readFile(path.join(app, 'dist/index.html')); // Fail early if build was omitted.
  await writeFile(config, JSON.stringify({
    name: 'hamura-posts-integration-local', main: path.join(app, 'worker/index.ts'), compatibility_date: '2026-09-26',
    assets: { directory: path.join(app, 'dist'), binding: 'ASSETS', not_found_handling: 'single-page-application', run_worker_first: ['/api', '/api/*'] },
    vars: { POSTS_ENABLED: 'true', POST_RATE_LIMIT_SECRET: 'synthetic-local-integration-secret-00000000' },
    d1_databases: [{ binding: 'DB', database_name: 'hamura-posts-local', migrations_dir: path.join(app, 'migrations'), remote: false }],
  }));
  await command(['d1', 'migrations', 'apply', 'hamura-posts-local', '--local', '--config', config, '--persist-to', persist]);
  // Wrangler 4.142 has no --no-browser option. Noninteractive stdin and disabled
  // interactive controls provide the equivalent; only Playwright opens a browser.
  server = spawn(process.execPath, [wrangler, 'dev', '--local', '--show-interactive-dev-session=false', '--config', config, '--persist-to', persist, '--ip', '127.0.0.1', '--port', String(port)], { cwd: app, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, CI: 'true', BROWSER: 'none', WRANGLER_SEND_METRICS: 'false' } });
  server.stdout!.on('data', (chunk) => { output = (output + chunk).slice(-12000); });
  server.stderr!.on('data', (chunk) => { output = (output + chunk).slice(-12000); });
  for (let attempt = 0; ; attempt++) {
    try { if ((await fetch(origin + '/api/posts', { signal: AbortSignal.timeout(2000) })).status === 200) break; } catch { /* starting */ }
    if (attempt > 240 || server.exitCode !== null) throw new Error(`Local Worker did not start: ${output}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.equal((await request()).data.acceptingPosts, true);
  check('local migration and Worker startup');

  if (!process.argv.includes('--browser-only')) {
  const key = randomUUID();
  const first = await create('synthetic persistent post', '192.0.2.1', key);
  assert.equal(first.status, 201);
  const retry = await create('synthetic persistent post', '192.0.2.1', key);
  assert.equal(retry.status, 200);
  assert.equal(retry.data.post.id, first.data.post.id);
  assert.equal((await create('changed', '192.0.2.1', key)).status, 409);
  const parallelKey = randomUUID();
  const parallel = await Promise.all(Array.from({ length: 6 }, () => create('parallel retry', '192.0.2.2', parallelKey)));
  assert.equal(parallel.filter((item) => item.status === 201).length, 1);
  assert.equal(new Set(parallel.map((item) => item.data.post.id)).size, 1);
  check('idempotency, conflicting retry and concurrent duplicate prevention');

  for (const caption of ['', ' ', 'x'.repeat(501), '\u0000bad']) assert.equal((await create(caption)).status, 400);
  assert.equal((await create('bad target', '192.0.2.1', randomUUID(), "unknown'); DROP TABLE posts;--")).status, 400);
  assert.equal((await request('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': randomUUID(), 'CF-Connecting-IP': '192.0.2.1' }, body: '{broken' })).status, 400);
  assert.equal((await create('x'.repeat(9000))).status, 413);
  assert.equal((await request('/api/posts', { method: 'DELETE' })).status, 405);
  assert.equal((await request('/api/posts', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{}' })).status, 415);
  assert.equal((await request('/api/posts?limit=51')).status, 400);
  assert.equal((await request('/api/posts?cursor=bad')).status, 400);
  assert.equal((await request('/api/posts?genreIds=unknown')).status, 400);
  assert.equal((await request('/api')).status, 404);
  assert.equal((await request('/api/unknown')).status, 404);
  check('invalid input, SQL payload, body size, methods, cursor and API routing');

  const concurrent = await Promise.all(Array.from({ length: 10 }, (_, index) => create(`rate ${index}`, '192.0.2.50')));
  assert.equal(concurrent.filter((item) => item.status === 201).length, 5);
  assert.equal(concurrent.filter((item) => item.status === 429).length, 5);
  assert.equal(concurrent.find((item) => item.status === 429)!.response.headers.get('retry-after'), '60');
  check('atomic server rate limit under concurrent requests');

  await sql(`UPDATE posts SET status='hidden' WHERE id='${first.data.post.id}';`);
  assert.ok(!(await request()).data.posts.some((item: { id: string }) => item.id === first.data.post.id));
  assert.equal((await create('synthetic persistent post', '192.0.2.1', key)).status, 409);
  await sql(`UPDATE posts SET status='visible' WHERE id='${first.data.post.id}';`);
  assert.ok((await request()).data.posts.some((item: { id: string }) => item.id === first.data.post.id));
  check('D1 hide, hidden retry rejection and restore');

  // High volume fixtures are used only for pagination/filter checks, then removed.
  const fixtureIds = Array.from({ length: 75 }, () => randomUUID());
  await sql(fixtureIds.map((id, index) => `INSERT INTO posts(id,spot_id,caption,created_at,created_ms,status,request_key,author_hash) VALUES('${id}','${index === 0 ? target.id : other.id}','fixture ${index}','${new Date(Date.UTC(2025, 0, 1, 0, 0, index)).toISOString()}',0,'visible','${randomUUID()}','fixture');`).join('\n'));
  const filtered = await request(`/api/posts?spotIds=${encodeURIComponent(target.id)}&genreIds=${encodeURIComponent(target.genreId!)}&limit=50`);
  assert.ok(filtered.data.posts.some((item: { caption: string }) => item.caption === 'fixture 0'));
  assert.ok(filtered.data.posts.every((item: { spotId: string }) => item.spotId === target.id));
  const seen: string[] = [];
  const dates: string[] = [];
  let cursor: string | null = null;
  do {
    const page = await request(`/api/posts?limit=13${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
    assert.ok(page.data.posts.length <= 13);
    seen.push(...page.data.posts.map((item: { id: string }) => item.id));
    dates.push(...page.data.posts.map((item: { createdAt: string }) => item.createdAt));
    cursor = page.data.nextCursor;
  } while (cursor);
  assert.equal(new Set(seen).size, seen.length);
  assert.equal(seen.length, 82);
  assert.deepEqual(dates, [...dates].sort().reverse());
  await sql(`DELETE FROM posts WHERE author_hash='fixture';`);
  check('server filters before limit and stable bounded newest-first pagination');
  }

  const xss = '<img src=x onerror="window.__postXss=1"><script>window.__postXss=2</script>';
  assert.equal((await create(xss, '192.0.2.80')).status, 201);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ serviceWorkers: 'block', extraHTTPHeaders: { 'CF-Connecting-IP': '192.0.2.90' } });
  const secondContext = await browser.newContext();
  context.setDefaultTimeout(20000);
  secondContext.setDefaultTimeout(20000);
  const page = await context.newPage();
  page.on('pageerror', (error) => console.error('Browser page error:', error.message));
  let apiRequests = 0;
  page.on('request', (req) => { if (new URL(req.url()).pathname === '/api/posts') apiRequests++; });
  await page.goto(origin + '/posts');
  console.log('Browser phase: /posts loaded');
  await page.getByText(xss, { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => (window as unknown as Record<string, unknown>).__postXss), undefined);
  await page.getByRole('button', { name: '投稿する', exact: true }).click();
  console.log('Browser phase: create form opened');
  await page.getByRole('button').filter({ hasText: '選ぶ' }).first().click();
  const captionInput = page.getByPlaceholder('感想を書く…');
  await captionInput.fill('synthetic browser persistence');
  await page.getByRole('button', { name: '投稿する', exact: true }).last().click();
  await page.getByRole('status').filter({ hasText: 'synthetic browser persistence' }).waitFor();
  console.log('Browser phase: submit confirmed');
  const secondPage = await secondContext.newPage();
  await secondPage.goto(origin + '/posts');
  await secondPage.getByText('synthetic browser persistence', { exact: true }).waitFor();
  await secondPage.reload();
  await secondPage.getByText('synthetic browser persistence', { exact: true }).waitFor();
  check('browser submit, separate browser context read, reload persistence and escaped XSS');

  await page.waitForTimeout(300);
  const settled = apiRequests;
  await page.waitForTimeout(1500);
  assert.equal(apiRequests, settled);
  for (const route of ['/', '/events', '/stamprally']) {
    await page.goto(origin + route);
    assert.ok((await page.locator('#root').innerText()).length > 0);
  }
  assert.equal(apiRequests, settled);
  check('no periodic/global posts fetching and existing SPA route smoke');

  await page.route('**/api/posts*', (route) => route.abort('failed'));
  await page.goto(origin + '/posts');
  await page.getByRole('alert').filter({ hasText: '投稿を取得できませんでした' }).waitFor();
  await page.unroute('**/api/posts*');
  await page.getByRole('button', { name: '更新', exact: true }).click();
  await page.getByText(xss, { exact: true }).waitFor();
  await page.getByRole('button', { name: '投稿する', exact: true }).click();
  await page.getByRole('button').filter({ hasText: '選ぶ' }).first().click();
  await captionInput.fill('synthetic retained after failure');
  const attemptKeys: string[] = [];
  await page.route('**/api/posts', (route) => {
    if (route.request().method() === 'POST') { attemptKeys.push(route.request().headers()['idempotency-key']); return route.abort('failed'); }
    return route.continue();
  });
  await page.getByRole('button', { name: '投稿する', exact: true }).last().click();
  await page.getByRole('alert').filter({ hasText: '入力を保持しています' }).waitFor();
  assert.equal(await captionInput.inputValue(), 'synthetic retained after failure');
  await page.getByRole('button', { name: '投稿する', exact: true }).last().click();
  await page.waitForTimeout(300);
  assert.equal(attemptKeys.length, 2);
  assert.equal(attemptKeys[0], attemptKeys[1]);
  await page.unroute('**/api/posts');
  check('visible load/create failure, retained input and same retry idempotency key');

  // Register the production-built SW explicitly: the app may disable registration in local testing.
  await secondPage.evaluate(async () => { await navigator.serviceWorker.register('/sw.js'); await navigator.serviceWorker.ready; });
  await secondPage.reload();
  await secondPage.getByText(xss, { exact: true }).waitFor();
  const xssRow = (await request()).data.posts.find((item: { caption: string }) => item.caption === xss);
  await sql(`UPDATE posts SET status='hidden' WHERE id='${xssRow.id}';`);
  await secondPage.getByRole('button', { name: '更新', exact: true }).click();
  await secondPage.getByText(xss, { exact: true }).waitFor({ state: 'detached' });
  const cachedApis = await secondPage.evaluate(async () => {
    const urls = (await Promise.all((await caches.keys()).map(async (key) => (await (await caches.open(key)).keys()).map((req) => req.url)))).flat();
    return urls.filter((url) => new URL(url).pathname.startsWith('/api'));
  });
  assert.deepEqual(cachedApis, []);
  await secondPage.reload();
  await secondPage.getByText('synthetic browser persistence', { exact: true }).waitFor();
  assert.equal(await secondPage.getByText(xss, { exact: true }).count(), 0);
  check('active production Service Worker does not cache API or resurrect hidden posts');
  console.log(`PASS ${passed} integration groups; local D1 only; no deploy/remote operations`);
} finally {
  await browser?.close();
  if (server?.pid && server.exitCode === null) {
    if (process.platform === 'win32') {
      await new Promise<void>((resolve) => { const killer = spawn('taskkill', ['/PID', String(server!.pid), '/T', '/F'], { stdio: 'ignore' }); killer.on('error', () => resolve()); killer.on('exit', () => resolve()); });
    } else { server.kill('SIGTERM'); }
  }
  // Windows releases workerd's SQLite/trace handles shortly after taskkill exits.
  await rm(runtime, { recursive: true, force: true, maxRetries: 20, retryDelay: 300 });
}
