import type { Spot, SpotArea } from '../../../shared/types';

type AreaHotspotButtonProps = {
  spot: Spot;
  area: SpotArea;
  /** 検索で選ばれたエリア。透明な範囲を、このときだけ光らせて見せる */
  highlighted?: boolean;
  onTap: () => void;
};

/**
 * 会場地図に印刷されたエリア名の上に置く、エリア（範囲を持つスポット）の透明なタップ範囲。見た目は開発中も含めて常に透明。
 * 地図に名前が印刷されていない枠（area.label あり）だけは、枠の中に名前を表示する。
 * 文字の大きさはブースのボタンと同じく、地図の表示幅に対する割合（cqw）で決める。
 * ブースのボタン（z-[5]）より下に置き、重なった所ではブースのタップを優先する。
 */
export default function AreaHotspotButton({ spot, area, highlighted = false, onTap }: AreaHotspotButtonProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`${spot.name}の説明を見る`}
      className={`absolute flex items-center justify-center rounded-md p-0 ${
        highlighted ? 'spot-glow z-[6] bg-[#ffd84d]/25' : 'z-[4]'
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
