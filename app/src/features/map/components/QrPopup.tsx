import { useNavigate } from 'react-router-dom';
import { isCheckpointCollected, useStampRallyReadPort } from '../../../shared/integrations/stampRally';
import { STAMP_RALLY_ROUTES } from '../../stamprally/routes';
import type { Spot } from '../../../shared/types';

type QrPopupProps = {
  spot: Spot;
  onClose: () => void;
};

/**
 * スタンプQR地点のポップアップ。
 * read契約で取得状況を読み、統合Router内の既存カメラへ接続する。
 */
export default function QrPopup({ spot, onClose }: QrPopupProps) {
  const navigate = useNavigate();
  const port = useStampRallyReadPort();
  const checkpointId = spot.stampCheckpointId ?? null;
  const done = checkpointId != null && isCheckpointCollected(checkpointId, port);

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
        onClick={() => navigate(port.isRegistered() ? STAMP_RALLY_ROUTES.camera : STAMP_RALLY_ROUTES.entry)}
        className="w-full rounded-full bg-brand-purple py-3 text-sm font-extrabold text-white"
      >
        カメラで読み取る
      </button>
    </div>
  );
}
