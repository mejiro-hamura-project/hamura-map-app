import type { AreaHotspot } from '../../../shared/types';

type AreaPopupProps = {
  area: AreaHotspot;
  onClose: () => void;
};

/** エリア（特殊区画）をタップしたときに出す説明。見た目はブース・店のポップアップに合わせる。 */
export default function AreaPopup({ area, onClose }: AreaPopupProps) {
  return (
    <div className="absolute left-1/2 top-11 z-30 w-[250px] -translate-x-1/2 rounded-2xl bg-card p-4 pb-[18px] shadow-xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f2f4] text-xs text-[#8a9098]"
      >
        ✕
      </button>
      <h3 className="mb-1.5 mt-2 text-base font-extrabold">{area.name}</h3>
      <p className="text-xs leading-relaxed text-[#4a5058]">{area.description ?? '詳しい内容は準備中です。'}</p>
      {area.notes && area.notes.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {area.notes.map((note) => (
            <li key={note} className="rounded-lg bg-[#f1f7f3] px-2.5 py-1.5 text-[11px] font-bold text-[#2f8f57]">
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
