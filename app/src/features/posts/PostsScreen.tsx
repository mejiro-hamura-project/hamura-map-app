import { useEffect, useMemo, useState } from 'react';
import { usePosts, useSpots } from '../../api';
import type { Post } from '../../shared/types';
import { CURRENT_USER_ID } from '../../shared/constants';
import { findStoreBySpotId } from '../../mocks/stores';
import { resolveAuthorNickname } from '../../shared/utils/postAuthor';
import { spotDisplayName } from '../../shared/utils/spotSearch';
import FeedItem from './components/FeedItem';
import PostFilterFab from './components/PostFilterFab';
import PostFilterSheet from './components/PostFilterSheet';
import PostCreateFab from './components/PostCreateFab';
import PostCreateSheet from './components/PostCreateSheet';

export default function PostsScreen() {
  const { posts: fetchedPosts, isLoading } = usePosts();
  const { spots } = useSpots();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<Set<string>>(new Set());
  const [selectedSpotIds, setSelectedSpotIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setPosts(fetchedPosts);
  }, [fetchedPosts]);

  const shopSpots = useMemo(() => spots.filter((spot) => spot.categoryId !== 'stamp-qr'), [spots]);

  // 投稿先は本物のSpotデータとは限らない（ブースの店は疑似スポット）。
  // 本物のSpotで見つからなければ、ブースの店データからも名前・ジャンルを探す。
  function resolvePostTarget(spotId: string): { name: string; genreId: string | undefined } {
    const spot = spots.find((s) => s.id === spotId);
    if (spot) return { name: spotDisplayName(spot.name), genreId: spot.genreId };
    const store = findStoreBySpotId(spotId);
    if (store) return { name: store.name, genreId: store.genreId };
    return { name: '', genreId: undefined };
  }

  const visiblePosts = useMemo(() => {
    if (selectedGenreIds.size === 0 && selectedSpotIds.size === 0) return posts;
    return posts.filter((post) => {
      const { genreId } = resolvePostTarget(post.spotId);
      // 投稿自体はジャンルを持たないため、投稿先の店（スポット）のジャンルをたどって判定する
      const matchesGenre = selectedGenreIds.size === 0 || (genreId ? selectedGenreIds.has(genreId) : false);
      const matchesSpot = selectedSpotIds.size === 0 || selectedSpotIds.has(post.spotId);
      return matchesGenre && matchesSpot;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, spots, selectedGenreIds, selectedSpotIds]);

  function handleToggleLike(postId: string) {
    const willLike = !likedPostIds.has(postId);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likeCount: post.likeCount + (willLike ? 1 : -1) } : post,
      ),
    );
    setLikedPostIds((prev) => {
      const next = new Set(prev);
      if (willLike) next.add(postId);
      else next.delete(postId);
      return next;
    });
  }

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

  function handleCreatePost(input: { spotId: string; caption: string }) {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: CURRENT_USER_ID,
      spotId: input.spotId,
      caption: input.caption,
      images: [],
      likeCount: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="p-6 text-center text-sm text-sub">読み込み中...</p>
        ) : visiblePosts.length === 0 ? (
          <p className="p-6 text-center text-sm text-sub">
            {posts.length === 0 ? 'まだ投稿がありません' : '条件に一致する投稿はありません'}
          </p>
        ) : (
          visiblePosts.map((post) => {
            const { name: spotName } = resolvePostTarget(post.spotId);
            return (
              <FeedItem
                key={post.id}
                post={post}
                authorNickname={resolveAuthorNickname(post)}
                spotName={spotName}
                liked={likedPostIds.has(post.id)}
                onToggleLike={() => handleToggleLike(post.id)}
              />
            );
          })
        )}
      </div>

      <PostFilterFab activeCount={selectedGenreIds.size + selectedSpotIds.size} onClick={() => setIsFilterOpen(true)} />
      <PostCreateFab onClick={() => setIsCreateOpen(true)} />

      {isFilterOpen && (
        <PostFilterSheet
          shops={shopSpots}
          selectedGenreIds={selectedGenreIds}
          selectedSpotIds={selectedSpotIds}
          onToggleGenre={handleToggleGenre}
          onToggleSpot={handleToggleSpot}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {isCreateOpen && (
        <PostCreateSheet shops={shopSpots} onSubmit={handleCreatePost} onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
}
