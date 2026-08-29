import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import type { UseStampRally } from '../hooks/useStampRally';
import { CHECKPOINTS, TOTAL_STAMPS, getCorrectPhrase } from '../data/checkpoints';

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PhraseChallengeScreen() {
  const navigate = useNavigate();
  const { collectedIds, isComplete, phraseSolved, solvePhrase } = useOutletContext<UseStampRally>();

  const tiles = useMemo(
    () => shuffle(CHECKPOINTS.filter((c) => collectedIds.includes(c.id))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [slots, setSlots] = useState<(number | null)[]>(() => Array(TOTAL_STAMPS).fill(null));
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  // captured once on mount so solving the phrase in *this* visit doesn't
  // trigger the "already solved, redirect away" guard mid-celebration
  const [wasAlreadySolvedOnEntry] = useState(phraseSolved);

  useEffect(() => {
    if (!isComplete) {
      navigate('/rally', { replace: true });
    } else if (wasAlreadySolvedOnEntry) {
      navigate('/exchange', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isComplete || wasAlreadySolvedOnEntry) return null;

  const placedIds = new Set(slots.filter((id): id is number => id !== null));
  const availableTiles = tiles.filter((t) => !placedIds.has(t.id));
  const isFull = slots.every((s) => s !== null);

  const placeTile = (checkpointId: number) => {
    if (result === 'correct') return;
    setResult('idle');
    const nextEmpty = slots.indexOf(null);
    if (nextEmpty === -1) return;
    setSlots((prev) => prev.map((v, i) => (i === nextEmpty ? checkpointId : v)));
  };

  const clearSlot = (index: number) => {
    if (result === 'correct') return;
    setResult('idle');
    setSlots((prev) => prev.map((v, i) => (i === index ? null : v)));
  };

  const checkAnswer = () => {
    const guess = slots
      .map((id) => CHECKPOINTS.find((c) => c.id === id)?.char ?? '')
      .join('');
    if (guess === getCorrectPhrase()) {
      setResult('correct');
      solvePhrase();
    } else {
      setResult('wrong');
    }
  };

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-6 pb-8 text-center">
        {result === 'correct' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <p className="text-xl font-bold text-collected">正解！コンプリート！</p>
            <p className="text-3xl font-bold tracking-widest text-collected">
              {getCorrectPhrase()}
            </p>
            <p className="text-sm text-[#4a4038]">おめでとうございます！お題を完成させました。</p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-lg font-bold text-[#2f2a24]">お題に挑戦</p>
              <p className="mt-1 text-sm leading-relaxed text-[#4a4038]">
                7つの文字を並び替えて、正しいお題を完成させよう！
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {slots.map((checkpointId, i) => {
                const checkpoint = CHECKPOINTS.find((c) => c.id === checkpointId);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => clearSlot(i)}
                    disabled={!checkpoint}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xl font-bold ${
                      checkpoint
                        ? 'border-collected bg-[#fff3e0] text-collected'
                        : 'border-dashed border-[#ccc] bg-white text-[#ccc]'
                    }`}
                  >
                    {checkpoint?.char ?? ''}
                  </button>
                );
              })}
            </div>

            {result === 'wrong' && (
              <p className="text-sm font-bold text-notice">
                残念、正解ではありません。もう一度並び替えてみよう！
              </p>
            )}

            <div className="w-full border-t border-[#eee] pt-4">
              <p className="mb-2 text-sm font-bold text-[#4a4038]">持っている文字（タップで配置）</p>
              <div className="flex flex-wrap justify-center gap-2">
                {availableTiles.map((checkpoint) => (
                  <button
                    key={checkpoint.id}
                    type="button"
                    data-testid={`tile-${checkpoint.id}`}
                    onClick={() => placeTile(checkpoint.id)}
                    className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#ddd] bg-[#f7f3ec] text-xl font-bold text-[#4a4038] active:scale-95"
                  >
                    {checkpoint.char}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <div className="sticky bottom-0 border-t border-[#eee] bg-white px-6 py-4">
        {result === 'correct' ? (
          <Button variant="exchange-link" onClick={() => navigate('/exchange')}>
            景品交換へ進む
          </Button>
        ) : (
          <Button variant="cta" onClick={checkAnswer} disabled={!isFull}>
            この並びで判定する
          </Button>
        )}
      </div>
    </PageContainer>
  );
}
