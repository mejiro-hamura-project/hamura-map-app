import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import StampGrid from '../components/StampGrid';
import StampFlyOverlay from '../components/StampFlyOverlay';
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
    addStamp,
    testCompleteAllStamps,
    resetProgress,
  } = useOutletContext<UseStampRally>();
  const m = useDisplayMessages(registration);

  const checkpoints = courseId !== null ? (getCourseById(courseId)?.checkpoints ?? []) : [];
  const nextUncollected = checkpoints.find((cp) => !collectedIds.includes(cp.id));

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

  const loadTestQr = () => {
    if (!nextUncollected) return;
    // 実際のカメラ画面(CameraScreen)と同じ判定関数・状態更新を通す
    // （重複チェックは「未取得のものだけを選ぶ」ことで自然に満たされる）。
    addStamp(nextUncollected.id);
    navigate('/reveal', { state: { checkpointId: nextUncollected.id } });
  };

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 pb-8">
        <div className="text-center">
          {participantNumber !== null && (
            <p className="mb-1 text-xs font-bold text-[#999]">
              {m.rally.participantNumberLabel} No.{participantNumber}
            </p>
          )}
          <p className="text-sm font-bold text-[#4a4038]">{m.rally.countLabel}</p>
          <p className="text-2xl font-bold text-collected">
            {collectedCount} <span className="text-base text-[#4a4038]">/ {TOTAL_STAMPS}</span>
          </p>
        </div>

        <StampGrid
          collectedIds={collectedIds}
          checkpoints={checkpoints}
          totalSlots={TOTAL_STAMPS}
          hiddenSlotIndex={flight?.slotIndex ?? null}
          slotRefs={slotRefs}
        />

        {isComplete && !phraseSolved && (
          <div className="rounded-xl border-2 border-collected bg-[#fff3e0] px-4 py-3 text-center">
            <p className="text-sm font-bold text-collected">{m.rally.completeBanner1}</p>
          </div>
        )}

        {phraseSolved && !prizeExchanged && (
          <div className="rounded-xl border-2 border-collected bg-[#fff3e0] px-4 py-3 text-center text-sm font-bold text-collected">
            {m.rally.phraseSolvedBanner}
          </div>
        )}

        {prizeExchanged && (
          <div className="rounded-xl bg-[#fdecea] px-4 py-3 text-center text-sm font-bold text-exchanged">
            {m.rally.exchangedBanner}
          </div>
        )}

        {/* デモ用アプリのため、テスト用ボタンは常時表示（本番用の出し分けはしない）。 */}
        <div className="mt-2 flex flex-col gap-2 rounded-xl border border-dashed border-[#ccc] p-3">
          <p className="text-center text-xs font-bold text-[#999]">デモ用のテストボタン</p>
          <button
            type="button"
            onClick={resetProgress}
            className="min-h-[44px] rounded-full border border-[#999] px-4 text-sm font-bold text-[#666]"
          >
            テスト用進行状況リセット
          </button>
          <button
            type="button"
            onClick={loadTestQr}
            disabled={!nextUncollected}
            className="min-h-[44px] rounded-full border border-[#999] px-4 text-sm font-bold text-[#666] disabled:opacity-40"
          >
            テスト用QRを読み込む
          </button>
          <button
            type="button"
            onClick={testCompleteAllStamps}
            disabled={isComplete}
            className="min-h-[44px] rounded-full border border-[#999] px-4 text-sm font-bold text-[#666] disabled:opacity-40"
          >
            テスト用スタンプラリーを完成させる
          </button>
        </div>
      </main>

      <div className="sticky bottom-0 border-t border-[#eee] bg-white px-6 py-4">
        {isComplete && !phraseSolved ? (
          <Button variant="exchange-link" onClick={() => navigate('/challenge')}>
            {m.rally.challengeCta}
          </Button>
        ) : phraseSolved && !prizeExchanged ? (
          <Button variant="exchange-link" onClick={() => navigate('/exchange')}>
            {m.rally.exchangeCta}
          </Button>
        ) : (
          <Button variant="camera" onClick={() => navigate('/camera')} disabled={isComplete}>
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
