import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStampRally } from './hooks/useStampRally';
import { I18nProvider } from './i18n/context';
import { STAMP_RALLY_ROUTES } from './routes';

const INTRO_ROUTES: readonly string[] = [
  STAMP_RALLY_ROUTES.entry,
  STAMP_RALLY_ROUTES.notice,
  STAMP_RALLY_ROUTES.howto,
  STAMP_RALLY_ROUTES.register,
];

/** 子画面で状態を共有し、フッターから戻った際は保存済みの進捗を読み込む。 */
export default function StampRallyLayout() {
  const stampRally = useStampRally();
  const { pathname } = useLocation();

  if (!stampRally.registration && !INTRO_ROUTES.includes(pathname.replace(/\/+$/, ''))) {
    return <Navigate to={STAMP_RALLY_ROUTES.notice} replace />;
  }

  return (
    <I18nProvider>
      <Outlet context={stampRally} />
    </I18nProvider>
  );
}
