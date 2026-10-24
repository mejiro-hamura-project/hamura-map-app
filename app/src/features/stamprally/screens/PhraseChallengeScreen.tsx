import { STAMP_RALLY_ROUTES } from '../routes';
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
import { FLOW_STEP_BY_SCREEN } from '../howtoSteps';
import { BUTTON_ICONS } from '../buttonIcons';

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
      navigate(STAMP_RALLY_ROUTES.rally, { replace: true });
    } else if (wasAlreadySolvedOnEntry) {
      navigate(STAMP_RALLY_ROUTES.exchange, { replace: true });
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
      <Header step={result === 'correct' ? FLOW_STEP_BY_SCREEN.afterPhraseSolved : FLOW_STEP_BY_SCREEN.challenge} />
      {/* 1画面に収める配置（表示だけ。並べ替え・判定・遷移の処理は変えない）。
          上下の空白は 7:13 に分けて、やや上寄せにする（進捗バーの下が空きすぎないように）。 */}
      <div aria-hidden="true" className="grow-[7]" />
      <main className="flex min-h-0 flex-initial flex-col items-center gap-2 overflow-y-auto px-4 pb-2 text-center [@media(max-height:480px)]:gap-1">
        {result === 'correct' ? (
          <div className="my-auto flex w-full flex-col items-center gap-2">
            <p className="flex items-center gap-2 text-[1.875rem] leading-tight font-extrabold text-sr-green-strong [@media(max-height:480px)]:text-[1.625rem]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sr-green-strong text-[1rem] text-white [@media(max-height:480px)]:h-6 [@media(max-height:480px)]:w-6 [@media(max-height:480px)]:text-[0.875rem]" aria-hidden="true">
                ✓
              </span>
              {m.challenge.correctTitle}
            </p>
            <p className="text-[clamp(1.75rem,10vw,2.5rem)] leading-tight font-bold tracking-wider text-sr-green-strong [@media(max-height:480px)]:text-2xl">
              {getCorrectPhrase(courseId)}
            </p>
            <p className="text-sm text-sr-ink">{m.challenge.correctBody}</p>

            {/* 次の操作（景品交換）は上部の操作指示「⑤ スタッフに見せて景品と交換！」と下のボタンで案内する。 */}

            {/* お題（答え）の紹介文・写真。文言は変換せずそのまま表示する。
                写真を上（中央）、説明文をその下（左揃え）に縦に並べる。写真は縦横比を保ち、切り抜かない。
                1画面に収まるよう、写真の高さは画面の高さに合わせて抑える。 */}
            {answer && (
              <div className="flex w-full max-w-sm flex-col items-center gap-2 rounded-xl border border-sr-line bg-white p-3 text-left">
                {answerImage && (
                  <img
                    src={answerImage}
                    alt={answer.text}
                    className="h-[clamp(64px,calc(100dvh-495px),180px)] w-auto max-w-full shrink-0 rounded-lg object-contain [@media(max-height:480px)]:h-14"
                  />
                )}
                <p className="w-full min-w-0 whitespace-pre-line text-xs leading-snug text-sr-ink">
                  {answer.description}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div>
              <p className="text-[1.625rem] leading-tight font-extrabold text-sr-ink [@media(max-height:480px)]:sr-only">{m.challenge.title}</p>
              {/* 不正解のときは、説明の位置に不正解の表示を出す（高さを変えずに1画面に収めるため） */}
              {result === 'wrong' ? (
                <p className="mt-0.5 rounded-lg bg-sr-red-soft px-2 py-0.5 text-sm font-bold leading-snug text-sr-red-strong">✕ {m.challenge.wrong}</p>
              ) : (
                <p className="mt-0.5 text-sm leading-snug text-sr-ink">{m.challenge.instruction}</p>
              )}
            </div>

            {/* お題（キーワード）の7枠は横一列。画面幅に合わせて縮める */}
            <div className="grid w-full grid-cols-7 justify-items-center gap-1">
              {slots.map((checkpointId, i) => {
                const checkpoint = checkpoints.find((c) => c.id === checkpointId);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => clearSlot(i)}
                    disabled={!checkpoint}
                    className={`flex aspect-square w-full max-w-14 items-center justify-center rounded-xl border-2 text-[1.5rem] font-bold [@media(max-height:480px)]:max-w-9 [@media(max-height:480px)]:text-[1.125rem] ${
                      checkpoint
                        ? 'border-sr-red bg-sr-red-soft text-sr-red-strong'
                        : 'border-dashed border-sr-line bg-sr-muted text-sr-line'
                    }`}
                  >
                    {checkpoint?.char ?? ''}
                  </button>
                );
              })}
            </div>

            <div className="w-full border-t border-sr-line pt-2 [@media(max-height:480px)]:pt-1">
              <p className="mb-1 text-sm font-bold text-sr-ink [@media(max-height:480px)]:mb-0.5 [@media(max-height:480px)]:text-xs">{m.challenge.available}</p>
              <div className="flex flex-wrap justify-center gap-1">
                {availableTiles.map((checkpoint) => (
                  <button
                    key={checkpoint.id}
                    type="button"
                    data-testid={`tile-${checkpoint.id}`}
                    onClick={() => placeTile(checkpoint.id)}
                    className="flex aspect-square w-[calc((100%-1.5rem)/7)] max-w-14 items-center justify-center rounded-lg border border-sr-line bg-white text-[1.5rem] font-bold text-sr-ink shadow-[0_2px_0_#dcd9cc] active:translate-y-px active:shadow-none [@media(max-height:480px)]:max-w-9 [@media(max-height:480px)]:text-[1.125rem]"
                  >
                    {checkpoint.char}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center gap-1 rounded-xl border border-sr-line bg-white px-3 py-1.5 text-left [@media(max-height:480px)]:py-1">
              <p className="mr-1 text-xs font-bold text-sr-ink">{m.challenge.answersHintLabel}</p>
              <ul className="contents">
                {hintAnswers.map((text, i) => (
                  <li key={i} className="rounded-full border border-sr-line bg-white px-2 py-0.5 text-xs text-sr-ink">
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>

      <div className="sticky bottom-0 shrink-0 bg-sr-bg px-5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] [@media(max-height:480px)]:pt-1.5 [@media(max-height:480px)]:pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {result === 'correct' ? (
          <Button variant="exchange-link" icon={BUTTON_ICONS.prize} className="min-h-[52px]! text-[1rem]! [@media(max-height:480px)]:min-h-[44px]!" onClick={() => navigate(STAMP_RALLY_ROUTES.exchange)}>
            {m.challenge.exchangeCta}
          </Button>
        ) : (
          <Button variant="cta" icon={BUTTON_ICONS.check} onClick={checkAnswer} disabled={!isFull}>
            {m.challenge.checkCta}
          </Button>
        )}
      </div>
      <div aria-hidden="true" className="grow-[13]" />
    </PageContainer>
  );
}
