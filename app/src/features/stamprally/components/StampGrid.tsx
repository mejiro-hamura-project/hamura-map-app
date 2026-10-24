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
    // 7つの枠を横一列に並べ、画面幅に合わせて縮める（最大48px）。高さの低い横向きでは、
    // 地図の横に置くため4列で折り返す。
    <div className="grid grid-cols-7 justify-items-center gap-1 [@media(max-height:480px)]:grid-cols-4">
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
            className={`flex aspect-square w-full max-w-12 items-center justify-center rounded-full border-2 text-[1.125rem] font-bold [@media(max-height:480px)]:text-[1rem] ${
              collected
                ? 'border-sr-red bg-sr-red-soft text-stamprally-collected-strong'
                : 'border-sr-line bg-sr-muted text-sr-sub'
            }`}
          >
            {collected ? charById.get(checkpointId) : '?'}
          </div>
        );
      })}
    </div>
  );
}
