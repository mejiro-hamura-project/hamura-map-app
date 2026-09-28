import type { MutableRefObject } from 'react';
import type { Checkpoint } from '../types';

interface StampGridProps {
  /** 取得した順番に並んだチェックポイントID（useStampRally.collectedIds）。 */
  collectedIds: number[];
  checkpoints: Checkpoint[];
  /** 枠の総数（常にTOTAL_STAMPS）。未取得分も含めて常にこの数だけ枠を表示する。 */
  totalSlots: number;
  /** このインデックスの枠だけは、飛行アニメーション中は「?」のまま隠しておく。 */
  hiddenSlotIndex?: number | null;
  /** 各枠のDOM要素を、飛行アニメーションの着地先座標を測るために親へ公開する。 */
  slotRefs?: MutableRefObject<(HTMLDivElement | null)[]>;
}

export default function StampGrid({
  collectedIds,
  checkpoints,
  totalSlots,
  hiddenSlotIndex = null,
  slotRefs,
}: StampGridProps) {
  const charById = new Map(checkpoints.map((c) => [c.id, c.char]));

  return (
    <div className="grid grid-cols-3 justify-items-center gap-4">
      {Array.from({ length: totalSlots }, (_, index) => {
        // 枠は獲得した順番（左→右）に埋まる。特定のチェックポイントに紐づく
        // 固定位置ではない。
        const checkpointId = collectedIds[index];
        const collected = checkpointId !== undefined && index !== hiddenSlotIndex;
        return (
          <div
            key={index}
            ref={(el) => {
              if (slotRefs) slotRefs.current[index] = el;
            }}
            data-stamp-slot-index={index}
            className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-bold ${
              collected
                ? 'border-stamprally-collected bg-[#fff3e0] text-stamprally-collected'
                : 'border-[#ddd] bg-[#f3f3f3] text-[#ccc]'
            }`}
          >
            {collected ? charById.get(checkpointId) : '?'}
          </div>
        );
      })}
    </div>
  );
}
