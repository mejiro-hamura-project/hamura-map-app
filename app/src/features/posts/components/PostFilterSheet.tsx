import { TAGS } from '../../../shared/taxonomy';
import type { Spot } from '../../../shared/types';
import { spotDisplayName } from '../../../shared/utils/spotSearch';

type PostFilterSheetProps = {
  shops: Spot[];
  selectedTagIds: Set<string>;
  selectedSpotIds: Set<string>;
  onToggleTag: (tagId: string) => void;
  onToggleSpot: (spotId: string) => void;
  onClose: () => void;
};

export default function PostFilterSheet({
  shops,
  selectedTagIds,
  selectedSpotIds,
  onToggleTag,
  onToggleSpot,
  onClose,
}: PostFilterSheetProps) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-bg">
      <div className="flex items-center gap-2.5 border-b border-line bg-card px-3.5 py-4">
        <button type="button" onClick={onClose} className="flex p-1 text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h2 className="text-base font-extrabold">フィルター</h2>
      </div>

      <div className="mt-4 px-4 text-xs font-extrabold tracking-wide text-sub">ジャンルで絞り込み</div>
      <div className="mx-4 mt-2 flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => onToggleTag(tag.id)}
            className={`rounded-full border-[1.5px] px-4 py-1.5 text-xs font-bold ${
              selectedTagIds.has(tag.id) ? 'border-brand-blue bg-brand-blue text-white' : 'border-brand-blue text-brand-blue'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className="mt-4 px-4 text-xs font-extrabold tracking-wide text-sub">店名で絞り込み</div>
      <div className="mt-2 flex-1 overflow-y-auto">
        {shops.map((spot) => {
          const selected = selectedSpotIds.has(spot.id);
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => onToggleSpot(spot.id)}
              className={`mx-4 mt-2 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[13px] font-bold ${
                selected ? 'border-brand-blue bg-brand-blue-soft text-brand-blue' : 'border-line bg-card text-ink'
              }`}
            >
              {spotDisplayName(spot.name)}
              <span>{selected ? '✓' : '＋'}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mx-4 mb-4 mt-2 rounded-full bg-brand-blue py-3.5 text-center text-sm font-extrabold text-white"
      >
        この条件で表示
      </button>
    </div>
  );
}
