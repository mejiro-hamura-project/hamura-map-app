import { findGenreById } from '../../../shared/taxonomy';
import type { Spot } from '../../../shared/types';

type EventListItemProps = {
  index: number;
  spot: Spot;
};

export default function EventListItem({ index, spot }: EventListItemProps) {
  const genre = findGenreById(spot.genreId);

  return (
    <div className="flex gap-3 border-b border-line px-4 py-4">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-sub">{index}</div>
        <div className="mb-1 mt-0.5 text-[15px] font-extrabold">{spot.name}</div>
        {spot.schedule && <div className="mb-1 text-xs font-bold text-brand-magenta">{spot.schedule}</div>}
        <div className="text-xs leading-relaxed text-[#6b7178]">{spot.description}</div>
      </div>
      {genre && (
        <div className="flex w-24 flex-shrink-0 flex-col items-center justify-center gap-1">
          <img src={genre.iconUrl} alt={genre.name} className="h-8 w-8" />
          <span className="text-center text-[10px] font-bold text-sub">{genre.name}</span>
        </div>
      )}
    </div>
  );
}
