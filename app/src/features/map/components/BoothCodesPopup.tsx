import { findGenreById } from '../../../shared/taxonomy';
import { findStore } from '../../../mocks/stores';
import type { Booth, Store } from '../../../shared/types';

type BoothCodesPopupProps = {
  booth: Booth;
  stores: Store[];
  onSelectStore: (store: Store) => void;
  onClose: () => void;
};

/**
 * ブースをタップしたときに出す、そのブースの記号一覧。
 * 記号に対応する店データが見つかれば「記号＋ジャンルのアイコン＋店名」を表示し、
 * タップすると店の詳細ポップアップを開く。見つからない記号は「準備中」の表示のまま。
 */
export default function BoothCodesPopup({ booth, stores, onSelectStore, onClose }: BoothCodesPopupProps) {
  return (
    <div className="absolute left-1/2 top-11 z-30 w-[240px] -translate-x-1/2 rounded-2xl bg-card p-4 pb-[18px] shadow-xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f2f4] text-xs text-[#8a9098]"
      >
        ✕
      </button>
      <h3 className="mb-2 mt-2 text-sm font-extrabold">このブースのお店</h3>
      <div className="max-h-[220px] overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          {booth.codes.map((code) => {
            const store = findStore(stores, booth.style, code);
            const genre = store ? findGenreById(store.genreId) : undefined;

            if (!store) {
              return (
                <div
                  key={code}
                  className="flex items-center gap-2 rounded-xl border border-line px-2.5 py-1.5 text-xs text-[#aab0b8]"
                >
                  <span className="rounded-full border-[1.5px] border-line px-2 py-0.5 text-[11px] font-bold">
                    {code}
                  </span>
                  <span>（準備中）</span>
                </div>
              );
            }

            return (
              <button
                key={code}
                type="button"
                onClick={() => onSelectStore(store)}
                className="flex items-center gap-2 rounded-xl border border-brand-blue px-2.5 py-1.5 text-left"
              >
                <span className="rounded-full border-[1.5px] border-brand-blue px-2 py-0.5 text-[11px] font-bold text-brand-blue">
                  {code}
                </span>
                {genre && <img src={genre.iconUrl} alt="" className="h-4 w-4" />}
                <span className="text-xs font-bold">{store.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
