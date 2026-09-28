import { useMapProvider } from '../../../shared/map';
import { isCheckpointCollected, useStampRallyReadPort } from '../../../shared/integrations/stampRally';
import type { Spot } from '../../../shared/types';

type QrMarkerProps = {
  spot: Spot;
  onTap: () => void;
};

export default function QrMarker({ spot, onTap }: QrMarkerProps) {
  const mapProvider = useMapProvider();
  const port = useStampRallyReadPort();
  const position = mapProvider.getPosition(spot);
  const done = spot.stampCheckpointId != null && isCheckpointCollected(spot.stampCheckpointId, port);

  return (
    <button
      type="button"
      aria-label={`スタンプQR ${spot.stampCheckpointId}${done ? '（取得済み）' : ''}`}
      onClick={onTap}
      className="absolute z-[7] -translate-x-1/2 -translate-y-1/2"
      style={{ left: position.left, top: position.top }}
    >
      <span
        className={`relative flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border-2 border-white shadow-md ${
          done ? 'bg-brand-orange' : 'bg-brand-purple'
        }`}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3M17 20h4M20 17v4" strokeLinecap="round" />
        </svg>
        <span
          className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-extrabold shadow ${
            done ? 'text-[#c6791a]' : 'text-[#5b4fae]'
          }`}
        >
          {done ? '✓' : spot.stampCheckpointId}
        </span>
      </span>
    </button>
  );
}
