import { useI18n } from '../i18n/useI18n';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { isStampRallyFullScreen, STAMP_RALLY_ROUTES } from '../routes';
import { STAMP_RALLY_DISPLAY } from '../displayConfig';
import { getStepStatuses, type FlowStepNumber } from '../howtoSteps';
import type { UseStampRally } from '../hooks/useStampRally';
import StepProgress from './StepProgress';

interface HeaderProps {
  dark?: boolean;
  /**
   * この画面が何番の手順にあたるか（howtoSteps.ts の FLOW_STEP_BY_SCREEN）。
   * null＝手順より前の画面（全体の流れだけを表示）、undefined＝進捗バーを出さない。
   */
  step?: FlowStepNumber | null;
}

export default function Header({ dark = false, step }: HeaderProps) {
  const { m } = useI18n();
  const { pathname } = useLocation();
  // 進捗は既存の状態（登録・取得数・お題の正解・景品交換）を読むだけで判定する。
  const { registration, isComplete, phraseSolved, prizeExchanged } = useOutletContext<UseStampRally>();
  const fullScreen = isStampRallyFullScreen(pathname);
  const exchange = pathname.replace(/\/+$/, '') === STAMP_RALLY_ROUTES.exchange;
  const statuses =
    step !== undefined
      ? getStepStatuses(step, { registered: registration !== null, isComplete, phraseSolved, prizeExchanged })
      : null;
  return (
    <header
      className={`shrink-0 pt-2 pb-1 text-center [@media(max-height:480px)]:pt-1 font-extrabold leading-tight ${dark ? 'text-white' : 'text-sr-ink'}`}
    >
      {STAMP_RALLY_DISPLAY.showHeaderNavLinks && fullScreen && (
        <div className="mb-2 flex items-center justify-end gap-4 px-4 pt-7 text-sm">
          {exchange && <Link to={STAMP_RALLY_ROUTES.rally} className="flex min-h-[44px] items-center">{m.common.back}</Link>}
          <Link to="/" lang="ja" className="flex min-h-[44px] items-center">祭り案内へ</Link>
        </div>
      )}
      {/* 「お祭り スタンプラリー」の見出し（header.line1 / line2）は表示しない。上部は進捗バーと操作指示だけ。 */}
      {step !== undefined && statuses && <StepProgress current={step} statuses={statuses} dark={dark} />}
    </header>
  );
}
