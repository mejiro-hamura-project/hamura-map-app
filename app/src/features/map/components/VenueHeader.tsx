import { useState } from 'react';
import type { VenueMap } from '../../../shared/types';

type VenueHeaderProps = {
  maps: VenueMap[];
  currentMapId: string | null;
  onSelect: (mapId: string) => void;
};

/** 会場名バー。タップすると会場一覧が開く（会場切替の枠）。今は見本の会場が1件のみ */
export default function VenueHeader({ maps, currentMapId, onSelect }: VenueHeaderProps) {
  const [open, setOpen] = useState(false);
  const current = maps.find((m) => m.id === currentMapId);

  return (
    <div className="relative z-10 mx-3.5 mt-2.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-t-xl bg-brand-teal px-4 py-2.5 text-center text-[15px] font-extrabold tracking-wide text-white"
      >
        {current?.name ?? '会場を選択'} <span className="ml-1 opacity-85">▾</span>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-line bg-card shadow-lg">
          {maps.map((venueMap) => (
            <button
              key={venueMap.id}
              type="button"
              onClick={() => {
                onSelect(venueMap.id);
                setOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-sm font-bold ${
                venueMap.id === currentMapId ? 'text-brand-blue' : 'text-ink'
              }`}
            >
              {venueMap.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
