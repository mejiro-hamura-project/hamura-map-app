import { useEffect, useState, type ChangeEvent } from 'react';
import type { Spot } from '../../../shared/types';
import { matchesSpotQuery, spotDisplayName } from '../../../shared/utils/spotSearch';

type PostCreateSheetProps = {
  shops: Spot[];
  onSubmit: (input: { spotId: string; caption: string; imageUrl: string | null }) => void;
  onClose: () => void;
};

export default function PostCreateSheet({ shops, onSubmit, onClose }: PostCreateSheetProps) {
  const [query, setQuery] = useState('');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 選んだ画像のプレビュー用URLは、使い終わったら解放してメモリに残さないようにする
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const filteredShops = query.trim() ? shops.filter((shop) => matchesSpotQuery(shop, query.trim())) : shops;
  const selectedShop = shops.find((shop) => shop.id === selectedSpotId) ?? null;
  const canSubmit = Boolean(selectedSpotId) && caption.trim().length > 0;

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit() {
    if (!selectedSpotId || !canSubmit) return;
    onSubmit({ spotId: selectedSpotId, caption: caption.trim(), imageUrl: previewUrl });
    onClose();
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-bg">
      <div className="flex items-center gap-2.5 border-b border-line bg-card px-3.5 py-4">
        <button type="button" onClick={onClose} className="flex p-1 text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h2 className="text-base font-extrabold">投稿する</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="mt-4 px-4 text-xs font-extrabold tracking-wide text-sub">店・イベントを選ぶ（前方一致）</div>
        <div className="mx-4 mt-2 flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b7bcc4" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="店名を入力（例：や）"
            className="flex-1 border-0 text-sm outline-none"
          />
        </div>

        <div className="mt-2">
          {filteredShops.map((shop) => {
            const selected = shop.id === selectedSpotId;
            return (
              <button
                key={shop.id}
                type="button"
                onClick={() => setSelectedSpotId(shop.id)}
                className={`mx-4 mt-2 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[13px] font-bold ${
                  selected ? 'border-brand-blue bg-brand-blue-soft text-brand-blue' : 'border-line bg-card text-ink'
                }`}
              >
                {spotDisplayName(shop.name)}
                <span>{selected ? '選択中' : '選ぶ'}</span>
              </button>
            );
          })}
          {filteredShops.length === 0 && <p className="mx-4 mt-3 text-xs text-[#aab0b8]">該当する候補はありません</p>}
        </div>

        <div className="mx-4 mb-1.5 mt-5 text-xs font-bold text-sub">キャプション</div>
        <div className="mx-4">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="感想を書く…"
            className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-sm outline-none"
          />
        </div>

        <label className="mx-4 mt-3 flex h-[150px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#d3d7dd] text-[#c2c7cf]">
          {previewUrl ? (
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.6" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="mt-2 text-xs">画像を選ぶ（任意）</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {selectedShop && <p className="mx-4 mt-3 text-xs text-sub">投稿先：{spotDisplayName(selectedShop.name)}</p>}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="mx-4 mb-4 rounded-full bg-brand-blue py-3.5 text-center text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        投稿する
      </button>
    </div>
  );
}
