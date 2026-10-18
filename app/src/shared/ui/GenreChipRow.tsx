import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { GENRES } from '../taxonomy';

type GenreChipRowProps = {
  /** 選択中のジャンル（地図の検索は1つ、口コミの絞り込みは複数） */
  selectedIds: ReadonlySet<string>;
  /** 横スクロールの中央に寄せるジャンル（直前に選んだもの）。無ければ動かさない */
  focusId?: string | null;
  onToggle: (genreId: string) => void;
};

// この距離（px）より動いたら「ドラッグでスクロール」とみなし、ジャンル選択のクリックを起こさない（イベント一覧のタブと同じ）
const DRAG_THRESHOLD_PX = 6;

// 両端をふわっと透けさせ、続きがあることを示す（イベント一覧のタブと同じマスク）
const FADE_MASK = 'linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 30px), transparent 100%)';

/**
 * ジャンル（共通マスタ）を折り返さず横スクロール1行に並べた選択欄。地図の検索・口コミの絞り込みで共通に使う。
 * 選んだジャンルを中央に寄せて前後のジャンルも見えるようにする（イベント一覧のカテゴリタブと同じ動き）。
 */
export default function GenreChipRow({ selectedIds, focusId, onToggle }: GenreChipRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const dragStart = useRef<{ pointerX: number; scrollLeft: number } | null>(null);
  const wasDraggedRef = useRef(false);
  const [showMoreHint, setShowMoreHint] = useState(false);

  function updateMoreHint() {
    const el = scrollRef.current;
    if (!el) return;
    setShowMoreHint(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateMoreHint();
  }, []);

  // scrollIntoView は画面全体まで動かすことがあるため、横スクロールの位置だけを計算して動かす
  useEffect(() => {
    const el = scrollRef.current;
    const button = focusId ? buttonRefs.current.get(focusId) : undefined;
    if (!el || !button) return;
    el.scrollTo({ left: button.offsetLeft - (el.clientWidth - button.offsetWidth) / 2, behavior: 'smooth' });
  }, [focusId]);

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragStart.current = { pointerX: e.clientX, scrollLeft: scrollRef.current?.scrollLeft ?? 0 };
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragStart.current || !scrollRef.current) return;
    const dx = e.clientX - dragStart.current.pointerX;
    if (Math.abs(dx) > DRAG_THRESHOLD_PX) {
      wasDraggedRef.current = true;
      scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
    }
  }

  function handlePointerUp() {
    dragStart.current = null;
  }

  function handleClick(genreId: string) {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    onToggle(genreId);
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onScroll={updateMoreHint}
        className="flex cursor-grab gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }}
      >
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            ref={(el) => {
              if (el) buttonRefs.current.set(genre.id, el);
              else buttonRefs.current.delete(genre.id);
            }}
            type="button"
            onClick={() => handleClick(genre.id)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-3 py-1.5 text-xs font-bold ${
              selectedIds.has(genre.id) ? 'border-brand-blue bg-brand-blue text-white' : 'border-brand-blue bg-card text-brand-blue'
            }`}
          >
            <img src={genre.iconUrl} alt="" className="h-4 w-4" />
            {genre.name}
          </button>
        ))}
      </div>
      {showMoreHint && (
        <span
          className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-base text-[#c2c7cf]"
          style={{ animation: 'nudge 1.4s ease-in-out infinite' }}
        >
          ›
        </span>
      )}
    </div>
  );
}
