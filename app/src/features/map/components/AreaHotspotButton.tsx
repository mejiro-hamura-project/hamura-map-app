import type { Spot, SpotArea } from '../../../shared/types';

type AreaHotspotButtonProps = {
  spot: Spot;
  area: SpotArea;
  onTap: () => void;
};

/**
 * 会場地図に印刷されたエリア名の上に置く、エリア（範囲を持つスポット）の透明なタップ範囲。本番では見た目は透明。
 * 開発中だけ、範囲を確認しやすいようにうっすら枠を表示する。
 * 地図に名前が印刷されていない枠（area.label あり）だけは、枠の中に名前を表示する。
 * 文字の大きさはブースのボタンと同じく、地図の表示幅に対する割合（cqw）で決める。
 * ブースのボタン（z-[5]）より下に置き、重なった所ではブースのタップを優先する。
 */
export default function AreaHotspotButton({ spot, area, onTap }: AreaHotspotButtonProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`${spot.name}の説明を見る`}
      className={`absolute z-[4] flex items-center justify-center p-0 ${
        import.meta.env.DEV ? 'border-2 border-dashed border-[#2f8f57]/60 bg-[#2f8f57]/10' : ''
      }`}
      style={{
        left: `${area.x}%`,
        top: `${area.y}%`,
        width: `${area.width}%`,
        height: `${area.height}%`,
      }}
    >
      {area.label && (
        <span
          className="whitespace-pre text-center font-extrabold text-[#2f8f57]"
          style={{ fontSize: '1.1cqw', lineHeight: 1.2 }}
        >
          {area.label}
        </span>
      )}
    </button>
  );
}
