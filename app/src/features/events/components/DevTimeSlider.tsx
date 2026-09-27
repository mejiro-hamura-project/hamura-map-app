type DevTimeSliderProps = {
  minMinutes: number;
  maxMinutes: number;
  value: number;
  onChange: (minutes: number | null) => void;
};

function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

/**
 * 開発中だけ、時刻を仮に動かして「上演中」表示を試すためのスライダー。
 * import.meta.env.DEV が true のときだけ呼び出し側で表示され、本番ビルドには含まれない。
 */
export default function DevTimeSlider({ minMinutes, maxMinutes, value, onChange }: DevTimeSliderProps) {
  return (
    <div className="border-t border-line bg-[#f3f6fb] px-3.5 py-2">
      <div className="mb-1.5 text-[11px] font-extrabold text-[#4a6597]">
        ▼ 開発用：時刻を動かして「上演中」表示を確認できます（本番では表示されません）
      </div>
      <div className="flex items-center gap-2.5">
        <span className="min-w-[52px] text-[15px] font-extrabold text-[#2b3550]">{formatClock(value)}</span>
        <input
          type="range"
          min={minMinutes}
          max={maxMinutes}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-bold text-sub"
        >
          実時刻に戻す
        </button>
      </div>
    </div>
  );
}
