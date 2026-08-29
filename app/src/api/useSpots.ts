import { useEffect, useState } from 'react';
import type { Spot } from '../shared/types';
import { MOCK_SPOTS } from '../mocks';

const MOCK_DELAY_MS = 200;

/**
 * スポット一覧を取得するフック。
 * 今はモックデータを少し待ってから返しているだけ。
 * 本物のAPIに差し替えるときは、この中身を fetch() 呼び出しに変えれば、
 * 呼び出し側（画面）のコードは変更しなくてよい。
 */
export function useSpots() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (!cancelled) {
        setSpots(MOCK_SPOTS);
        setIsLoading(false);
      }
    }, MOCK_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { spots, isLoading };
}
