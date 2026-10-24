import { Navigate, useOutletContext } from 'react-router-dom';
import type { UseStampRally } from './hooks/useStampRally';
import { STAMP_RALLY_ROUTES } from './routes';

/** 保存済みの進捗に合わせ、スタンプラリーの続きへ戻す。 */
export default function StampRallyScreen() {
  const { registration, isComplete, phraseSolved } = useOutletContext<UseStampRally>();

  const destination = !registration
    ? STAMP_RALLY_ROUTES.notice
    : phraseSolved
      ? STAMP_RALLY_ROUTES.exchange
      : isComplete
        ? STAMP_RALLY_ROUTES.challenge
        : STAMP_RALLY_ROUTES.rally;

  return <Navigate to={destination} replace />;
}
