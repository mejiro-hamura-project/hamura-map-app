import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { findCategoryById, findGenreById, findTagById } from '../../../shared/taxonomy';
import type { Post, Spot } from '../../../shared/types';
import { rememberRecentSpot } from '../../../shared/utils/recentSpots';
import { POSTS_ROUTE_STATE_KEY } from '../../posts/routeState';
import SpotPostList from './SpotPostList';

type SpotPopupProps = {
  spot: Spot;
  posts: Post[];
  onClose: () => void;
};

export default function SpotPopup({ spot, posts, onClose }: SpotPopupProps) {
  const category = findCategoryById(spot.categoryId);
  const genre = findGenreById(spot.genreId);
  const tags = spot.tagIds.map((tagId) => findTagById(tagId)).filter((tag) => tag !== undefined);
  const navigate = useNavigate();

  // 詳細を開いた店・イベントを「最近見た」に記録し、口コミの投稿画面で検索せずに選べるようにする
  useEffect(() => {
    rememberRecentSpot(spot.id);
  }, [spot.id]);

  // 投稿タブを開き、このスポットを投稿先に選んだ状態で投稿画面を出す
  function handleWriteReview() {
    navigate('/posts', { state: { [POSTS_ROUTE_STATE_KEY]: spot.id } });
  }

  return (
    <div className="absolute left-1/2 top-11 z-30 w-[250px] -translate-x-1/2 rounded-2xl bg-card p-4 pb-[18px] shadow-xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f2f4] text-xs text-[#8a9098]"
      >
        ✕
      </button>
      {category && (
        <span
          className="inline-block rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
          style={{ background: category.color }}
        >
          {category.name}
        </span>
      )}
      <h3 className="mb-1.5 mt-2 text-base font-extrabold">{spot.name}</h3>
      {genre && (
        <div className="mb-2 flex items-center gap-1.5">
          <img src={genre.iconUrl} alt="" className="h-5 w-5" />
          <span className="text-xs font-bold text-[#6b7178]">{genre.name}</span>
        </div>
      )}
      {spot.description && (
        <p className="mb-3 text-xs leading-relaxed text-[#6b7178]">{spot.description}</p>
      )}
      {/* タグが1つも無いスポット（ブースの店など）は、タグの行ごと出さない */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full border-[1.5px] border-brand-blue px-3 py-1 text-[11px] font-bold text-brand-blue"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      <SpotPostList spotId={spot.id} posts={posts} />
      <button
        type="button"
        onClick={handleWriteReview}
        className="mt-3 w-full rounded-full bg-brand-blue py-2 text-center text-xs font-extrabold text-white"
      >
        ✎ ここの口コミを書く
      </button>
    </div>
  );
}
