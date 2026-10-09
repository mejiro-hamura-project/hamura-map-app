import { resolveAuthorNickname } from '../../../shared/utils/postAuthor';
import type { Post } from '../../../shared/types';

type SpotPostListProps = {
  spotId: string;
  posts: Post[];
};

/**
 * 店の詳細ポップアップに出す、その店の口コミ一覧。
 * 投稿者名は投稿タブ（PostsScreen）と同じ共通ロジック（resolveAuthorNickname）で決める。
 */
export default function SpotPostList({ spotId, posts }: SpotPostListProps) {
  const spotPosts = posts.filter((post) => post.spotId === spotId);

  return (
    <div className="mt-3 border-t border-line pt-3">
      <h4 className="mb-2 text-xs font-extrabold text-sub">口コミ</h4>
      {spotPosts.length === 0 ? (
        <p className="text-xs text-[#aab0b8]">まだ投稿はありません</p>
      ) : (
        <div className="flex max-h-[160px] flex-col gap-2.5 overflow-y-auto">
          {spotPosts.map((post) => (
            <div key={post.id} className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold">{resolveAuthorNickname(post)}</span>
                <span className="flex items-center gap-0.5 text-[#aab0b8]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.8 4.6a5 5 0 0 0-7 0L12 6.3l-1.8-1.7a5 5 0 1 0-7 7L12 21l8.8-9.4a5 5 0 0 0 0-7z" />
                  </svg>
                  {post.likeCount}
                </span>
              </div>
              <p className="mt-0.5 leading-relaxed text-[#4a5057]">{post.caption}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
