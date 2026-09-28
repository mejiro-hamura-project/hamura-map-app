import { useI18n } from '../i18n/useI18n';
import { Link, useLocation } from 'react-router-dom';
import { isStampRallyFullScreen, STAMP_RALLY_ROUTES } from '../routes';

interface HeaderProps {
  dark?: boolean;
}

export default function Header({ dark = false }: HeaderProps) {
  const { m } = useI18n();
  const { pathname } = useLocation();
  const fullScreen = isStampRallyFullScreen(pathname);
  const exchange = pathname.replace(/\/+$/, '') === STAMP_RALLY_ROUTES.exchange;
  return (
    <header
      className={`shrink-0 py-4 text-center font-bold leading-tight ${dark ? 'text-white' : 'text-[#2f2a24]'}`}
    >
      {fullScreen && (
        <div className="mb-2 flex items-center justify-end gap-4 px-4 pt-7 text-sm">
          {exchange && <Link to={STAMP_RALLY_ROUTES.rally} className="flex min-h-[44px] items-center">{m.common.back}</Link>}
          <Link to="/" lang="ja" className="flex min-h-[44px] items-center">祭り案内へ</Link>
        </div>
      )}
      <p className="text-lg">{m.header.line1}</p>
      <p className="text-lg">{m.header.line2}</p>
    </header>
  );
}
