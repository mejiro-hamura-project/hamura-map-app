import { isCheckpointCollected } from '../../../shared/integrations/stampRally';
import type { Spot } from '../../../shared/types';

type QrPopupProps = {
  spot: Spot;
  onClose: () => void;
};

/**
 * スタンプQR地点のポップアップ。
 * 「カメラで読み取る」は見た目だけ用意し、実際の起動はしない。
 * スタンプラリー本体との接続はM3で行う（docs/integration-notes.md参照）。
 */
export default function QrPopup({ spot, onClose }: QrPopupProps) {
  const checkpointId = spot.stampCheckpointId ?? null;
  const done = checkpointId != null && isCheckpointCollected(checkpointId);

  return (
    <div className="absolute left-1/2 top-11 z-30 w-[250px] -translate-x-1/2 rounded-2xl bg-card p-4 pb-[18px] shadow-xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f2f4] text-xs text-[#8a9098]"
      >
        ✕
      </button>
      <span className="inline-block rounded-full bg-brand-purple px-2.5 py-1 text-[11px] font-bold text-white">
        スタンプQR
      </span>
      <h3 className="mb-1.5 mt-2 text-base font-extrabold">QRポイント {checkpointId} / 7</h3>
      <p className="mb-3 text-xs leading-relaxed text-[#6b7178]">
        {done ? '読み取り済みです。' : 'まだ読み取っていません。ここでQRコードを探して読み取ろう。'}
      </p>
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-full bg-brand-purple/50 py-3 text-sm font-extrabold text-white"
      >
        カメラで読み取る
      </button>
      <p className="mt-2 text-center text-[11px] text-[#aab0b8]">※スタンプラリーとの連携はM3で実装予定です</p>
    </div>
  );
}
