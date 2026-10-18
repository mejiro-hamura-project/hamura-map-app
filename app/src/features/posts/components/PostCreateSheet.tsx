import { useState } from 'react';
import type { Spot } from '../../../shared/types';
import { matchesSpotQuery } from '../../../shared/utils/spotSearch';
import { getRecentSpotIds } from '../../../shared/utils/recentSpots';
import SpotResultButton from '../../../shared/ui/SpotResultButton';

type PostCreateSheetProps = {
  shops: Spot[];
  /** 最初から選んでおく投稿先（地図の店の詳細の「口コミを書く」から開いたとき） */
  initialSpotId?: string | null;
  onSubmit: (input: { spotId: string; caption: string }) => void;
  onClose: () => void;
};

// 本文の上限。シート（Apps Script）側でも同じ長さで切り詰める。docs/posts/posts-sheet.md 参照
const MAX_CAPTION_LENGTH = 200;
// 投稿先の候補を出す最大件数（地図の検索と同じ）
const MAX_CANDIDATES = 10;

/**
 * 口コミの投稿画面。①投稿先を選ぶ → ②感想を書く の順。
 * 店名を検索しなくても選べるよう、入力前は「最近見た店・イベント」（地図で詳細を開いたもの）を並べる。
 * 名前を入力したら、その候補を出す（全店を並べると感想の入力欄が画面の下に押し出されるため）。
 * 選んだら候補を閉じて「投稿先：○○」の1行にまとめ、すぐ下の感想欄に進めるようにする。
 */
export default function PostCreateSheet({ shops, initialSpotId = null, onSubmit, onClose }: PostCreateSheetProps) {
  const [query, setQuery] = useState('');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(initialSpotId);
  // 開いたときの「最近見た」を使う（開いている間に並びが変わらないようにする）
  const [recentSpotIds] = useState(getRecentSpotIds);
  const [caption, setCaption] = useState('');

  const trimmedQuery = query.trim();
  const candidates = trimmedQuery
    ? shops.filter((shop) => matchesSpotQuery(shop, trimmedQuery)).slice(0, MAX_CANDIDATES)
    : [];
  const selectedShop = shops.find((shop) => shop.id === selectedSpotId) ?? null;
  const recentShops = recentSpotIds
    .map((id) => shops.find((shop) => shop.id === id))
    .filter((shop): shop is Spot => shop !== undefined);
  const canSubmit = Boolean(selectedShop) && caption.trim().length > 0;

  function handleSubmit() {
    if (!selectedSpotId || !canSubmit) return;
    onSubmit({ spotId: selectedSpotId, caption: caption.trim() });
    onClose();
  }

  function handleChangeTarget() {
    setSelectedSpotId(null);
    setQuery('');
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-bg">
      <div className="flex items-center gap-2.5 border-b border-line bg-card px-3.5 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          戻る
        </button>
        <h2 className="text-base font-extrabold">投稿する</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="mt-4 px-4 text-xs font-extrabold tracking-wide text-sub">① 投稿先</div>
        {selectedShop ? (
          <div className="mx-4 mt-2 flex items-center gap-2 rounded-xl border-[1.5px] border-brand-blue bg-brand-blue-soft px-3.5 py-2.5">
            <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-brand-blue">{selectedShop.name}</span>
            <button
              type="button"
              onClick={handleChangeTarget}
              className="shrink-0 rounded-full border border-brand-blue bg-card px-3 py-1 text-[11px] font-bold text-brand-blue"
            >
              変更
            </button>
          </div>
        ) : (
          <>
            <div className="mx-4 mt-2 flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b7bcc4" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="店名・イベント名を入力（例：や）"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
              />
            </div>
            {!trimmedQuery && recentShops.length > 0 && (
              <>
                <p className="mx-4 mt-3 text-[11px] font-bold text-sub">最近見た店・イベント</p>
                {recentShops.map((shop) => (
                  <SpotResultButton key={shop.id} spot={shop} onClick={() => setSelectedSpotId(shop.id)} />
                ))}
              </>
            )}
            {!trimmedQuery && recentShops.length === 0 && (
              <p className="mx-4 mt-2 text-[11px] text-[#aab0b8]">
                名前の最初の文字を入れると、候補が出ます。地図で店の詳細を開くと、ここに「最近見た店」として並びます
              </p>
            )}
            {trimmedQuery && candidates.length === 0 && (
              <p className="mx-4 mt-2 text-[11px] text-[#aab0b8]">該当する候補はありません</p>
            )}
            {candidates.map((shop) => (
              <SpotResultButton key={shop.id} spot={shop} onClick={() => setSelectedSpotId(shop.id)} />
            ))}
          </>
        )}

        <div className="mx-4 mb-1.5 mt-5 flex items-baseline justify-between text-xs font-extrabold tracking-wide text-sub">
          <span>② 感想</span>
          <span className="font-bold tabular-nums">
            {caption.length}／{MAX_CAPTION_LENGTH}
          </span>
        </div>
        <div className="mx-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={MAX_CAPTION_LENGTH}
            rows={4}
            placeholder="感想を書く…"
            className="w-full resize-none rounded-xl border border-line bg-card px-3 py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="mx-4 mb-4 rounded-full bg-brand-blue py-3.5 text-center text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {selectedShop ? '投稿する' : '投稿先を選んでください'}
      </button>
    </div>
  );
}
