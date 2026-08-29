import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { CHECKPOINTS } from '../data/checkpoints';

interface RevealLocationState {
  checkpointId?: number;
}

const SPARKLE_POSITIONS = [
  { top: '2%', left: '10%', delay: '0s', size: 'text-2xl' },
  { top: '8%', left: '80%', delay: '0.15s', size: 'text-3xl' },
  { top: '65%', left: '4%', delay: '0.3s', size: 'text-xl' },
  { top: '70%', left: '86%', delay: '0.45s', size: 'text-2xl' },
  { top: '-4%', left: '45%', delay: '0.6s', size: 'text-xl' },
  { top: '55%', left: '92%', delay: '0.75s', size: 'text-lg' },
];

const FESTIVAL_COLORS = ['#f5a623', '#e8524a', '#e060a8', '#8b7ed8', '#4cb37e'];

export default function StampRevealScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as RevealLocationState;
  const checkpoint = CHECKPOINTS.find((c) => c.id === state.checkpointId);

  useEffect(() => {
    if (!checkpoint) {
      navigate('/rally', { replace: true });
      return;
    }

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

    burst(0.3);
    const timer = window.setTimeout(() => burst(0.7), 150);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkpoint]);

  if (!checkpoint) return null;

  return (
    <PageContainer>
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-6 pb-8 text-center">
        <p className="animate-stamp-title text-xl font-bold text-collected">文字ゲット！</p>

        <div className="relative flex h-40 w-40 items-center justify-center">
          <span
            className="animate-stamp-ring absolute inset-0 rounded-full border-4 border-collected"
            style={{ animationDelay: '0.2s' }}
          />
          <span
            className="animate-stamp-ring absolute inset-0 rounded-full border-4 border-collected"
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

          <div className="animate-stamp-pop relative flex h-40 w-40 items-center justify-center rounded-full border-4 border-collected bg-[#fff3e0] text-6xl font-bold text-collected">
            {checkpoint.char}
          </div>
        </div>
      </main>
      <div className="sticky bottom-0 border-t border-[#eee] bg-white px-6 py-4">
        <Button variant="cta" onClick={() => navigate('/rally', { replace: true })}>
          閉じる
        </Button>
      </div>
    </PageContainer>
  );
}
