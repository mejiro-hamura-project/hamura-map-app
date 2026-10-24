import { STAMP_RALLY_ROUTES } from '../routes';
import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import StampGrid from '../components/StampGrid';
import StampFlyOverlay from '../components/StampFlyOverlay';
import QrLocationMap from '../components/QrLocationMap';
import { FLOW_STEP_BY_SCREEN } from '../howtoSteps';
import { BUTTON_ICONS } from '../buttonIcons';
import type { UseStampRally } from '../hooks/useStampRally';
import { TOTAL_STAMPS, getCourseById } from '../data/checkpoints';
import { useDisplayMessages } from '../i18n/useDisplayMessages';

interface RallyLocationState {
  // スタンプ獲得画面(/reveal)から戻ってきた直後だけ渡される、着地演出の情報。
  justCollectedId?: number;
  startRect?: { x: number; y: number; size: number };
  reducedMotion?: boolean;
}

interface Flight {
  slotIndex: number;
  char: string;
  from: { x: number; y: number; size: number };
  to: { x: number; y: number; size: number };
}

export default function RallyScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    registration,
    participantNumber,
    courseId,
    collectedIds,
    collectedCount,
    isComplete,
    phraseSolved,
    prizeExchanged,
  } = useOutletContext<UseStampRally>();
  const m = useDisplayMessages(registration);

  const checkpoints = courseId !== null ? (getCourseById(courseId)?.checkpoints ?? []) : [];

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [flight, setFlight] = useState<Flight | null>(null);
  // 同じ location.state を二重処理しない（StrictModeの再実行や再レンダーで
  // 飛行演出が繰り返し起きないようにするための参照ガード）。
  const handledStateRef = useRef<unknown>(null);

  // 実際のスタンプ枠の座標が確定してから飛行を開始したいので、ペイント前に
  // 測る useLayoutEffect を使う（useEffectだと一瞬「?」ではなく本来の文字が
  // 見えてしまうことがある）。
  useLayoutEffect(() => {
    const state = location.state as RallyLocationState | null;
    if (!state?.justCollectedId || handledStateRef.current === state) return;
    handledStateRef.current = state;

    if (state.reducedMotion || !state.startRect) return; // 演出を省略してそのまま表示

    const slotIndex = collectedIds.indexOf(state.justCollectedId);
    const checkpoint = checkpoints.find((c) => c.id === state.justCollectedId);
    const slotEl = slotRefs.current[slotIndex];
    if (slotIndex === -1 || !checkpoint || !slotEl) return;

    const toRect = slotEl.getBoundingClientRect();
    setFlight({
      slotIndex,
      char: checkpoint.char,
      from: state.startRect,
      to: {
        x: toRect.left + toRect.width / 2,
        y: toRect.top + toRect.height / 2,
        size: toRect.width,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // 取得演出から戻った直後だけ「○を獲得しました」を添える（飛行演出が終わってから表示）。
  const justCollectedId = (location.state as RallyLocationState | null)?.justCollectedId;
  const justCollectedChar = !flight
    ? checkpoints.find((c) => c.id === justCollectedId && collectedIds.includes(c.id))?.char
    : undefined;

  return (
    <PageContainer>
      <Header
        step={
          phraseSolved
            ? FLOW_STEP_BY_SCREEN.afterPhraseSolved
            : isComplete
              ? FLOW_STEP_BY_SCREEN.rallyComplete
              : FLOW_STEP_BY_SCREEN.rallyCollecting
        }
      />
      {/* 1画面に収める：上に参加者番号・取得数・スタンプ枠、残りの高さはすべて地図。
          高さの低い横向きでは、地図を左、参加者番号・スタンプ枠を右に並べる。
          次にする操作は上部の操作指示に出すため、ここでは繰り返さない。 */}
      <main className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 pb-2 [@media(max-height:480px)]:flex-row">
        <div className="flex shrink-0 flex-col gap-2 [@media(max-height:480px)]:order-last [@media(max-height:480px)]:w-36 [@media(max-height:480px)]:justify-center">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-xl border border-sr-line bg-white px-3 py-1">
            {participantNumber !== null && (
              <p className="text-xs font-bold text-sr-sub">
                {m.rally.participantNumberLabel} <span className="text-sm">No.{participantNumber}</span>
              </p>
            )}
            {/* 取得数：「スタンプ」の説明は小さく、「3 / 7」の数値は約1.5倍・太字・濃い緑で目立たせる。 */}
            <p className="flex items-baseline gap-1.5 whitespace-nowrap text-sm font-bold text-sr-ink [@media(max-height:480px)]:text-xs">
              {m.rally.countShort}
              <span className="text-[1.75rem] leading-none font-extrabold text-sr-green-strong [@media(max-height:480px)]:text-[1.5rem]">
                {collectedCount}
                <span className="text-xl [@media(max-height:480px)]:text-lg"> / {TOTAL_STAMPS}</span>
              </span>
            </p>
          </div>

          <StampGrid
            collectedIds={collectedIds}
            checkpoints={checkpoints}
            totalSlots={TOTAL_STAMPS}
            hiddenSlotIndex={flight?.slotIndex ?? null}
            slotRefs={slotRefs}
          />
        </div>

        <QrLocationMap
          checkpoints={checkpoints}
          collectedIds={collectedIds}
          title={m.rally.qrMapTitle}
          collectedLabel={m.rally.qrCollected}
          notCollectedLabel={m.rally.qrNotCollected}
          resetLabel={m.rally.qrMapReset}
          overlay={
            // 取得演出から戻った直後だけ「○を獲得しました」を地図の下端に重ねて出す（レイアウトは動かさない）。
            justCollectedChar && !phraseSolved ? (
              <p
                aria-live="polite"
                className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-stamprally-collected-strong px-3 py-1 text-sm font-extrabold text-white shadow"
              >
                {m.rally.justCollected.replace('{char}', justCollectedChar)}
              </p>
            ) : undefined
          }
        />
      </main>

      <div className="sticky bottom-0 shrink-0 bg-sr-bg px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] [@media(max-height:480px)]:pt-1.5 [@media(max-height:480px)]:pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {isComplete && !phraseSolved ? (
          <Button variant="exchange-link" icon={BUTTON_ICONS.arrange} className="min-h-[52px]! text-[1rem]! [@media(max-height:480px)]:min-h-[44px]!" onClick={() => navigate(STAMP_RALLY_ROUTES.challenge)}>
            {m.rally.challengeCta}
          </Button>
        ) : phraseSolved && !prizeExchanged ? (
          <Button variant="exchange-link" icon={BUTTON_ICONS.prize} className="min-h-[52px]! text-[1rem]! [@media(max-height:480px)]:min-h-[44px]!" onClick={() => navigate(STAMP_RALLY_ROUTES.exchange)}>
            {m.rally.exchangeCta}
          </Button>
        ) : isComplete ? (
          // 交換済み：以前は押せないカメラボタンを出していた。操作できない点は同じまま、
          // 紛らわしくないよう「交換済み」の表示に置き換える。
          <p className="flex min-h-[52px] items-center justify-center rounded-full border border-sr-green bg-sr-green-soft px-6 text-[1rem] font-semibold text-sr-green-strong [@media(max-height:480px)]:min-h-[44px]">
            ✓ {m.exchange.done}
          </p>
        ) : (
          <Button variant="camera" className="min-h-[52px]! text-[1rem]! [@media(max-height:480px)]:min-h-[44px]!" onClick={() => navigate(STAMP_RALLY_ROUTES.camera)}>
            {m.rally.cameraCta}
          </Button>
        )}
      </div>

      {flight && (
        <StampFlyOverlay
          char={flight.char}
          from={flight.from}
          to={flight.to}
          onDone={() => setFlight(null)}
        />
      )}
    </PageContainer>
  );
}
