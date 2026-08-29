/**
 * localStorage を直接触らないための共通の窓口。
 * 保存したい値の形（型）を指定して使う。
 *
 * 例: storage.get<Registration>('festival.registration', null)
 */

function safeParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return safeParse(raw, fallback);
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};
