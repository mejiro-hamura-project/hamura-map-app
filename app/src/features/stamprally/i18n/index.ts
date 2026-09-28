import { ja, type Messages } from './locales/ja';

export type { Messages };

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// 翻訳リソースは「ja のキー構造」を部分的に埋める。欠けたキーは ja へマージ時にフォールバック。
export type PartialMessages = DeepPartial<Messages>;

// 最終フォールバック言語（英語ではなく日本語）。翻訳リソースが 1 つも一致しなければこれ。
export const FALLBACK_LOCALE = 'ja';

// ───────────────────────────────────────────────────────────────
// 翻訳リソースの自動検出
//   src/i18n/locales/*.ts を Vite の import.meta.glob で走査し、
//   ファイル名（拡張子なし）をロケールキーとして登録する。
//   → 言語を増やすときは locales/ にファイルを 1 つ置くだけ。
//     このファイル（言語判定ロジック）を編集する必要はない。
//   → 対応言語は「コード上の固定配列」ではなく「存在するファイル」で決まる。
// ───────────────────────────────────────────────────────────────
const localeModules = import.meta.glob<PartialMessages>('./locales/*.ts', {
  eager: true,
  import: 'default',
});

// 実キー（ファイル名そのまま。例: "ja" / "en" / "zh-Hant"）
const REGISTRY: Record<string, PartialMessages> = {};
// 小文字キー → 実キー（大文字小文字を無視した照合用）
const KEY_BY_LOWER: Record<string, string> = {};

for (const [path, messages] of Object.entries(localeModules)) {
  const key = path.slice(path.lastIndexOf('/') + 1).replace(/\.ts$/, '');
  REGISTRY[key] = messages;
  KEY_BY_LOWER[key.toLowerCase()] = key;
}

// 実際に翻訳リソースが存在するロケール一覧（デバッグ・テスト用）。
export const SUPPORTED_LOCALES = Object.keys(REGISTRY);

// ───────────────────────────────────────────────────────────────
// 言語タグの解釈（BCP 47 / Intl.Locale）
// ───────────────────────────────────────────────────────────────
interface TagParts {
  language: string;
  script?: string;
  region?: string;
}

// Intl.Locale が使える環境ではそれで正規化。使えない/不正タグなら簡易パースへ。
function parseTag(tag: string): TagParts | null {
  const trimmed = tag.trim();
  if (!trimmed) return null;
  try {
    const loc = new Intl.Locale(trimmed);
    if (loc.language) {
      return {
        language: loc.language.toLowerCase(),
        script: loc.script ? loc.script.toLowerCase() : undefined,
        region: loc.region ? loc.region.toLowerCase() : undefined,
      };
    }
  } catch {
    // 不正な言語タグ → 下の簡易パースへ
  }
  const parts = trimmed.toLowerCase().split(/[-_]/).filter(Boolean);
  if (parts.length === 0) return null;
  return {
    language: parts[0],
    script: parts.slice(1).find((p) => p.length === 4),
    region: parts.slice(1).find((p) => p.length === 2 || /^\d{3}$/.test(p)),
  };
}

// 中国語の簡体字 / 繁体字を、文字体系または地域から推定する。
const ZH_HANT_REGIONS = new Set(['tw', 'hk', 'mo']);
function inferChineseKey(script?: string, region?: string): string {
  if (script === 'hant') return 'zh-hant';
  if (script === 'hans') return 'zh-hans';
  if (region && ZH_HANT_REGIONS.has(region)) return 'zh-hant';
  return 'zh-hans';
}

// 1 タグ → 照合候補キー（すべて小文字）を「具体的 → 汎用的」の順に。
//   "fr-CA"        → ["fr-ca", "fr"]
//   "zh-Hant-HK"   → ["zh-hant-hk", "zh-hant", "zh-hk", "zh"]
//   "en_US"        → ["en-us", "en"]
// 未知タグでも例外を投げず、単に「候補がヒットしない」だけになる。
function localeKeyCandidates(tag: string): string[] {
  const p = parseTag(tag);
  if (!p) return [];
  const { language: lang, script, region } = p;

  const keys: string[] = [];
  const add = (k?: string) => {
    if (k && !keys.includes(k)) keys.push(k);
  };

  add([lang, script, region].filter(Boolean).join('-'));
  if (script) add(`${lang}-${script}`);
  if (lang === 'zh') add(inferChineseKey(script, region));
  if (region) add(`${lang}-${region}`);
  add(lang);

  return keys;
}

// ───────────────────────────────────────────────────────────────
// 言語決定
// ───────────────────────────────────────────────────────────────

// navigator.languages / navigator.language の優先順位を尊重しつつ、
// 各タグを「完全一致 → 文字体系 → 基本言語」の順で存在する翻訳リソースへ動的解決する。
// どのタグにもリソースが無ければ FALLBACK_LOCALE（日本語）。
export function resolveLocale(candidates: readonly string[]): string {
  for (const tag of candidates) {
    if (!tag) continue;
    for (const key of localeKeyCandidates(tag)) {
      const real = KEY_BY_LOWER[key];
      if (real) return real;
    }
  }
  return FALLBACK_LOCALE;
}

// デバイス / ブラウザ / OS の設定言語を優先度順で取得。
// navigator.languages を主に、末尾へ navigator.language も加える（重複除去）。
export function getBrowserLocales(): string[] {
  if (typeof navigator === 'undefined') return [];
  const raw: string[] = [];
  if (Array.isArray(navigator.languages)) raw.push(...navigator.languages);
  if (navigator.language) raw.push(navigator.language);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of raw) {
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      out.push(tag);
    }
  }
  return out;
}

// ───────────────────────────────────────────────────────────────
// メッセージ取得
// ───────────────────────────────────────────────────────────────
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : (override as T);
  }
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    result[key] = deepMerge((base as Record<string, unknown>)[key], override[key]);
  }
  return result as T;
}

// 指定ロケールのメッセージを、必ず「ja を土台にマージした完全な形」で返す。
// これにより翻訳漏れがあっても undefined / 空文字にならず、その箇所だけ日本語になる。
export function getMessages(locale: string): Messages {
  const override = REGISTRY[locale] ?? REGISTRY[KEY_BY_LOWER[locale.toLowerCase()] ?? ''];
  if (!override || override === ja) return ja;
  return deepMerge(ja, override);
}

// ─── 開発時のみ: 各翻訳リソースが ja と同じキーを持ち、空文字が無いか自動検査 ───
if (import.meta.env.DEV) {
  const problems: string[] = [];
  const check = (base: unknown, val: unknown, loc: string, path: string) => {
    if (typeof base === 'string') {
      if (typeof val !== 'string') problems.push(`${loc}: 欠落 ${path}`);
      else if (val.trim() === '') problems.push(`${loc}: 空文字 ${path}`);
      return;
    }
    if (Array.isArray(base)) {
      base.forEach((b, i) => check(b, (val as unknown[] | undefined)?.[i], loc, `${path}[${i}]`));
      return;
    }
    if (isPlainObject(base)) {
      for (const k of Object.keys(base)) {
        check(base[k], isPlainObject(val) ? val[k] : undefined, loc, path ? `${path}.${k}` : k);
      }
    }
  };
  for (const [loc, messages] of Object.entries(REGISTRY)) {
    if (messages === ja) continue;
    check(ja, messages, loc, '');
  }
  if (problems.length > 0) {
    console.warn(`[i18n] 翻訳リソースの不足が ${problems.length} 件あります（該当箇所は ja で表示されます）:\n` + problems.join('\n'));
  }
}
