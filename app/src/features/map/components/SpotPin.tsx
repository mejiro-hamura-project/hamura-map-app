import { useMapProvider } from '../../../shared/map';
import { findCategoryById } from '../../../shared/taxonomy';
import type { Spot } from '../../../shared/types';

type SpotPinProps = {
  spot: Spot;
  highlighted?: boolean;
  onTap: () => void;
};

/** "11：焼きそば横丁" → "11" のように、ピンに表示する短いラベルを取り出す */
function pinLabel(name: string): string {
  const match = name.match(/^([0-9A-Za-z]+)：/);
  return match ? match[1] : name.slice(0, 1);
}

export default function SpotPin({ spot, highlighted, onTap }: SpotPinProps) {
  const mapProvider = useMapProvider();
  const category = findCategoryById(spot.categoryId);
  const position = mapProvider.getPosition(spot);

  return (
    <button
      type="button"
      onClick={onTap}
      className="absolute z-[5] flex -translate-x-1/2 -translate-y-full flex-col items-center"
      style={{ left: position.left, top: position.top }}
    >
      <span
        className={`flex h-[26px] w-[26px] -rotate-45 items-center justify-center rounded-[50%_50%_50%_0] border-2 border-white shadow-md ${
          highlighted ? 'ring-4 ring-brand-blue ring-offset-2' : ''
        }`}
        style={{ background: category?.color ?? '#8b929c' }}
      >
        <span className="rotate-45 text-[10px] font-extrabold text-white">{pinLabel(spot.name)}</span>
      </span>
    </button>
  );
}
