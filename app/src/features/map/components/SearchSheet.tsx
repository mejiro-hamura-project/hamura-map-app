import { GENRES, findGenreById } from '../../../shared/taxonomy';
import type { Spot } from '../../../shared/types';

type SearchSheetProps = {
  results: Spot[];
  activeGenreId: string | null;
  query: string;
  onToggleGenre: (genreId: string) => void;
  onQueryChange: (query: string) => void;
  onSelectSpot: (spotId: string) => void;
  onClose: () => void;
};

/**
 * 地図の検索画面。上から「店名・イベント名の入力 → ジャンル（横スクロール1行）→ 結果」の順に並べ、
 * 結果の一覧にできるだけ広い場所を使う（ジャンルを全部折り返して並べると、結果が画面下に押し出されるため）。
 */
export default function SearchSheet({
  results,
  activeGenreId,
  query,
  onToggleGenre,
  onQueryChange,
  onSelectSpot,
  onClose,
}: SearchSheetProps) {
  const hasCondition = Boolean(activeGenreId || query.trim());

  return (
    // z-[60]：会場名の帯（VenueHeader、z-50）より前に出す。下に隠れると「地図に戻る」が押せなくなるため
    <div className="absolute inset-0 z-[60] flex flex-col bg-bg">
      <div className="flex items-center gap-2.5 border-b border-line bg-card px-3.5 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          地図に戻る
        </button>
        <h2 className="text-base font-extrabold">検索</h2>
      </div>

      <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b7bcc4" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="店名・イベント名（前方一致。例：や）"
          className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-3 px-4 text-xs font-extrabold tracking-wide text-sub">ジャンルで絞り込み（横にスクロールできます）</div>
      <div className="relative mt-2">
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => onToggleGenre(genre.id)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-3 py-1.5 text-xs font-bold ${
                activeGenreId === genre.id ? 'border-brand-blue bg-brand-blue text-white' : 'border-brand-blue bg-card text-brand-blue'
              }`}
            >
              <img src={genre.iconUrl} alt="" className="h-4 w-4" />
              {genre.name}
            </button>
          ))}
        </div>
        {/* 右端をぼかして、続きがあることを示す */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg to-transparent" />
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col border-t border-line">
        {hasCondition && (
          <p className="px-4 pt-2.5 text-[11px] font-bold text-sub">
            {results.length > 0 ? `${results.length}件　タップすると、地図でその場所を光らせて表示します` : '該当する候補はありません'}
          </p>
        )}
        <div className="flex-1 overflow-y-auto pb-4">
          {results.map((spot) => {
            const genre = findGenreById(spot.genreId);
            const subLabel = [spot.venueId != null ? `第${spot.venueId}会場` : null, genre?.name].filter(Boolean).join('・');
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => onSelectSpot(spot.id)}
                className="mx-4 mt-2 flex w-[calc(100%-2rem)] items-center gap-2.5 rounded-xl border border-line bg-card px-3.5 py-2.5 text-left"
              >
                {genre ? (
                  <img src={genre.iconUrl} alt="" className="h-6 w-6 shrink-0" />
                ) : (
                  <span className="w-6 shrink-0 text-center text-brand-magenta">📍</span>
                )}
                <span className="flex min-w-0 flex-col">
                  <span className="text-[13px] font-bold">{spot.name}</span>
                  {subLabel && <span className="text-[10.5px] text-sub">{subLabel}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
