/**
 * コンテンツ領域の四隅の「外側」に添える、細い線の花・葉・つるの装飾（デザインA案）。
 * PageContainer がコンテンツ領域のすぐ外（上下の余白）に置くため、本文・ボタン・地図などとは
 * 重ならず、コンテンツ領域の大きさや中の配置も変わらない。読み上げでは無視する。
 * position で四隅の向きを決める（左上の形を基準に左右・上下を反転する）。
 */
type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const PLACEMENT: Record<Corner, string> = {
  'top-left': 'bottom-full left-0 mb-0.5 -translate-x-2',
  'top-right': 'bottom-full right-0 mb-0.5 translate-x-2 -scale-x-100',
  'bottom-left': 'top-full left-0 mt-0.5 -translate-x-2 -scale-y-100',
  'bottom-right': 'top-full right-0 mt-0.5 translate-x-2 -scale-x-100 -scale-y-100',
};

export default function CornerSprig({ position }: { position: Corner }) {
  return (
    <svg
      viewBox="0 0 84 28"
      // 高さは外側の余白（画面の高さの5％）に収まる大きさ（最大26px）
      className={`pointer-events-none absolute h-[min(26px,calc(5dvh-4px))] w-auto ${PLACEMENT[position]}`}
      style={{ aspectRatio: '3 / 1' }}
      aria-hidden="true"
      focusable="false"
    >
      {/* つる */}
      <path d="M3 25 C 10 16, 20 12, 34 13 S 60 10, 81 4" fill="none" stroke="#6faf70" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M22 13 C 23 8, 26 6, 29 5" fill="none" stroke="#6faf70" strokeWidth="0.9" strokeLinecap="round" />
      {/* 葉（細い線） */}
      <path d="M14 18 C 12 12, 17 9, 20 10 C 20 14, 18 17, 14 18 Z" fill="none" stroke="#6faf70" strokeWidth="0.9" />
      <path d="M44 12 C 46 7, 52 6, 54 8 C 52 11, 48 13, 44 12 Z" fill="none" stroke="#6faf70" strokeWidth="0.9" />
      <path d="M64 8 C 63 4, 67 1.5, 70 2.5 C 69 5.5, 67 7.5, 64 8 Z" fill="none" stroke="#6faf70" strokeWidth="0.9" />
      {/* 小さなチューリップ（赤） */}
      <path d="M27 6 L 28.5 1.8 L 30 4.5 L 31.5 1.8 L 33 6 C 32.5 8.6, 27.5 8.6, 27 6 Z" fill="none" stroke="#e95f68" strokeWidth="1" strokeLinejoin="round" />
      {/* 小花（黄・赤）と点（青緑） */}
      <circle cx="38" cy="18" r="2.2" fill="none" stroke="#f4c64e" strokeWidth="1" />
      <circle cx="38" cy="18" r="0.7" fill="#f4c64e" />
      <circle cx="58" cy="15" r="1.8" fill="none" stroke="#e95f68" strokeWidth="0.9" />
      <circle cx="8" cy="15" r="1.1" fill="#35b3b8" />
      <circle cx="76" cy="10" r="1" fill="#35b3b8" />
      <circle cx="50" cy="19" r="0.9" fill="#f4c64e" />
    </svg>
  );
}
