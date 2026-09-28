import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStampRally } from './hooks/useStampRally';
import { I18nProvider } from './i18n/context';
import { flushQueuedSync } from './lib/sheetApi';
import DemoResetButton from './components/DemoResetButton';
import { STAMP_RALLY_ROUTES } from './routes';

const INTRO_ROUTES: readonly string[] = [
  STAMP_RALLY_ROUTES.entry,
  STAMP_RALLY_ROUTES.notice,
  STAMP_RALLY_ROUTES.howto,
  STAMP_RALLY_ROUTES.register,
];

/** 子画面の切替やBottomNavの表示切替でも、この1つの状態を保持する。 */
export default function StampRallyLayout() {
  const stampRally = useStampRally();
  const { pathname } = useLocation();

  useEffect(() => {
    flushQueuedSync();
    window.addEventListener('online', flushQueuedSync);
    return () => window.removeEventListener('online', flushQueuedSync);
  }, []);

  if (!stampRally.registration && !INTRO_ROUTES.includes(pathname.replace(/\/+$/, ''))) {
    return <Navigate to={STAMP_RALLY_ROUTES.notice} replace />;
  }

  return (
    <I18nProvider>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] mx-auto flex max-w-[420px] flex-col items-start gap-2 p-2">
        <DemoResetButton onReset={stampRally.resetAll} />
      </div>
      <Outlet context={stampRally} />
    </I18nProvider>
  );
}
