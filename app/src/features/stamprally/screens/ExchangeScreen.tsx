import { STAMP_RALLY_ROUTES } from '../routes';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import Sprig from '../components/Sprig';
import { getCorrectPhrase } from '../data/checkpoints';
import type { UseStampRally } from '../hooks/useStampRally';
import { useDisplayMessages } from '../i18n/useDisplayMessages';
import { useLongPress } from '../hooks/useLongPress';
import { syncExchangeToSheet, syncProgress } from '../lib/sheetApi';
import { FLOW_STEP_BY_SCREEN } from '../howtoSteps';
import { BUTTON_ICONS } from '../buttonIcons';

export default function ExchangeScreen() {
  const navigate = useNavigate();
  const { registration, phraseSolved, prizeExchanged, exchangePrize, courseId, participantId, participantNumber } =
    useOutletContext<UseStampRally>();
  const m = useDisplayMessages(registration);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!phraseSolved || courseId === null) {
      navigate(STAMP_RALLY_ROUTES.rally, { replace: true });
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
      <Header step={FLOW_STEP_BY_SCREEN.exchange} />
      {/* 中身は上下の空白を 7:13 に分けて、やや上寄せで配置する（進捗バーの下が空きすぎないように）。
          justify-center と違い、高さが足りないときも上が切れずにスクロールできる。 */}
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-2 text-center before:grow-[7] before:content-[''] after:grow-[13] after:content-['']">
        <div className="@container flex w-full flex-col items-center gap-3 [@media(max-height:480px)]:gap-1.5">
          <img
            src={`${import.meta.env.BASE_URL}stamprally/S__8216579.jpg`}
            alt=""
            aria-hidden="true"
            // 白い背景を乗算で画面の背景色になじませる（画像そのものは変えない）。大きさは以前（96px）の約1.3倍。
            className="h-[125px] w-[125px] object-contain mix-blend-multiply [@media(max-height:700px)]:hidden"
          />
          {/* 「スタッフに見せる」案内はここ1か所だけ。完成した言葉より目立ちすぎないよう、文字を一回り小さくして淡い赤の帯にする。 */}
          <p className="w-full rounded-2xl border border-sr-red bg-sr-red-soft px-3 py-1.5 text-[1.125rem] leading-snug font-extrabold text-balance text-sr-red-strong [@media(max-height:480px)]:py-1 [@media(max-height:480px)]:text-[1rem]">
            {m.exchange.handToStaff}
          </p>

          {/* 完成した言葉：見出しは青緑、答えは緑で色を分ける。ほかの画面と同じ花と葉の飾りを見出しの左右に添える。 */}
          <div className="w-full rounded-2xl border-2 border-sr-green bg-white px-3 py-3 [@media(max-height:480px)]:py-1.5">
            <p className="flex items-center justify-center gap-2 text-sm font-extrabold text-sr-teal-strong">
              <Sprig />
              <span>{m.exchange.phraseLabel}</span>
              <Sprig flip />
            </p>
            <p className="mt-1 text-[min(2.5rem,calc((100cqw-28px)/7.6))] leading-tight font-bold tracking-wider whitespace-nowrap text-sr-green-strong [@media(max-height:480px)]:mt-0 [@media(max-height:480px)]:text-2xl">{phrase}</p>
          </div>

          {/* スタッフが確認しやすいよう、参加者番号も表示だけ行う（値は既存のものを読むだけ）。 */}
          {participantNumber !== null && (
            <p className="rounded-full border border-sr-line bg-white px-4 py-1 text-sm font-bold text-sr-ink">
              {m.rally.participantNumberLabel} <span className="text-base">No.{participantNumber}</span>
            </p>
          )}

          {/* 「スタッフに見せる」は上の案内と重なるため、ここでは受け取りの流れだけを1文で伝える。 */}
          <div className="w-full rounded-xl bg-white px-3 py-2 text-sm leading-snug text-sr-ink [@media(max-height:480px)]:py-1">
            <p className="text-balance">{m.exchange.staffNotice1}</p>
          </div>

          {prizeExchanged ? (
            <div className="w-full rounded-xl border border-sr-green bg-sr-green-soft px-4 py-3 text-lg font-bold text-sr-green-strong [@media(max-height:480px)]:py-2">
              {m.exchange.done}
            </div>
          ) : (
            // 利用者がタップして交換済みにできる操作は用意しない。
            // スタッフがこの領域を長押しした場合だけ、確認画面を開く。
            // 本番では説明文字も枠線も出さない（領域の大きさと長押しの判定はそのまま残す）。
            // 開発モードだけ、確認しやすいよう点線の枠と説明を出す（import.meta.env.DEV は本番ビルドで false に置き換わる）。
            <div
              {...longPress}
              data-testid="staff-long-press"
              className={`staff-long-press flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold [@media(max-height:480px)]:py-2 ${
                import.meta.env.DEV ? 'border-2 border-dashed border-sr-line bg-white text-sr-sub' : ''
              }`}
            >
              {import.meta.env.DEV && m.exchange.longPressHint}
            </div>
          )}
        </div>
      </main>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[320px] rounded-2xl bg-white p-6 text-center shadow-xl">
            <p className="text-base font-bold text-sr-ink">{m.exchange.confirmQuestion}</p>

            <div className="mt-6 flex flex-col gap-3">
              <Button variant="exchange-btn" icon={BUTTON_ICONS.prize} onClick={handleConfirm}>
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
