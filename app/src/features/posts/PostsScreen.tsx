import { useEffect, useMemo, useState } from 'react';
import { usePosts, useSpots, useUsers } from '../../api';
import type { Post } from '../../shared/types';
import { spotDisplayName } from '../../shared/utils/spotSearch';
import FeedItem from './components/FeedItem';
import PostFilterFab from './components/PostFilterFab';
import PostFilterSheet from './components/PostFilterSheet';
import PostCreateFab from './components/PostCreateFab';
import PostCreateSheet from './components/PostCreateSheet';

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
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [selectedSpotIds, setSelectedSpotIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setPosts(fetchedPosts);
  }, [fetchedPosts]);

  const shopSpots = useMemo(() => spots.filter((spot) => spot.categoryId !== 'stamp-qr'), [spots]);

  const visiblePosts = useMemo(() => {
    if (selectedTagIds.size === 0 && selectedSpotIds.size === 0) return posts;
    return posts.filter((post) => {
      const spot = spots.find((s) => s.id === post.spotId);
      const matchesTag = selectedTagIds.size === 0 || (spot ? spot.tagIds.some((tagId) => selectedTagIds.has(tagId)) : false);
      const matchesSpot = selectedSpotIds.size === 0 || selectedSpotIds.has(post.spotId);
      return matchesTag && matchesSpot;
    });
  }, [posts, spots, selectedTagIds, selectedSpotIds]);

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

  function handleToggleTag(tagId: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
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

  function handleCreatePost(input: { spotId: string; caption: string; imageUrl: string | null }) {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: CURRENT_USER_ID,
      spotId: input.spotId,
      caption: input.caption,
      images: input.imageUrl ? [input.imageUrl] : [],
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
            const spot = spots.find((s) => s.id === post.spotId);
            const user = users.find((u) => u.id === post.userId);
            return (
              <FeedItem
                key={post.id}
                post={post}
                authorNickname={user?.nickname ?? '名無しさん'}
                spotName={spot ? spotDisplayName(spot.name) : ''}
                liked={likedPostIds.has(post.id)}
                onToggleLike={() => handleToggleLike(post.id)}
              />
            );
          })
        )}
      </div>

      <PostFilterFab activeCount={selectedTagIds.size + selectedSpotIds.size} onClick={() => setIsFilterOpen(true)} />
      <PostCreateFab onClick={() => setIsCreateOpen(true)} />

      {isFilterOpen && (
        <PostFilterSheet
          shops={shopSpots}
          selectedTagIds={selectedTagIds}
          selectedSpotIds={selectedSpotIds}
          onToggleTag={handleToggleTag}
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
