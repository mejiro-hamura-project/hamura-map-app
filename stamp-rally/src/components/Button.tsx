import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'notice' | 'howto' | 'register' | 'cta' | 'camera' | 'exchange-link' | 'exchange-btn' | 'exchanged' | 'ghost';
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  notice: 'bg-notice text-white',
  howto: 'bg-howto text-white',
  register: 'bg-register text-[#5a4a1f]',
  cta: 'bg-cta text-white',
  camera: 'bg-camera text-white',
  'exchange-link': 'bg-exchange-link text-white',
  'exchange-btn': 'bg-exchange-btn text-[#20264a]',
  exchanged: 'bg-exchanged text-white',
  ghost: 'bg-[#eee] text-[#444]',
};

export default function Button({ children, variant = 'cta', className = '', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`min-h-[44px] w-full rounded-full px-6 py-3 text-base font-bold shadow-sm transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
