import { useEffect, useState } from 'react';
import type { Post } from '../shared/types';
import { MOCK_POSTS } from '../mocks';

const MOCK_DELAY_MS = 200;

/**
 * 投稿一覧を取得するフック。
 * 今はモックデータを少し待ってから返しているだけ（useSpots と同じ作り）。
 */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (!cancelled) {
        setPosts(MOCK_POSTS);
        setIsLoading(false);
      }
    }, MOCK_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { posts, isLoading };
}
