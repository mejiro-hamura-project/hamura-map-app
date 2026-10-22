import { STAMP_RALLY_ROUTES } from '../routes';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useI18n } from '../i18n/useI18n';
import Sprig from '../components/Sprig';
import { BUTTON_ICONS } from '../buttonIcons';
import { formatStepInstruction } from '../howtoSteps';

// 手順番号の丸の色（デザインA案：アプリアイコンの赤・緑・黄色・青緑）。黄色は濃い文字で読みやすくする。
const STEP_BADGE_COLORS = [
  'bg-sr-red-strong text-white',
  'bg-sr-green-strong text-white',
  'bg-sr-yellow text-sr-ink',
  'bg-sr-red-strong text-white',
  'bg-sr-teal-strong text-white',
];

export default function HowToPlayScreen() {
  const navigate = useNavigate();
  const { m } = useI18n();

  return (
    <PageContainer>
      {/* 遊び方画面ではプログレスバーを表示しない（参加登録以降の画面で表示する） */}
      <Header />
      <main className="mt-auto flex min-h-0 flex-initial flex-col gap-3 overflow-y-auto px-5 pb-2 [@media(max-height:480px)]:gap-2">
        <div className="py-0.5 [@media(max-height:480px)]:sr-only">
          <h1 className="flex items-center justify-center gap-2 text-center text-[clamp(1.5rem,7.5vw,1.875rem)] leading-tight font-extrabold tracking-wide text-sr-ink">
            <Sprig />
            {/* 見出しの文言はそのまま */}
            <span className="min-w-0 text-balance">{m.howto.title}</span>
            <Sprig flip />
          </h1>
        </div>

        {/* ①〜⑤の見出しは、各画面上部の操作指示と同じ関数・同じ文言で表示する。
            高さの低い画面では、見出しと説明を1行にまとめて1画面に収める。 */}
        <ol className="flex flex-col gap-2.5 [@media(max-height:480px)]:gap-1.5">
          {m.flow.steps.map((step, i) => {
            const instruction = formatStepInstruction(i + 1, step.instruction);
            return (
              <li key={i} className="flex items-start gap-2.5 leading-snug">
                <span
                  className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.875rem] font-extrabold ${STEP_BADGE_COLORS[i % STEP_BADGE_COLORS.length]}`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  {/* 見出しは上部の操作指示と同じ文言。番号は左の丸で示すため、先頭の丸数字だけ省いて表示する。 */}
                  <p className="font-extrabold text-sr-ink [@media(max-height:480px)]:inline [@media(max-height:480px)]:text-sm">
                    <span className="sr-only">{instruction}</span>
                    <span aria-hidden="true">{step.instruction}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-sr-sub [@media(max-height:480px)]:ml-1.5 [@media(max-height:480px)]:inline">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </main>

      <div className="sticky bottom-0 mb-auto shrink-0 bg-sr-bg px-5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] [@media(max-height:480px)]:pt-1.5 [@media(max-height:480px)]:pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        <Button variant="howto" icon={BUTTON_ICONS.start} onClick={() => navigate(STAMP_RALLY_ROUTES.register)}>
          {m.common.start}
        </Button>
      </div>
    </PageContainer>
  );
}
