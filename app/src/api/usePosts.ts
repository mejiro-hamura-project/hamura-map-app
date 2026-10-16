import { useCallback, useEffect, useRef, useState } from 'react';
import type { Post } from '../shared/types';

export async function createPost(input: { spotId: string; caption: string }, key: string): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify(input),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? '投稿できませんでした。時間をおいて再試行してください。');
  return data.post;
}

export function usePosts(spotIds = '', genreIds = '') {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [acceptingPosts, setAcceptingPosts] = useState(false);
  const generation = useRef(0);
  const busy = useRef(false);
  const active = useRef<AbortController | null>(null);

  const load = useCallback(async (cursor?: string) => {
    if (cursor && busy.current) return;
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    const current = ++generation.current;
    busy.current = true;
    setIsLoading(true);
    setError('');
    if (!cursor) { setPosts([]); setNextCursor(null); setAcceptingPosts(false); }
    try {
      const query = new URLSearchParams({ limit: '30' });
      if (spotIds) query.set('spotIds', spotIds);
      if (genreIds) query.set('genreIds', genreIds);
      if (cursor) query.set('cursor', cursor);
      const response = await fetch(`/api/posts?${query}`, { cache: 'no-store', signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? '取得に失敗しました');
      if (current !== generation.current) return;
      setPosts((previous) => cursor ? [...previous, ...data.posts].filter((post, index, all) => all.findIndex((p) => p.id === post.id) === index) : data.posts);
      setNextCursor(data.nextCursor);
      setAcceptingPosts(data.acceptingPosts);
    } catch (cause) {
      if (current === generation.current && !controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : '取得に失敗しました');
      }
    } finally {
      if (current === generation.current) { busy.current = false; setIsLoading(false); }
    }
  }, [spotIds, genreIds]);

  const cancel = useCallback(() => {
    ++generation.current;
    active.current?.abort();
  }, []);

  useEffect(() => {
    void load();
    return cancel;
  }, [load, cancel]);

  return { posts, isLoading, error, acceptingPosts, nextCursor, refresh: () => load(), loadMore: () => nextCursor ? load(nextCursor) : Promise.resolve() };
}
