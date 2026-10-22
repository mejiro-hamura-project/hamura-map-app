import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** 文字の左に添える絵文字（buttonIcons.ts）。読み上げでは無視する。 */
  icon?: string;
  variant?: 'notice' | 'howto' | 'register' | 'cta' | 'camera' | 'exchange-link' | 'exchange-btn' | 'exchanged' | 'ghost';
}

// デザインA案：主操作は赤。QRコード読み取り（camera）も赤にし、青緑のQRコード設置場所ボタンと色で区別する。
// variant 名は既存のまま（呼び出し側・処理は変えない）。
const PRIMARY = 'bg-sr-red text-white shadow-[0_2px_0_rgba(170,52,60,0.22)]';
const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  notice: PRIMARY,
  howto: PRIMARY,
  register: PRIMARY,
  cta: PRIMARY,
  camera: 'bg-sr-red text-white shadow-[0_2px_0_rgba(170,52,60,0.22)] [text-shadow:0_1px_1px_rgba(0,0,0,0.22)]',
  'exchange-link': PRIMARY,
  'exchange-btn': PRIMARY,
  exchanged: 'bg-sr-green-strong text-white',
  ghost: 'border border-sr-line bg-white text-sr-ink font-medium!',
};

export default function Button({ children, variant = 'cta', className = '', icon, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`min-h-[44px] w-full rounded-full px-5 py-2.5 text-[1rem] leading-snug font-semibold tracking-wide text-balance transition active:translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:border disabled:border-sr-line disabled:bg-sr-muted disabled:text-sr-sub disabled:shadow-none ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {icon ? (
        <span className="inline-flex max-w-full items-center justify-center gap-1.5">
          <span className="text-[1.05em] leading-none" aria-hidden="true">
            {icon}
          </span>
          <span className="min-w-0 text-balance">{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
