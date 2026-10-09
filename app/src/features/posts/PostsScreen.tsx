import { useEffect, useMemo, useState } from 'react';
import { usePosts, useSpots, useUsers } from '../../api';
import type { Post } from '../../shared/types';
import { useNickname } from '../../shared/hooks/useNickname';
import { spotDisplayName } from '../../shared/utils/spotSearch';
import FeedItem from './components/FeedItem';
import PostFilterFab from './components/PostFilterFab';
import PostFilterSheet from './components/PostFilterSheet';
import PostCreateFab from './components/PostCreateFab';
import PostCreateSheet from './components/PostCreateSheet';
import NicknameEditor from './components/NicknameEditor';

// ログイン機能がまだ無いため、自分の投稿は固定のこのユーザーとして扱う（mocks/users.ts参照）
const CURRENT_USER_ID = 'user-you';

export default function PostsScreen() {
  const { posts: fetchedPosts, isLoading } = usePosts();
  const { spots } = useSpots();
  const { users } = useUsers();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<Set<string>>(new Set());
  const [selectedSpotIds, setSelectedSpotIds] = useState<Set<string>>(new Set());
  const [nickname, setNickname] = useNickname();

  useEffect(() => {
    setPosts(fetchedPosts);
  }, [fetchedPosts]);

  const shopSpots = useMemo(() => spots.filter((spot) => spot.categoryId !== 'stamp-qr'), [spots]);

  const visiblePosts = useMemo(() => {
    if (selectedGenreIds.size === 0 && selectedSpotIds.size === 0) return posts;
    return posts.filter((post) => {
      const spot = spots.find((s) => s.id === post.spotId);
      // 投稿自体はジャンルを持たないため、投稿先の店（スポット）のジャンルをたどって判定する
      const matchesGenre =
        selectedGenreIds.size === 0 || (spot?.genreId ? selectedGenreIds.has(spot.genreId) : false);
      const matchesSpot = selectedSpotIds.size === 0 || selectedSpotIds.has(post.spotId);
      return matchesGenre && matchesSpot;
    });
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
      <div className="border-b border-line bg-card px-4 py-2.5">
        <NicknameEditor nickname={nickname} onChange={setNickname} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="p-6 text-center text-sm text-sub">読み込み中...</p>
        ) : visiblePosts.length === 0 ? (
          <p className="p-6 text-center text-sm text-sub">
            {posts.length === 0 ? 'まだ投稿がありません' : '条件に一致する投稿はありません'}
          </p>
        ) : (
          visiblePosts.map((post) => {
            const spot = spots.find((s) => s.id === post.spotId);
            // 自分（user-you）の投稿だけは、保存済みのニックネーム（無ければ「匿名」）で表示する
            const authorNickname =
              post.userId === CURRENT_USER_ID
                ? nickname || '匿名'
                : (users.find((u) => u.id === post.userId)?.nickname ?? '名無しさん');
            return (
              <FeedItem
                key={post.id}
                post={post}
                authorNickname={authorNickname}
                spotName={spot ? spotDisplayName(spot.name) : ''}
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
        <PostCreateSheet
          shops={shopSpots}
          nickname={nickname}
          onChangeNickname={setNickname}
          onSubmit={handleCreatePost}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
}
