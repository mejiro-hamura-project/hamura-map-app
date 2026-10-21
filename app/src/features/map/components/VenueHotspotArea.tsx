import type { VenueHotspot } from '../../../shared/types';

type VenueHotspotAreaProps = {
  hotspot: VenueHotspot;
  label: string;
  onTap: () => void;
};

/**
 * 「全体」地図の上に置く、会場（第1〜第4）のタップ範囲。見た目は開発中も含めて常に透明。
 */
export default function VenueHotspotArea({ hotspot, label, onTap }: VenueHotspotAreaProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`${label}を拡大`}
      className="absolute z-[4]"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.width}%`,
        height: `${hotspot.height}%`,
      }}
    />
  );
}
