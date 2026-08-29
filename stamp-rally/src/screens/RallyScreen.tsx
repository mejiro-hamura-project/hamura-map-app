import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import StampGrid from '../components/StampGrid';
import type { UseStampRally } from '../hooks/useStampRally';
import { TOTAL_STAMPS } from '../data/checkpoints';

export default function RallyScreen() {
  const navigate = useNavigate();
  const {
    collectedIds,
    collectedCount,
    isComplete,
    canChallenge,
    phraseSolved,
    prizeExchanged,
    resetAll,
  } = useOutletContext<UseStampRally>();

  const handleReset = () => {
    if (window.confirm('進行状況（スタンプ・登録情報・交換履歴）をすべて消去して最初からやり直しますか？')) {
      resetAll();
      navigate('/notice', { replace: true });
    }
  };

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 pb-8">
        <div className="text-center">
          <p className="text-sm font-bold text-[#4a4038]">現在のスタンプ数</p>
          <p className="text-2xl font-bold text-collected">
            {collectedCount} <span className="text-base text-[#4a4038]">/ {TOTAL_STAMPS}</span>
          </p>
        </div>

        <StampGrid collectedIds={collectedIds} />

        {canChallenge && (
          <div className="rounded-xl border-2 border-collected bg-[#fff3e0] px-4 py-3 text-center">
            <p className="text-sm font-bold text-collected">
              7つのスタンプが集まりました！
              <br />
              正しい並び順を考えて、お題に挑戦しよう。
            </p>
          </div>
        )}

        {phraseSolved && !prizeExchanged && (
          <div className="rounded-xl border-2 border-collected bg-[#fff3e0] px-4 py-3 text-center text-sm font-bold text-collected">
            お題を完成させました！本殿で交換しよう
          </div>
        )}

        {prizeExchanged && (
          <div className="rounded-xl bg-[#fdecea] px-4 py-3 text-center text-sm font-bold text-exchanged">
            景品交換は完了しています
          </div>
        )}

        {import.meta.env.DEV && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 min-h-[44px] text-center text-xs text-[#999] underline"
          >
            （テスト用）進行状況をリセットして最初からやり直す
          </button>
        )}
      </main>

      <div className="sticky bottom-0 border-t border-[#eee] bg-white px-6 py-4">
        {canChallenge ? (
          <Button variant="exchange-link" onClick={() => navigate('/challenge')}>
            お題に挑戦する
          </Button>
        ) : phraseSolved && !prizeExchanged ? (
          <Button variant="exchange-link" onClick={() => navigate('/exchange')}>
            景品交換へ進む
          </Button>
        ) : (
          <Button variant="camera" onClick={() => navigate('/camera')} disabled={isComplete}>
            📷 カメラを起動する
          </Button>
        )}
      </div>
    </PageContainer>
  );
}
