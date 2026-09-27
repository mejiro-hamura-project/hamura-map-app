import type { VenueHotspot } from '../../../shared/types';

type VenueHotspotAreaProps = {
  hotspot: VenueHotspot;
  label: string;
  onTap: () => void;
};

/**
 * 「全体」地図の上に置く、会場（第1〜第3）のタップ範囲。本番では見た目は透明。
 * 開発中だけ、範囲を確認しやすいようにうっすら枠を表示する。
 */
export default function VenueHotspotArea({ hotspot, label, onTap }: VenueHotspotAreaProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`${label}を拡大`}
      className={`absolute z-[4] ${
        import.meta.env.DEV ? 'border-2 border-dashed border-brand-blue/50 bg-brand-blue/10' : ''
      }`}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.width}%`,
        height: `${hotspot.height}%`,
      }}
    />
  );
}
