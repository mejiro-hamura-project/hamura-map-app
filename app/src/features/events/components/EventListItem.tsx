import type { Spot } from '../../../shared/types';

type EventListItemProps = {
  index: number;
  spot: Spot;
};

export default function EventListItem({ index, spot }: EventListItemProps) {
  return (
    <div className="flex gap-3 border-b border-line px-4 py-4">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-sub">{index}</div>
        <div className="mb-1 mt-0.5 text-[15px] font-extrabold">{spot.name}</div>
        {spot.schedule && <div className="mb-1 text-xs font-bold text-brand-magenta">{spot.schedule}</div>}
        <div className="text-xs leading-relaxed text-[#6b7178]">{spot.description}</div>
      </div>
      <div className="flex h-[72px] w-24 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#edeff2] text-[#c2c7cf]">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.6" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    </div>
  );
}
