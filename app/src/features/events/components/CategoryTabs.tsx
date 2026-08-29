import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { Category } from '../../../shared/types';

type CategoryTabsProps = {
  categories: Category[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
};

// この距離（px）より動いたら「ドラッグでスクロール」とみなし、タブ選択のクリックを起こさない
const DRAG_THRESHOLD_PX = 6;

// 端をふわっと透けさせる表示（UIプロトタイプと同じマスク）
const FADE_MASK =
  'linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 30px), transparent 100%)';

export default function CategoryTabs({ categories, activeCategoryId, onSelect }: CategoryTabsProps) {
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
  }, [categories]);

  useEffect(() => {
    const button = buttonRefs.current.get(activeCategoryId);
    button?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeCategoryId]);

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

  function handleTabClick(categoryId: string) {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    onSelect(categoryId);
  }

  return (
    <div className="relative border-b border-line">
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onScroll={updateMoreHint}
        className="flex cursor-grab gap-4 overflow-x-auto px-6 pt-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }}
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          return (
            <button
              key={category.id}
              ref={(el) => {
                if (el) buttonRefs.current.set(category.id, el);
                else buttonRefs.current.delete(category.id);
              }}
              type="button"
              onClick={() => handleTabClick(category.id)}
              className={`shrink-0 whitespace-nowrap border-b-[3px] pb-2.5 pt-1.5 text-[13px] font-bold ${
                isActive ? 'text-ink' : 'border-transparent text-[#aeb4bc]'
              }`}
              style={isActive ? { borderBottomColor: category.color } : undefined}
            >
              {category.name}
            </button>
          );
        })}
      </div>
      {showMoreHint && (
        <span
          className="pointer-events-none absolute right-1.5 top-1 text-base text-[#c2c7cf]"
          style={{ animation: 'nudge 1.4s ease-in-out infinite' }}
        >
          ›
        </span>
      )}
    </div>
  );
}
