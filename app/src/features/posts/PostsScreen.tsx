import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePosts } from '../../api';
import { createPost } from '../../api/usePosts';
import { POST_TARGETS } from '../../shared/postTargets';
import { spotDisplayName } from '../../shared/utils/spotSearch';
import FeedItem from './components/FeedItem';
import PostFilterFab from './components/PostFilterFab';
import PostFilterSheet from './components/PostFilterSheet';
import PostCreateFab from './components/PostCreateFab';
import PostCreateSheet from './components/PostCreateSheet';
import { POSTS_ROUTE_STATE_KEY } from './routeState';

export default function PostsScreen() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // 投稿画面を開いたときに最初から選んでおく投稿先（地図の店の詳細の「口コミを書く」から来たとき）
  const [initialCreateSpotId, setInitialCreateSpotId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 地図の「口コミを書く」から来たら、その店を投稿先に選んだ状態で投稿画面を開く。
  // 開いたら location.state を消し、再読み込みや「戻る」で投稿画面が開き直さないようにする
  useEffect(() => {
    const spotId = (location.state as Record<string, unknown> | null)?.[POSTS_ROUTE_STATE_KEY];
    if (typeof spotId !== 'string' || !POST_TARGETS.some((spot) => spot.id === spotId)) return;
    setInitialCreateSpotId(spotId);
    setIsCreateOpen(true);
    navigate(location.pathname + location.search, { replace: true, state: null });
  }, [location.state, location.pathname, location.search, navigate]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<Set<string>>(new Set());
  const [selectedSpotIds, setSelectedSpotIds] = useState<Set<string>>(() => {
    const id = new URLSearchParams(location.search).get('spotId');
    return new Set(id && POST_TARGETS.some((spot) => spot.id === id) ? [id] : []);
  });
  const [submitted, setSubmitted] = useState('');
  const { posts, isLoading, error, acceptingPosts, nextCursor, refresh, loadMore } = usePosts(
    [...selectedSpotIds].sort().join(','), [...selectedGenreIds].sort().join(','),
  );

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('spotId');
    setSelectedSpotIds(new Set(id && POST_TARGETS.some((spot) => spot.id === id) ? [id] : []));
    setSelectedGenreIds(new Set());
  }, [location.search]);

  function handleToggleGenre(genreId: string) {
    setSelectedGenreIds((prev) => {
      const next = new Set(prev);
      if (next.has(genreId)) next.delete(genreId);
      else next.add(genreId);
      return next;
    });
  }

  function handleToggleSpot(spotId: string) {
    setSelectedSpotIds((prev) => {
      const next = new Set(prev);
      if (next.has(spotId)) next.delete(spotId);
      else next.add(spotId);
      return next;
    });
  }

  async function handleCreatePost(input: { spotId: string; caption: string }, key: string) {
    const post = await createPost(input, key);
    setSubmitted(`投稿しました：${post.caption}`);
    // 条件変更時はusePostsのeffectで新着を取得。それ以外は明示的に更新する。
    if (selectedGenreIds.size || selectedSpotIds.size) {
      setSelectedGenreIds(new Set());
      setSelectedSpotIds(new Set());
    } else {
      await refresh();
    }
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto pb-20">
        <button type="button" disabled={isLoading} onClick={() => { setSubmitted(''); void refresh(); }} className="m-3 text-sm text-brand-blue">更新</button>
        {!isLoading && !acceptingPosts && <p className="px-4 text-sm text-sub">現在、投稿受付を停止しています。投稿は保存できません。</p>}
        {submitted && <p role="status" className="px-4 text-sm text-brand-blue">{submitted}</p>}
        {error && <p role="alert" className="p-4 text-sm text-red-700">投稿を取得できませんでした。{error} 「更新」で再試行できます。</p>}
        {isLoading && <p className="p-6 text-center text-sm text-sub">読み込み中...</p>}
        {!isLoading && !error && posts.length === 0 && (
          <p className="p-6 text-center text-sm text-sub">{selectedGenreIds.size || selectedSpotIds.size ? '条件に一致する投稿はありません' : 'まだ投稿がありません'}</p>
        )}
        {posts.map((post) => (
          <FeedItem key={post.id} post={post} authorNickname="来場者"
            spotName={spotDisplayName(POST_TARGETS.find((spot) => spot.id === post.spotId)?.name ?? '')} />
        ))}
        {nextCursor && <button type="button" disabled={isLoading} onClick={() => void loadMore()} className="m-4 text-sm text-brand-blue">もっと読む</button>}
      </div>

      <PostFilterFab activeCount={selectedGenreIds.size + selectedSpotIds.size} onClick={() => setIsFilterOpen(true)} />
      {acceptingPosts && <PostCreateFab
        onClick={() => {
          setInitialCreateSpotId(null);
          setIsCreateOpen(true);
        }}
      />}

      {isFilterOpen && (
        <PostFilterSheet
          shops={POST_TARGETS}
          selectedGenreIds={selectedGenreIds}
          selectedSpotIds={selectedSpotIds}
          onClear={() => {
            setSelectedGenreIds(new Set());
            setSelectedSpotIds(new Set());
          }}
          onToggleGenre={handleToggleGenre}
          onToggleSpot={handleToggleSpot}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {isCreateOpen && (
        <PostCreateSheet
          shops={POST_TARGETS}
          initialSpotId={initialCreateSpotId}
          acceptingPosts={acceptingPosts}
          isLoading={isLoading}
          onSubmit={handleCreatePost}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
}
