import type { Post } from '../../../shared/types';

type FeedItemProps = {
  post: Post;
  authorNickname: string;
  spotName: string;
  liked: boolean;
  onToggleLike: () => void;
};

export default function FeedItem({ post, authorNickname, spotName, liked, onToggleLike }: FeedItemProps) {
  return (
    <div className="flex gap-3 border-b border-line px-4 py-4">
      <div className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-extrabold text-white">
        {authorNickname.slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-extrabold">{authorNickname}</span>
          {spotName && (
            <span className="rounded-[10px] bg-brand-blue-soft px-2 py-0.5 text-[11px] font-bold text-brand-blue">
              {spotName}
            </span>
          )}
        </div>
        <p className="my-1.5 text-[13px] leading-relaxed text-[#4a5057]">{post.caption}</p>
        {post.images.length > 0 && (
          <img src={post.images[0]} alt="" className="mb-2 h-[150px] w-full rounded-xl object-cover" />
        )}
        <button
          type="button"
          onClick={onToggleLike}
          className={`flex items-center gap-1.5 text-xs font-bold ${liked ? 'text-brand-magenta' : 'text-sub'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5 5 0 0 0-7 0L12 6.3l-1.8-1.7a5 5 0 1 0-7 7L12 21l8.8-9.4a5 5 0 0 0 0-7z" />
          </svg>
          {post.likeCount}
        </button>
      </div>
    </div>
  );
}
