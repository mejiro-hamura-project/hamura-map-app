import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { getCorrectPhrase } from '../data/checkpoints';
import type { UseStampRally } from '../hooks/useStampRally';

export default function ExchangeScreen() {
  const navigate = useNavigate();
  const { phraseSolved, prizeExchanged, exchangePrize } = useOutletContext<UseStampRally>();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!phraseSolved) {
      navigate('/rally', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseSolved]);

  if (!phraseSolved) return null;

  const phrase = getCorrectPhrase();

  const handleConfirm = () => {
    exchangePrize();
    setConfirmOpen(false);
  };

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col items-center gap-8 overflow-y-auto px-6 pb-8 text-center">
        <div>
          <p className="text-sm font-bold text-[#4a4038]">完成したお題</p>
          <p className="mt-2 text-3xl font-bold tracking-widest text-collected">{phrase}</p>
        </div>

        <div className="w-full rounded-2xl border-2 border-exchange-btn bg-[#eef1fb] px-4 py-6">
          <h1 className="text-lg font-bold text-[#3a4a9a]">
            スタンプラリー
            <br />
            コンプリート賞 交換受付
          </h1>
        </div>

        {prizeExchanged ? (
          <div className="w-full rounded-xl bg-[#fdecea] px-4 py-4 text-base font-bold text-exchanged">
            交換済み
          </div>
        ) : (
          <Button variant="exchange-btn" onClick={() => setConfirmOpen(true)}>
            交換する
          </Button>
        )}
      </main>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[320px] rounded-2xl bg-white p-6 text-center shadow-xl">
            <p className="text-base font-bold text-[#2f2a24]">本当に引き換えますか？</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button variant="exchange-btn" onClick={handleConfirm}>
                OK
              </Button>
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
