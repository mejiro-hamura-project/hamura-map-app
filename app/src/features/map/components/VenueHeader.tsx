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
    // z-50：地図側の重なり要素（スタンプQRのトグル/案内、検索ボタン、ポップアップ）は
    // MapCanvas側で個別にz-indexを持っており、VenueHeaderと同じ重なりの土俵で比較される
    // （MapCanvasの外枠にはz-indexが無いため）。会場切替メニューが必ずそれらより前面に
    // 来るよう、他のどの数値よりも大きい値にしている。
    <div className="relative z-50 mx-3.5 mt-2.5">
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
