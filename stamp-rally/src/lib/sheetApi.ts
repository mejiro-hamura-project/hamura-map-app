import type { Registration } from '../types';
import { ja } from '../i18n/locales/ja';

// Googleスプレッドシート（Apps Script）との通信をまとめたモジュール。
// Excelファイルは生成しない。すべてGoogleスプレッドシートへ直接保存する。
//
// 重要な設計方針: Googleスプレッドシート連携は「あれば使う」任意機能であり、
// アプリ本体（参加登録・スタンプ取得・景品交換）は連携の有無や成否に一切左右されない。
// 進行状況はすべてlocalStorageに保存されるため、VITE_SHEET_WEBHOOK_URLが未設定でも、
// 通信に失敗しても、アプリの操作は止まらない・エラー表示も出ない。
//
// import.meta.env.VITE_* はビルド時にVite（esbuild）が静的に埋め込む値であり、
// 実行時に変わることはない。値を変えたい場合はビルド環境（Cloudflare Workers Builds の
// 環境変数など）に設定したうえで再ビルド・再デプロイする必要がある。
const RAW_WEBHOOK_URL = import.meta.env.VITE_SHEET_WEBHOOK_URL as string | undefined;

// ダミー値や書き間違いを「設定済み」と誤判定しないよう、実際のApps Script
// Webアプリの発行URLの形（https://script.google.com/macros/s/.../exec）かどうかを見る。
function isPlausibleAppsScriptUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'script.google.com';
  } catch {
    return false;
  }
}

const WEBHOOK_URL = isPlausibleAppsScriptUrl(RAW_WEBHOOK_URL) ? RAW_WEBHOOK_URL : undefined;

// 管理者がブラウザの開発者ツール（コンソール）で状態を確認できるよう、URLの値そのものは
// 一切出さずに記録する（画面には出さない）。未設定は正式にサポートされた運用形態
// （スタンドアロン運用）のため info、設定値が不正な形の場合だけ error にする。
if (typeof window !== 'undefined') {
  if (!RAW_WEBHOOK_URL) {
    console.info(
      '[sheetApi] VITE_SHEET_WEBHOOK_URL is not set. Running in standalone mode: ' +
        'registration / stamp progress / prize exchange are saved to localStorage only, ' +
        'and nothing is sent to Google Sheets. See README-sheet-sync.md if you want to enable it.',
    );
  } else if (!isPlausibleAppsScriptUrl(RAW_WEBHOOK_URL)) {
    console.error(
      '[sheetApi] VITE_SHEET_WEBHOOK_URL is set but does not look like a Google Apps Script web app URL ' +
        '(expected https://script.google.com/macros/.../exec). Treating it as not configured ' +
        '(the app still works fully in standalone/localStorage-only mode). See README-sheet-sync.md.',
    );
  }
}

// ─── 送信（すべてベストエフォート・失敗してもアプリの操作をブロックしない） ───
// 参加登録・進行状況・景品交換のいずれも、結果を画面の動作に反映しない
// fire-and-forget で送る。読み取る必要が無いレスポンスのため mode:'no-cors' を使い、
// CORSのプリフライト(OPTIONS)も避ける（Apps Script はプリフライトに正しく応答できない）。
const QUEUE_KEY = 'stampRally.sheetSyncQueue.v1';

interface SyncPayload {
  event: 'register' | 'progress' | 'exchange';
  participantId: string;
  nickname?: string;
  gender?: string;
  age?: number;
  isStudent?: boolean;
  studentCategory?: string;
  progress?: string;
}

// 参加登録時にGoogleスプレッドシートへ送る内容は、この5項目だけ（他のイベントと
// 違い event / participantId は含めない）。列の並びは A=参加者番号 B=性別 C=年齢
// D=学生 E=学生の区分。
interface RegistrationSyncPayload {
  participantNumber: number;
  gender: string;
  age: number;
  student: string;
  studentCategory: string;
}

type QueuedPayload = SyncPayload | RegistrationSyncPayload;

function loadQueue(): QueuedPayload[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedPayload[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // localStorage が使えない環境では諦める（アプリ自体の動作はブロックしない）
  }
}

function sendBestEffort(payload: QueuedPayload) {
  // URLが未設定（スタンドアロン運用）なら、そもそも送信を試みない。
  if (!WEBHOOK_URL) return;
  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    // text/plain avoids a CORS preflight (OPTIONS), which Apps Script doesn't handle.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    // 送信失敗はアプリの動作をブロックしないが、記録は必ず残す。
    console.error('[sheetApi] sync failed, queued for retry', err);
    const queue = loadQueue();
    queue.push(payload);
    saveQueue(queue);
  });
}

/** 電波不良などで送れなかった内容を、オンライン復帰時などにまとめて再送する。 */
export function flushQueuedSync() {
  if (!WEBHOOK_URL) return;
  const queue = loadQueue();
  if (queue.length === 0) return;
  saveQueue([]);
  queue.forEach(sendBestEffort);
}

// 性別・学校区分は、参加者登録画面で実際に表示している日本語表記（ja.ts）を
// そのままGoogleスプレッドシートへ記録する（デバイスの表示言語に関わらず、
// 運営が見るシートは常に日本語表記に統一するため）。
const GENDER_LABELS_JA: Record<Registration['gender'], string> = ja.register.gender;
const STUDENT_CATEGORY_LABELS_JA: Record<NonNullable<Registration['studentCategory']>, string> =
  ja.register.studentCategory;

/**
 * 参加者登録時に1回だけ送る。参加者番号・性別・年齢・学生・学生の区分の5項目のみ。
 * URL未設定時は何もしない（登録自体はlocalStorageで完結する）。
 */
export function syncRegistrationToSheet(registration: Registration, participantNumber: number) {
  sendBestEffort({
    participantNumber,
    gender: GENDER_LABELS_JA[registration.gender],
    age: registration.age,
    student: registration.isStudent ? 'はい' : 'いいえ',
    studentCategory: registration.studentCategory
      ? STUDENT_CATEGORY_LABELS_JA[registration.studentCategory]
      : '',
  });
}

/** スタンプラリーの進行状態（例: "3/7", "こうかんずみ"）を送る。 */
export function syncProgress(participantId: string, progress: string) {
  sendBestEffort({ event: 'progress', participantId, progress });
}

/** 景品交換確定を送る。URL未設定時は何もしない（交換自体はlocalStorageで完結する）。 */
export function syncExchangeToSheet(participantId: string) {
  sendBestEffort({ event: 'exchange', participantId });
}
