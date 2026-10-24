import type { Post } from '../../../shared/types';

type FeedItemProps = {
  post: Post;
  authorNickname: string;
  spotName: string;
};

export default function FeedItem({ post, authorNickname, spotName }: FeedItemProps) {
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
      </div>
    </div>
  );
}
