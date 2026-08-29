import { useEffect, useState } from 'react';
import type { User } from '../shared/types';
import { MOCK_USERS } from '../mocks';

const MOCK_DELAY_MS = 200;

/**
 * 利用者一覧を取得するフック（useSpots と同じ作り）。
 * 投稿の投稿者名（ニックネーム）表示に使う。
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (!cancelled) {
        setUsers(MOCK_USERS);
        setIsLoading(false);
      }
    }, MOCK_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { users, isLoading };
}
