import { Navigate, useOutletContext } from 'react-router-dom';
import type { UseStampRally } from './hooks/useStampRally';
import { STAMP_RALLY_ROUTES } from './routes';

/** 既登録の参加者は進行画面へ戻し、再登録させない。 */
export default function StampRallyScreen() {
  const { registration } = useOutletContext<UseStampRally>();
  return (
    <Navigate
      to={registration ? STAMP_RALLY_ROUTES.rally : STAMP_RALLY_ROUTES.notice}
      replace
    />
  );
}
