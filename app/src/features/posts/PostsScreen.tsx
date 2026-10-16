import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../../api';
import { createPost } from '../../api/usePosts';
import { POST_TARGETS } from '../../shared/postTargets';
import { spotDisplayName } from '../../shared/utils/spotSearch';
import FeedItem from './components/FeedItem';
import PostFilterFab from './components/PostFilterFab';
import PostFilterSheet from './components/PostFilterSheet';
import PostCreateFab from './components/PostCreateFab';
import PostCreateSheet from './components/PostCreateSheet';

export default function PostsScreen() {
  const [params] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<Set<string>>(new Set());
  const [selectedSpotIds, setSelectedSpotIds] = useState<Set<string>>(() => {
    const id = params.get('spotId');
    return new Set(id && POST_TARGETS.some((spot) => spot.id === id) ? [id] : []);
  });
  const [submitted, setSubmitted] = useState('');
  const { posts, isLoading, error, acceptingPosts, nextCursor, refresh, loadMore } = usePosts(
    [...selectedSpotIds].sort().join(','), [...selectedGenreIds].sort().join(','),
  );

  function toggle(setter: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) {
    setter((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <button type="button" disabled={isLoading} onClick={() => { setSubmitted(''); void refresh(); }} className="m-3 text-sm text-brand-blue">更新</button>
        {!isLoading && !acceptingPosts && <p className="px-4 text-sm text-sub">現在、投稿受付を停止しています</p>}
        {submitted && <p role="status" className="px-4 text-sm text-brand-blue">{submitted}</p>}
        {error && <p role="alert" className="p-4 text-sm text-red-700">投稿を取得できませんでした。{error} 「更新」で再試行できます。</p>}
        {isLoading && <p className="p-6 text-center text-sm text-sub">読み込み中...</p>}
        {!isLoading && !error && posts.length === 0 && <p className="p-6 text-center text-sm text-sub">まだ投稿がありません</p>}
        {posts.map((post) => (
          <FeedItem key={post.id} post={post} authorNickname="来場者" spotName={spotDisplayName(POST_TARGETS.find((spot) => spot.id === post.spotId)?.name ?? '')} />
        ))}
        {nextCursor && <button type="button" disabled={isLoading} onClick={() => void loadMore()} className="m-4 text-sm text-brand-blue">もっと読む</button>}
      </div>
      <PostFilterFab activeCount={selectedGenreIds.size + selectedSpotIds.size} onClick={() => setIsFilterOpen(true)} />
      {acceptingPosts && <PostCreateFab onClick={() => setIsCreateOpen(true)} />}
      {isFilterOpen && <PostFilterSheet shops={POST_TARGETS} selectedGenreIds={selectedGenreIds} selectedSpotIds={selectedSpotIds}
        onToggleGenre={(id) => toggle(setSelectedGenreIds, id)} onToggleSpot={(id) => toggle(setSelectedSpotIds, id)} onClose={() => setIsFilterOpen(false)} />}
      {isCreateOpen && <PostCreateSheet shops={POST_TARGETS} onClose={() => setIsCreateOpen(false)} onSubmit={async (input, key) => {
        const post = await createPost(input, key);
        setSelectedGenreIds(new Set());
        setSelectedSpotIds(new Set());
        setSubmitted(`投稿しました：${post.caption}`);
        await refresh();
      }} />}
    </div>
  );
}
