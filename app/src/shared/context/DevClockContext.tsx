import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type DevClockContextValue = {
  /** 「今」の時刻（端末の時計。30秒ごとに更新） */
  now: Date;
};

const DevClockContext = createContext<DevClockContextValue | null>(null);

const LIVE_INTERVAL_MS = 30_000;

/**
 * アプリ全体で共有する「今の時刻」。端末の時計をそのまま使う。
 * イベント一覧のタイムテーブルと地図の吹き出しが同じ時刻を参照することで、表示がズレないようにする。
 * （開発中に時刻を動かすスライダーは本番前に削除した。名前は既存の参照箇所に合わせて DevClock のまま）
 */
export function DevClockProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), LIVE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return <DevClockContext.Provider value={{ now }}>{children}</DevClockContext.Provider>;
}

export function useClock(): DevClockContextValue {
  const context = useContext(DevClockContext);
  if (!context) throw new Error('useClock は DevClockProvider の内側でのみ使用できます');
  return context;
}
