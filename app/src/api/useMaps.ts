import { useEffect, useState } from 'react';
import type { VenueMap } from '../shared/types';
import { MOCK_MAPS } from '../mocks';

const MOCK_DELAY_MS = 200;

/**
 * 会場地図一覧を取得するフック（useSpots と同じ作り）。
 */
export function useMaps() {
  const [maps, setMaps] = useState<VenueMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (!cancelled) {
        setMaps(MOCK_MAPS);
        setIsLoading(false);
      }
    }, MOCK_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { maps, isLoading };
}
