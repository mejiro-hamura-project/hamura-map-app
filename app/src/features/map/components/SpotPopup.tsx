import { findCategoryById, findTagById } from '../../../shared/taxonomy';
import type { Spot } from '../../../shared/types';

type SpotPopupProps = {
  spot: Spot;
  onClose: () => void;
};

export default function SpotPopup({ spot, onClose }: SpotPopupProps) {
  const category = findCategoryById(spot.categoryId);
  const tags = spot.tagIds.map((tagId) => findTagById(tagId)).filter((tag) => tag !== undefined);

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
      <p className="mb-3 text-xs leading-relaxed text-[#6b7178]">{spot.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full border-[1.5px] border-brand-blue px-3 py-1 text-[11px] font-bold text-brand-blue"
            >
              {tag.name}
            </span>
          ))
        ) : (
          <span className="text-xs text-[#aab0b8]">タグなし</span>
        )}
      </div>
    </div>
  );
}
