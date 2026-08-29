import { useEffect, useState } from 'react';
import type { Event } from '../shared/types';
import { MOCK_EVENTS } from '../mocks';

const MOCK_DELAY_MS = 200;

/**
 * イベント一覧を取得するフック。
 * 今はモックデータを少し待ってから返しているだけ（useSpots と同じ作り）。
 */
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (!cancelled) {
        setEvents(MOCK_EVENTS);
        setIsLoading(false);
      }
    }, MOCK_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { events, isLoading };
}
