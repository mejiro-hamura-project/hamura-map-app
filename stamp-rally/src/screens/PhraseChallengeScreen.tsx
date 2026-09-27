import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import type { UseStampRally } from '../hooks/useStampRally';
import { TOTAL_STAMPS, getCorrectPhrase, getCourseById, getAnswerForCourse } from '../data/checkpoints';
import { NORMAL_KEYWORDS, isElementaryKeyword } from '../data/answers';
import { ANSWER_IMAGES } from '../data/answerImages';
import { shuffle } from '../lib/random';
import { syncProgress } from '../lib/sheetApi';
import { isElementaryMode } from '../i18n/elementaryMode';
import { useDisplayMessages } from '../i18n/useDisplayMessages';

export default function PhraseChallengeScreen() {
  const navigate = useNavigate();
  const {
    registration,
    courseId,
    participantId,
    collectedIds,
    isComplete,
    phraseSolved,
    phraseSlots,
    setPhraseSlots,
    solvePhrase,
  } = useOutletContext<UseStampRally>();
  const m = useDisplayMessages(registration);

  const checkpoints = courseId !== null ? (getCourseById(courseId)?.checkpoints ?? []) : [];
  const answer = courseId !== null ? getAnswerForCourse(courseId) : undefined;
  const answerImage = answer ? ANSWER_IMAGES[answer.id] : undefined;
  const isElementary = isElementaryMode(registration);

  // タイルの並び順は最初の表示時に1回だけ決める（再描画のたびに動かないように）。
  const tiles = useMemo(
    () => shuffle(checkpoints.filter((c) => collectedIds.includes(c.id))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // 答えの参考表示。表記はどちらも変換しない（元の文字列をそのまま使う）。
  const hintAnswers = useMemo(() => {
    if (isElementary) {
      return NORMAL_KEYWORDS.filter(isElementaryKeyword).map((a) => a.text);
    }
    return shuffle(NORMAL_KEYWORDS.map((a) => a.text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  // マウント時点で捕まえておく。この画面内で正解して phraseSolved が true に
  // 変わっても、その変化で即座にガードへ引っかかって画面が消えてしまわないようにする
  // （「正解！」の表示や次へ進むボタンを見せる時間を確保するため）。
  const [wasAlreadySolvedOnEntry] = useState(phraseSolved);

  useEffect(() => {
    if (!isComplete) {
      navigate('/rally', { replace: true });
    } else if (wasAlreadySolvedOnEntry) {
      navigate('/exchange', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isComplete || wasAlreadySolvedOnEntry || courseId === null) return null;

  const slots = phraseSlots.length === TOTAL_STAMPS ? phraseSlots : new Array(TOTAL_STAMPS).fill(null);
  const placedIds = new Set(slots.filter((id): id is number => id !== null));
  const availableTiles = tiles.filter((t) => !placedIds.has(t.id));
  const isFull = slots.every((s) => s !== null);

  const placeTile = (checkpointId: number) => {
    if (result === 'correct') return;
    setResult('idle');
    const nextEmpty = slots.indexOf(null);
    if (nextEmpty === -1) return;
    setPhraseSlots(slots.map((v, i) => (i === nextEmpty ? checkpointId : v)));
  };

  const clearSlot = (index: number) => {
    if (result === 'correct') return;
    setResult('idle');
    setPhraseSlots(slots.map((v, i) => (i === index ? null : v)));
  };

  const checkAnswer = () => {
    const guess = slots.map((id) => checkpoints.find((c) => c.id === id)?.char ?? '').join('');
    if (guess === getCorrectPhrase(courseId)) {
      setResult('correct');
      solvePhrase();
      if (participantId) syncProgress(participantId, `${TOTAL_STAMPS}/${TOTAL_STAMPS}`);
    } else {
      setResult('wrong');
    }
  };

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-4 pb-8 text-center">
        {result === 'correct' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <p className="text-xl font-bold text-collected">{m.challenge.correctTitle}</p>
            <p className="text-4xl font-bold tracking-widest text-collected sm:text-5xl">
              {getCorrectPhrase(courseId)}
            </p>
            <p className="text-sm text-[#4a4038]">{m.challenge.correctBody}</p>

            {/* お題（答え）の紹介文・写真。文言は変換せずそのまま表示する。 */}
            {answer && (
              <div className="mt-2 w-full max-w-sm rounded-xl border border-[#eee] bg-[#faf8f4] p-4 text-left">
                {answerImage && (
                  <img
                    src={answerImage}
                    alt={answer.text}
                    className="mb-3 w-full rounded-lg object-cover"
                  />
                )}
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#4a4038]">
                  {answer.description}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div>
              <p className="text-lg font-bold text-[#2f2a24]">{m.challenge.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#4a4038]">{m.challenge.instruction}</p>
            </div>

            {/* お題（キーワード）は画面いっぱいに大きく表示する */}
            <div className="flex w-full flex-wrap justify-center gap-2">
              {slots.map((checkpointId, i) => {
                const checkpoint = checkpoints.find((c) => c.id === checkpointId);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => clearSlot(i)}
                    disabled={!checkpoint}
                    className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 text-3xl font-bold sm:h-20 sm:w-20 sm:text-4xl ${
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

            {result === 'wrong' && <p className="text-sm font-bold text-notice">{m.challenge.wrong}</p>}

            <div className="w-full border-t border-[#eee] pt-4">
              <p className="mb-2 text-sm font-bold text-[#4a4038]">{m.challenge.available}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {availableTiles.map((checkpoint) => (
                  <button
                    key={checkpoint.id}
                    type="button"
                    data-testid={`tile-${checkpoint.id}`}
                    onClick={() => placeTile(checkpoint.id)}
                    className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-[#ddd] bg-[#f7f3ec] text-2xl font-bold text-[#4a4038] active:scale-95"
                  >
                    {checkpoint.char}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full rounded-xl border border-[#eee] bg-[#faf8f4] px-4 py-3 text-left">
              <p className="mb-2 text-xs font-bold text-[#4a4038]">{m.challenge.answersHintLabel}</p>
              <ul className="space-y-1 text-sm text-[#4a4038]">
                {hintAnswers.map((text, i) => (
                  <li key={i}>・{text}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>

      <div className="sticky bottom-0 border-t border-[#eee] bg-white px-6 py-4">
        {result === 'correct' ? (
          <Button variant="exchange-link" onClick={() => navigate('/exchange')}>
            {m.challenge.exchangeCta}
          </Button>
        ) : (
          <Button variant="cta" onClick={checkAnswer} disabled={!isFull}>
            {m.challenge.checkCta}
          </Button>
        )}
      </div>
    </PageContainer>
  );
}
