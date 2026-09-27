import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { getCorrectPhrase } from '../data/checkpoints';
import type { UseStampRally } from '../hooks/useStampRally';
import { useDisplayMessages } from '../i18n/useDisplayMessages';
import { useLongPress } from '../hooks/useLongPress';
import { syncExchangeToSheet, syncProgress } from '../lib/sheetApi';

export default function ExchangeScreen() {
  const navigate = useNavigate();
  const { registration, phraseSolved, prizeExchanged, exchangePrize, courseId, participantId } =
    useOutletContext<UseStampRally>();
  const m = useDisplayMessages(registration);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!phraseSolved || courseId === null) {
      navigate('/rally', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseSolved]);

  const longPress = useLongPress({
    onLongPress: () => {
      if (!prizeExchanged) setConfirmOpen(true);
    },
  });

  // お題が終わっていない場合は交換画面へ進めない
  if (!phraseSolved || courseId === null) return null;

  const phrase = getCorrectPhrase(courseId);

  const closeConfirm = () => {
    setConfirmOpen(false);
  };

  const handleConfirm = () => {
    if (prizeExchanged) return; // 二重交換防止
    // 交換の確定はlocalStorageだけで完結する。Googleスプレッドシートへの送信は
    // 「あれば送る」ベストエフォートで、URL未設定・通信失敗のいずれでも
    // 交換自体の成否には一切影響しない。
    exchangePrize();
    if (participantId) {
      syncExchangeToSheet(participantId);
      syncProgress(participantId, m.exchange.done);
    }
    setConfirmOpen(false);
  };

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-6 pb-8 text-center">
        <div className="w-full rounded-2xl border-2 border-exchange-link bg-white px-4 py-5">
          <p className="text-2xl font-bold text-exchange-link">{m.exchange.handToStaff}</p>
        </div>

        <div className="w-full">
          <p className="text-xs font-bold text-[#999]">{m.exchange.phraseLabel}</p>
          <p className="mt-2 text-4xl font-bold tracking-widest text-exchange-link">{phrase}</p>
        </div>

        <div className="w-full space-y-1 text-xs text-[#999]">
          <p>{m.exchange.staffNotice1}</p>
          <p>{m.exchange.staffNotice2}</p>
          <p>{m.exchange.staffNotice3}</p>
        </div>

        {prizeExchanged ? (
          <div className="w-full rounded-xl bg-[#fdecea] px-4 py-4 text-base font-bold text-exchanged">
            {m.exchange.done}
          </div>
        ) : (
          // 利用者がタップして交換済みにできる操作は用意しない。
          // スタッフがこの枠を長押しした場合だけ、確認画面を開く。
          <div
            {...longPress}
            className="staff-long-press w-full rounded-xl border-2 border-dashed border-[#ccc] bg-[#fafafa] px-4 py-5 text-xs font-bold text-[#999]"
          >
            {m.exchange.longPressHint}
          </div>
        )}
      </main>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[320px] rounded-2xl bg-white p-6 text-center shadow-xl">
            <p className="text-base font-bold text-[#2f2a24]">{m.exchange.confirmQuestion}</p>

            <div className="mt-6 flex flex-col gap-3">
              <Button variant="exchange-btn" onClick={handleConfirm}>
                {m.exchange.confirmButton}
              </Button>
              <Button variant="ghost" onClick={closeConfirm}>
                {m.common.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
