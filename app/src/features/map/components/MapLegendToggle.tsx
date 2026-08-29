type MapLegendToggleProps = {
  visible: boolean;
  onToggle: () => void;
};

export default function MapLegendToggle({ visible, onToggle }: MapLegendToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`absolute left-2.5 top-2.5 z-[15] flex items-center gap-1.5 rounded-full border border-line bg-white/95 py-1.5 pl-1.5 pr-2.5 text-[11px] font-extrabold shadow ${
        visible ? 'text-brand-purple' : 'text-[#aeb4bc]'
      }`}
    >
      <span
        className={`flex h-[18px] w-[18px] items-center justify-center rounded-md ${
          visible ? 'bg-brand-purple' : 'bg-[#c4c9d0]'
        }`}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3M17 20h4M20 17v4" strokeLinecap="round" />
        </svg>
      </span>
      スタンプQRの場所
    </button>
  );
}
