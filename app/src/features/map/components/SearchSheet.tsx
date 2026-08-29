import { TAGS } from '../../../shared/taxonomy';
import type { Spot } from '../../../shared/types';

type SearchSheetProps = {
  results: Spot[];
  activeTagId: string | null;
  query: string;
  onToggleTag: (tagId: string) => void;
  onQueryChange: (query: string) => void;
  onSelectSpot: (spotId: string) => void;
  onClose: () => void;
};

export default function SearchSheet({
  results,
  activeTagId,
  query,
  onToggleTag,
  onQueryChange,
  onSelectSpot,
  onClose,
}: SearchSheetProps) {
  const hasCondition = Boolean(activeTagId || query.trim());

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-bg">
      <div className="flex items-center gap-2.5 border-b border-line bg-card px-3.5 py-4">
        <button type="button" onClick={onClose} className="flex p-1 text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h2 className="text-base font-extrabold">検索</h2>
      </div>

      <div className="mt-4 px-4 text-xs font-extrabold tracking-wide text-sub">フィルター検索</div>
      <div className="mx-4 mt-2 flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => onToggleTag(tag.id)}
            className={`rounded-full border-[1.5px] px-4 py-1.5 text-xs font-bold ${
              activeTagId === tag.id ? 'border-brand-blue bg-brand-blue text-white' : 'border-brand-blue text-brand-blue'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className="mt-4 px-4 text-xs font-extrabold tracking-wide text-sub">店名・イベント名で検索</div>
      <div className="mx-4 mt-2 flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b7bcc4" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="前方一致で検索（例：や）"
          className="flex-1 border-0 text-sm outline-none"
        />
      </div>

      <div className="mt-2 flex-1 overflow-y-auto pb-4">
        {hasCondition && results.length === 0 && (
          <p className="mx-4 mt-3 text-xs text-[#aab0b8]">該当する候補はありません</p>
        )}
        {results.map((spot) => (
          <button
            key={spot.id}
            type="button"
            onClick={() => onSelectSpot(spot.id)}
            className="mx-4 mt-2 flex w-[calc(100%-2rem)] items-center gap-2.5 rounded-xl border border-line bg-card px-3.5 py-3 text-left text-[13px]"
          >
            <span className="text-brand-magenta">📍</span>
            {spot.name}
          </button>
        ))}
        {results.length > 0 && (
          <p className="mx-4 mt-2.5 text-[11px] text-[#aab0b8]">↑ 該当{results.length}件を地図上でハイライトします</p>
        )}
      </div>
    </div>
  );
}
