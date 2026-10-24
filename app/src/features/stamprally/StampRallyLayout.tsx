import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStampRally } from './hooks/useStampRally';
import { I18nProvider } from './i18n/context';
import { STAMP_RALLY_ROUTES } from './routes';

// 開発者用操作パネル（開発モード専用）。import.meta.env.DEV はビルド時に定数へ置き換わるため、
// 本番ビルド（vite build）ではこの読み込み自体が消え、パネルとテスト用操作はバンドルに含まれない。
const DevPanel = import.meta.env.DEV ? lazy(() => import('./dev/DevPanel')) : null;

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
      {DevPanel && (
        <Suspense fallback={null}>
          <DevPanel stampRally={stampRally} />
        </Suspense>
      )}
    </I18nProvider>
  );
}
