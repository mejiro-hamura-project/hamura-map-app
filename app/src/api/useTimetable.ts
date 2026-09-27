import { useEffect, useState } from 'react';
import type { DailyStageTimetable } from '../shared/types';
import { MOCK_TIMETABLE } from '../mocks/timetable';

const MOCK_DELAY_MS = 200;

/**
 * ステージのタイムテーブルを取得するフック（useSpots と同じ作り）。
 */
export function useTimetable() {
  const [timetable, setTimetable] = useState<DailyStageTimetable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (!cancelled) {
        setTimetable(MOCK_TIMETABLE);
        setIsLoading(false);
      }
    }, MOCK_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { timetable, isLoading };
}
