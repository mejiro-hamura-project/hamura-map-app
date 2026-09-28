import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}

export default function PageContainer({ children, dark = false, className = '' }: PageContainerProps) {
  return (
    <div className={`flex h-full min-h-0 flex-1 justify-center ${dark ? 'bg-black' : 'bg-[#f7f3ec]'}`}>
      <div
        className={`flex h-full min-h-0 w-full max-w-[420px] flex-col overflow-hidden ${dark ? 'bg-black' : 'bg-white'} shadow-[0_0_24px_rgba(0,0,0,0.08)] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
