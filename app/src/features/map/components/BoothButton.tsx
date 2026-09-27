import type { Booth } from '../../../shared/types';

type BoothButtonProps = {
  booth: Booth;
  onTap: () => void;
};

// ブース配置ツール（docs/ブース配置ツール.html）の見た目と完全に同じ配色・線・余白にしている
const STYLE_CLASSES: Record<Booth['style'], { pill: string; box: string; cell: string }> = {
  pr: {
    pill: 'bg-[rgba(126,183,228,.34)]',
    box: 'border-[#5b9bd5]',
    cell: 'text-[#2c6aa6]',
  },
  pink: {
    pill: 'bg-[rgba(233,150,184,.24)]',
    box: 'border-[#e07aa8]',
    cell: 'text-[#c94f8c]',
  },
  band: {
    pill: 'bg-[rgba(120,200,150,.24)]',
    box: 'border-[#4aa972]',
    cell: 'text-[#2f8f57]',
  },
};

const CELL_BORDER_COLOR: Record<Booth['style'], string> = {
  pr: '#bcd7ef',
  pink: '#f3cfe0',
  band: '#cdead9',
};

// 配置ツールは、地図が横幅720px前後で表示されるPC向けの画面（.phone{max-width:1100px}から
// サイドパネル380pxを引いた幅）を基準に、マスの大きさなどを固定pxで決めている。
// アプリはスマホ幅（地図の表示幅がもっと狭い）で見せるため、固定pxのままだと地図に対して
// 大きく見えすぎてしまう。そこで「地図の実際の表示幅に対する割合（cqw）」に変換し、
// 720px幅のときに元のpx値と同じ大きさになるよう計算する。
const REFERENCE_MAP_WIDTH_PX = 720;
function cqw(px: number): string {
  return `${(px / REFERENCE_MAP_WIDTH_PX) * 100}cqw`;
}

/**
 * 配置ツールで作ったブース1つぶんのボタン。位置・角度・向きはツールの書き出し値をそのまま反映する。
 * 大きさ（マスの幅・高さ・文字サイズ等）は、地図の表示幅に対する割合に直しているため、
 * 画面の大きさが変わっても配置ツールと同じ比率に見える。
 * ツールと同じく、枠だけでなく中の記号もまとめて回転させる（文字だけを正立させる処理はしない）。
 */
export default function BoothButton({ booth, onTap }: BoothButtonProps) {
  const styleClasses = STYLE_CLASSES[booth.style];
  const isVertical = booth.orient === 'v';
  const borderColor = CELL_BORDER_COLOR[booth.style];

  return (
    <button
      type="button"
      onClick={onTap}
      className="absolute z-[5]"
      style={{
        left: `${booth.x}%`,
        top: `${booth.y}%`,
        transform: `translate(-50%, -50%) rotate(${booth.angle}deg) scale(${booth.scale})`,
        transformOrigin: 'center',
      }}
    >
      <div
        className={`flex rounded-full ${styleClasses.pill}`}
        style={{ padding: `${cqw(5)} ${cqw(9)}` }}
      >
        <div
          className={`flex overflow-hidden bg-white shadow-[0_2px_4px_rgba(40,70,110,.18)] ${
            isVertical ? 'flex-col' : 'flex-row'
          } ${styleClasses.box}`}
          style={{ borderRadius: cqw(6), borderWidth: cqw(2), borderStyle: 'solid' }}
        >
          {booth.codes.map((code, index) => (
            <div
              key={`${code}-${index}`}
              className={`flex items-center justify-center font-extrabold ${styleClasses.cell}`}
              style={{
                height: cqw(21),
                minWidth: cqw(18),
                fontSize: cqw(10),
                padding: `0 ${cqw(4)}`,
                borderRight: !isVertical && index < booth.codes.length - 1 ? `${cqw(1.3)} solid ${borderColor}` : undefined,
                borderBottom: isVertical && index < booth.codes.length - 1 ? `${cqw(1.4)} solid ${borderColor}` : undefined,
              }}
            >
              {code}
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}
