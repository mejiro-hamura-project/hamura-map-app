import { storage } from '../storage/storage';

export const ANONYMOUS_ID_KEY = 'app.anonymousId.v1';
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const transientIds = new WeakMap<object, string>();

/**
 * 口コミ・スタンプラリー共通の匿名UUID。旧テスト用IDの移行は行わない。
 * 保存が利用できない場合も同じページ内では再利用するが、再起動後の保持は保証できない。
 */
export function getAnonymousId(): string {
  const scope = typeof window === 'undefined' ? globalThis : window;
  try {
    const saved = storage.get<unknown>(ANONYMOUS_ID_KEY, null);
    if (typeof saved === 'string' && UUID_V4.test(saved)) {
      const id = saved.toLowerCase();
      transientIds.set(scope, id);
      return id;
    }
  } catch { /* localStorage制限時は同じページ内のIDを再利用する。 */ }
  const id = transientIds.get(scope) ?? createUuid();
  transientIds.set(scope, id);
  try { storage.set(ANONYMOUS_ID_KEY, id); } catch { /* 端末での利用を止めない。 */ }
  return id;
}

function createUuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // randomUUID未対応のSafariでも、暗号学的乱数でUUID v4を作る。
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
