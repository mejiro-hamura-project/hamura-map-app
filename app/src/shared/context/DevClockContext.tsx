import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type DevClockContextValue = {
  /** 「今」の時刻。開発用スライダーで仮の時刻に切り替えていればそちらを返す */
  now: Date;
  /** 開発用の仮の時刻（分単位、0時からの経過分）。未使用時はnull */
  devOverrideMinutes: number | null;
  setDevOverrideMinutes: (minutes: number | null) => void;
};

const DevClockContext = createContext<DevClockContextValue | null>(null);

const LIVE_INTERVAL_MS = 30_000;

/**
 * アプリ全体で共有する「今の時刻」。
 * 本番では端末の時計をそのまま使うが、開発中はスライダーで仮の時刻に切り替えられるようにする。
 * イベント一覧のタイムテーブルと地図の吹き出しが同じ時刻を参照することで、表示がズレないようにする。
 */
export function DevClockProvider({ children }: { children: ReactNode }) {
  const [liveNow, setLiveNow] = useState(() => new Date());
  const [devOverrideMinutes, setDevOverrideMinutes] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setLiveNow(new Date()), LIVE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const now = useMemo(() => {
    if (devOverrideMinutes == null) return liveNow;
    const overridden = new Date(liveNow);
    overridden.setHours(Math.floor(devOverrideMinutes / 60), devOverrideMinutes % 60, 0, 0);
    return overridden;
  }, [liveNow, devOverrideMinutes]);

  const value = useMemo(
    () => ({ now, devOverrideMinutes, setDevOverrideMinutes }),
    [now, devOverrideMinutes],
  );

  return <DevClockContext.Provider value={value}>{children}</DevClockContext.Provider>;
}

export function useClock(): DevClockContextValue {
  const context = useContext(DevClockContext);
  if (!context) throw new Error('useClock は DevClockProvider の内側でのみ使用できます');
  return context;
}
