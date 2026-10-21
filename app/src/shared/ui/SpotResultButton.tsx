import type { ReactNode } from 'react';
import { findGenreById } from '../taxonomy';
import type { Spot } from '../types';

type SpotResultButtonProps = {
  spot: Spot;
  onClick: () => void;
  /** 選択中の見た目にする（口コミの投稿先・絞り込みの店選び） */
  selected?: boolean;
  /** 右端に出す印（✓ など） */
  trailing?: ReactNode;
};

/**
 * 検索結果の1行（ジャンルのアイコン＋名前＋「日時・第○会場・ジャンル」）。
 * 地図の検索・口コミの投稿先選び・口コミの絞り込みで、同じ見た目の結果を出すための共通部品。
 */
export default function SpotResultButton({ spot, onClick, selected = false, trailing }: SpotResultButtonProps) {
  const genre = findGenreById(spot.genreId);
  const subLabel = [spot.schedule, spot.venueId != null ? `第${spot.venueId}会場` : null, genre?.name]
    .filter(Boolean)
    .join('・');
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mx-4 mt-2 flex w-[calc(100%-2rem)] items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left ${
        selected ? 'border-brand-blue bg-brand-blue-soft' : 'border-line bg-card'
      }`}
    >
      {genre ? (
        <img src={genre.iconUrl} alt="" className="h-6 w-6 shrink-0" />
      ) : (
        <span className="w-6 shrink-0 text-center text-brand-magenta">📍</span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`text-[13px] font-bold ${selected ? 'text-brand-blue' : ''}`}>{spot.name}</span>
        {subLabel && <span className="text-[10.5px] text-sub">{subLabel}</span>}
      </span>
      {trailing && <span className="shrink-0 text-sm font-bold text-brand-blue">{trailing}</span>}
    </button>
  );
}
