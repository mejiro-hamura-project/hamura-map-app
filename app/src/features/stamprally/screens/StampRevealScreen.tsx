import { STAMP_RALLY_ROUTES } from '../routes';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import { TOTAL_STAMPS, getCourseById } from '../data/checkpoints';
import type { UseStampRally } from '../hooks/useStampRally';
import { useDisplayMessages } from '../i18n/useDisplayMessages';
import { FLOW_STEP_BY_SCREEN } from '../howtoSteps';

interface RevealLocationState {
  checkpointId?: number;
}

const SPARKLE_POSITIONS = [
  { top: '2%', left: '10%', delay: '0s', size: 'text-[1.5rem]' },
  { top: '8%', left: '80%', delay: '0.15s', size: 'text-[1.875rem]' },
  { top: '65%', left: '4%', delay: '0.3s', size: 'text-[1.25rem]' },
  { top: '70%', left: '86%', delay: '0.45s', size: 'text-[1.5rem]' },
  { top: '-4%', left: '45%', delay: '0.6s', size: 'text-[1.25rem]' },
  { top: '55%', left: '92%', delay: '0.75s', size: 'text-[1.125rem]' },
];

const FESTIVAL_COLORS = ['#f5a623', '#e8524a', '#e060a8', '#8b7ed8', '#4cb37e'];
const GOLD_COLORS = ['#f5a623', '#ffd76b', '#fff3e0'];

// 「GET!」演出を見せてから、実際のスタンプ一覧の枠へ向かう飛行アニメーション
// （/rally側）へバトンタッチするまでの時間。
const HANDOFF_DELAY_MS = 650;

export default function StampRevealScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registration, courseId, collectedCount } = useOutletContext<UseStampRally>();
  const m = useDisplayMessages(registration);
  const state = (location.state ?? {}) as RevealLocationState;
  const checkpoint = (courseId !== null ? getCourseById(courseId)?.checkpoints : undefined)?.find(
    (c) => c.id === state.checkpointId,
  );

  const iconRef = useRef<HTMLDivElement>(null);
  const proceededRef = useRef(false);

  const proceed = () => {
    if (proceededRef.current) return;
    proceededRef.current = true;

    // canvas-confetti は専用のcanvasをdocument.bodyに直接追加し、Reactのルーティング
    // とは無関係に自前のアニメーションループで数秒間動き続ける（重力で「落ちて」いく）。
    // ここでresetしないと、/rallyへ画面遷移した後もこのcanvasが（スタンプの飛行演出より
    // 前面のz-indexで）残り続け、あたかもスタンプ自体が下に落ちているように見えてしまう。
    confetti.reset();

    if (!checkpoint) {
      navigate(STAMP_RALLY_ROUTES.rally, { replace: true });
      return;
    }

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // このアイコンの現在位置(viewport基準px)を、/rally側の飛行アニメーションの
    // 出発地点として渡す。revealとrallyはDOMが差し替わるだけの同一ページ内
    // 遷移なので、ここで測った座標はそのまま次の画面でも通用する。
    const rect = iconRef.current?.getBoundingClientRect();

    navigate(STAMP_RALLY_ROUTES.rally, {
      replace: true,
      state: {
        justCollectedId: checkpoint.id,
        reducedMotion,
        startRect:
          rect && !reducedMotion
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, size: rect.width }
            : undefined,
      },
    });
  };

  useEffect(() => {
    if (!checkpoint) {
      proceed();
      return;
    }

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const burst = (originX: number) =>
      confetti({
        particleCount: 70,
        spread: 80,
        startVelocity: 45,
        origin: { x: originX, y: 0.4 },
        colors: FESTIVAL_COLORS,
        scalar: 1,
        ticks: 200,
      });

    const timers: number[] = [];

    if (!reducedMotion) {
      burst(0.3);
      timers.push(window.setTimeout(() => burst(0.7), 150));
      timers.push(window.setTimeout(
        () =>
          confetti({
            particleCount: 40,
            spread: 110,
            startVelocity: 32,
            origin: { x: 0.5, y: 0.45 },
            colors: GOLD_COLORS,
            scalar: 0.9,
            ticks: 160,
          }),
        320,
      ));
    }

    // 動きを減らす設定では、演出をほぼ省略してすぐに次へ渡す。
    const handoffDelay = reducedMotion ? 150 : HANDOFF_DELAY_MS;
    timers.push(window.setTimeout(proceed, handoffDelay));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      confetti.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkpoint]);

  if (!checkpoint) return null;

  return (
    <PageContainer>
      <Header step={FLOW_STEP_BY_SCREEN.reveal} />
      {/* 高さが足りない画面（横向きのスマホ等）では演出ごとスクロールでき、上下が切れない。
          中身は上下の空白を 7:13 に分けて、やや上寄せで配置する（justify-center だとスクロール時に上が切れるため）。 */}
      <main
        className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-6 pb-8 text-center [@media(max-height:480px)]:pb-2 before:grow-[7] before:content-[''] after:grow-[13] after:content-['']"
        onClick={proceed}
      >
        <div className="flex flex-col items-center gap-6 [@media(max-height:640px)]:gap-3 [@media(max-height:400px)]:gap-2!">
          <div className="flex flex-col items-center gap-2 [@media(max-height:400px)]:gap-1">
            <span
              className="animate-stamp-title rounded-full bg-stamprally-collected-strong px-4 py-1 text-sm font-bold text-white"
              style={{ animationDelay: '0.15s' }}
            >
              {m.reveal.stampGet}
            </span>
            <p className="animate-stamp-title text-[1.875rem] leading-tight font-extrabold text-stamprally-collected-strong [@media(max-height:400px)]:text-[1.625rem]">{m.reveal.title}</p>
          </div>

          <div className="relative flex h-40 w-40 items-center justify-center [@media(max-height:640px)]:h-28 [@media(max-height:640px)]:w-28 [@media(max-height:400px)]:h-20! [@media(max-height:400px)]:w-20!">
            <span
              className="animate-stamp-ring absolute inset-0 rounded-full border-4 border-sr-red"
              style={{ animationDelay: '0.2s' }}
            />
            <span
              className="animate-stamp-ring absolute inset-0 rounded-full border-4 border-sr-red"
              style={{ animationDelay: '0.9s' }}
            />

            {SPARKLE_POSITIONS.map((s, i) => (
              <span
                key={i}
                className={`animate-stamp-sparkle absolute ${s.size}`}
                style={{ top: s.top, left: s.left, animationDelay: s.delay }}
              >
                ✨
              </span>
            ))}

            <div
              ref={iconRef}
              className="animate-stamp-pop relative flex h-40 w-40 items-center justify-center [@media(max-height:640px)]:h-28 [@media(max-height:640px)]:w-28 [@media(max-height:640px)]:text-5xl [@media(max-height:400px)]:h-20! [@media(max-height:400px)]:w-20! [@media(max-height:400px)]:text-4xl! rounded-full border-4 border-sr-red bg-sr-red-soft text-6xl font-bold text-stamprally-collected-strong"
            >
              {checkpoint.char}
            </div>
          </div>

          {/* 取得済み数は遷移前に addStamp で確定しているので、既存の値をそのまま表示する。 */}
          <p className="text-lg font-bold text-sr-ink [@media(max-height:400px)]:text-base">
            {m.reveal.progress.replace('{n}', String(collectedCount)).replace('{total}', String(TOTAL_STAMPS))}
          </p>

          <p className="text-sm text-sr-sub">{m.reveal.tapHint}</p>
        </div>
      </main>
    </PageContainer>
  );
}
