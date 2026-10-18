import { useState } from 'react';
import type { Spot } from '../../../shared/types';
import { matchesSpotQuery } from '../../../shared/utils/spotSearch';
import GenreChipRow from '../../../shared/ui/GenreChipRow';
import SpotResultButton from '../../../shared/ui/SpotResultButton';

type PostFilterSheetProps = {
  shops: Spot[];
  selectedGenreIds: Set<string>;
  selectedSpotIds: Set<string>;
  onToggleGenre: (genreId: string) => void;
  onToggleSpot: (spotId: string) => void;
  onClear: () => void;
  onClose: () => void;
};

// 店名で探したときに出す候補の最大件数（地図の検索と同じ）
const MAX_CANDIDATES = 10;

/**
 * 口コミの絞り込み画面。地図の検索画面と同じく「名前の入力 → ジャンル（横スクロール1行）→ 候補」の順に並べる。
 * 店は名前を入力したときだけ候補を出し、選んだ店は上に「選択中」として並べる（全店を並べると長くなりすぎるため）。
 */
export default function PostFilterSheet({
  shops,
  selectedGenreIds,
  selectedSpotIds,
  onToggleGenre,
  onToggleSpot,
  onClear,
  onClose,
}: PostFilterSheetProps) {
  const [query, setQuery] = useState('');
  const [lastToggledGenreId, setLastToggledGenreId] = useState<string | null>(null);

  const trimmedQuery = query.trim();
  const candidates = trimmedQuery
    ? shops.filter((shop) => matchesSpotQuery(shop, trimmedQuery)).slice(0, MAX_CANDIDATES)
    : [];
  const selectedShops = shops.filter((shop) => selectedSpotIds.has(shop.id));
  // 候補のうち、まだ選んでいないもの（選んだものは上の「選択中」に出ている）
  const addableCandidates = candidates.filter((shop) => !selectedSpotIds.has(shop.id));
  const hasCondition = selectedGenreIds.size > 0 || selectedSpotIds.size > 0;

  function handleToggleGenre(genreId: string) {
    setLastToggledGenreId(genreId);
    onToggleGenre(genreId);
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-bg">
      <div className="flex items-center gap-2.5 border-b border-line bg-card px-3.5 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          戻る
        </button>
        <h2 className="flex-1 text-base font-extrabold">口コミを絞り込む</h2>
        {hasCondition && (
          <button type="button" onClick={onClear} className="text-xs font-bold text-brand-blue">
            条件をクリア
          </button>
        )}
      </div>

      <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b7bcc4" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="店名・イベント名（前方一致。例：や）"
          className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-3 px-4 text-xs font-extrabold tracking-wide text-sub">ジャンルで絞り込み</div>
      <div className="mt-2">
        <GenreChipRow selectedIds={selectedGenreIds} focusId={lastToggledGenreId} onToggle={handleToggleGenre} />
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col border-t border-line">
        <div className="flex-1 overflow-y-auto pb-4">
          {selectedShops.length > 0 && (
            <>
              <p className="px-4 pt-2.5 text-[11px] font-bold text-sub">選択中の店・イベント（タップで外す）</p>
              {selectedShops.map((shop) => (
                <SpotResultButton key={shop.id} spot={shop} selected trailing="✓" onClick={() => onToggleSpot(shop.id)} />
              ))}
            </>
          )}
          {trimmedQuery && candidates.length === 0 && (
            <p className="px-4 pt-2.5 text-[11px] font-bold text-sub">該当する候補はありません</p>
          )}
          {addableCandidates.length > 0 && (
            <p className="px-4 pt-2.5 text-[11px] font-bold text-sub">候補（タップで追加）</p>
          )}
          {addableCandidates.map((shop) => (
            <SpotResultButton key={shop.id} spot={shop} trailing="＋" onClick={() => onToggleSpot(shop.id)} />
          ))}
        </div>
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
