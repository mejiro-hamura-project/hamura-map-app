import { NavLink } from 'react-router-dom';

type Tab = {
  to: string;
  label: string;
  icon: string;
};

const TABS: Tab[] = [
  { to: '/', label: 'ホーム', icon: '🏠' },
  { to: '/events', label: 'イベント一覧', icon: '📋' },
  { to: '/stamprally', label: 'スタンプラリー', icon: '🎯' },
  { to: '/posts', label: '投稿', icon: '💬' },
];

export default function BottomNav() {
  return (
    <nav aria-label="メインナビゲーション" className="sticky bottom-0 flex shrink-0 border-t border-line bg-card pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${
              isActive ? 'text-brand-blue' : 'text-sub'
            }`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
