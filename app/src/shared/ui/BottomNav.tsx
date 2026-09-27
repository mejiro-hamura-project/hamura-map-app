import { NavLink } from 'react-router-dom';
import { externalUrl } from '../utils/externalUrl';

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

const stampRallyUrl = externalUrl(import.meta.env.VITE_STAMP_RALLY_URL);

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 flex border-t border-line bg-card">
      {TABS.map((tab) =>
        tab.to === '/stamprally' && stampRallyUrl ? (
          <a
            key={tab.to}
            href={stampRallyUrl}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-sub"
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </a>
        ) : (
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
        ),
      )}
    </nav>
  );
}
