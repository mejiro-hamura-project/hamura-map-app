import type { AreaHotspot } from '../../../shared/types';

type AreaHotspotButtonProps = {
  area: AreaHotspot;
  onTap: () => void;
};

/**
 * 会場地図に印刷されたエリア名の上に置く、透明なタップ範囲。本番では見た目は透明。
 * 開発中だけ、範囲を確認しやすいようにうっすら枠を表示する（VenueHotspotArea と同じ方式）。
 * ブースのボタン（z-[5]）より下に置き、重なった所ではブースのタップを優先する。
 */
export default function AreaHotspotButton({ area, onTap }: AreaHotspotButtonProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`${area.name}の説明を見る`}
      className={`absolute z-[4] ${
        import.meta.env.DEV ? 'border-2 border-dashed border-[#2f8f57]/60 bg-[#2f8f57]/10' : ''
      }`}
      style={{
        left: `${area.x}%`,
        top: `${area.y}%`,
        width: `${area.width}%`,
        height: `${area.height}%`,
      }}
    />
  );
}
