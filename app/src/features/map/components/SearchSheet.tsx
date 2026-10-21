import GenreChipRow from '../../../shared/ui/GenreChipRow';
import SpotResultButton from '../../../shared/ui/SpotResultButton';
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

      <div className="mt-3 px-4 text-xs font-extrabold tracking-wide text-sub">ジャンルで絞り込み</div>
      <div className="mt-2">
        <GenreChipRow
          selectedIds={new Set(activeGenreId ? [activeGenreId] : [])}
          focusId={activeGenreId}
          onToggle={onToggleGenre}
        />
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col border-t border-line">
        {hasCondition && (
          <p className="px-4 pt-2.5 text-[11px] font-bold text-sub">
            {results.length > 0 ? `${results.length}件　タップすると、地図でその場所を光らせて表示します` : '該当する候補はありません'}
          </p>
        )}
        <div className="flex-1 overflow-y-auto pb-4">
          {results.map((spot) => (
            <SpotResultButton key={spot.id} spot={spot} onClick={() => onSelectSpot(spot.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
