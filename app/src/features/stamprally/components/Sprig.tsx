/**
 * 見出しの横に添える小さな花と葉の飾り（デザインA案）。文字に重ならないよう見出しの左右に置き、
 * 読み上げでは無視する。flip で左右反転（見出しの左右で向かい合わせにする）。
 */
export default function Sprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 36 16"
      className={`h-4 w-9 shrink-0 ${flip ? '-scale-x-100' : ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 12 C 10 13, 18 6, 30 8" fill="none" stroke="#6faf70" strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="12" cy="10" rx="4" ry="1.6" fill="#6faf70" opacity="0.8" transform="rotate(-20 12 10)" />
      <ellipse cx="22" cy="7.6" rx="3.6" ry="1.4" fill="#6faf70" opacity="0.7" transform="rotate(12 22 7.6)" />
      <circle cx="31" cy="7.5" r="3" fill="#e95f68" />
      <circle cx="31" cy="7.5" r="1.1" fill="#f4c64e" />
      <circle cx="4" cy="8" r="1.4" fill="#35b3b8" opacity="0.85" />
    </svg>
  );
}
