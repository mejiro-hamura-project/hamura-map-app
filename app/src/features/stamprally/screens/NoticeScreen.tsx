import { STAMP_RALLY_ROUTES } from '../routes';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useI18n } from '../i18n/useI18n';
import Sprig from '../components/Sprig';
import { BUTTON_ICONS } from '../buttonIcons';

// app側のpublic/stamprally/S__8216579.jpg（注意事項画面の画像）をBASE_URL経由で参照する。
const APP_ICON_SRC = `${import.meta.env.BASE_URL}stamprally/S__8216579.jpg`;

export default function NoticeScreen() {
  const navigate = useNavigate();
  const { m } = useI18n();

  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [checked, setChecked] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = boxRef.current;
    if (!el) return;
    const atEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
    if (atEnd) setScrolledToEnd(true);
  };

  useEffect(() => {
    // 文章が短くて最初からスクロールの必要が無い場合は、最後まで読んだものとして扱う。
    const el = boxRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 4) setScrolledToEnd(true);
  }, []);

  const handleStart = () => {
    if (!scrolledToEnd || !checked) return;
    navigate(STAMP_RALLY_ROUTES.howto);
  };

  return (
    <PageContainer>
      {/* 注意事項画面ではプログレスバーを表示しない（参加登録以降の画面で表示する） */}
      <Header />
      {/* イラストと注意事項の枠は、画面の高さに合わせて伸び縮みする（固定の半分ずつにしない）。
          注意事項の枠の中は縦スクロールでき、画面の高さが足りないときはこの領域全体も
          スクロールできるので、「確認しました」が隠れて先へ進めなくなることがない。 */}
      {/* 画面の高さが足りないときは、この内容部分がスクロールする（アイコン拡大分）。
          画面右端に出ていた、この部分のスクロールバーだけを非表示にする（スクロール自体は指・ホイールで可能）。
          注意事項欄の中のスクロールバーはそのまま残す。 */}
      <div className="mt-auto flex min-h-0 flex-initial flex-col overflow-y-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex shrink-0 items-center justify-center py-2">
          <img
            src={APP_ICON_SRC}
            alt={m.notice.iconAlt}
            className="h-[187px] w-[187px] object-contain mix-blend-multiply [@media(max-height:480px)]:h-[104px] [@media(max-height:480px)]:w-[104px]"
          />
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <h1 className="shrink-0 flex items-center justify-center gap-2 text-center text-[clamp(1.5rem,7.5vw,1.875rem)] leading-tight font-extrabold tracking-wide text-sr-ink">
            <Sprig />
            {/* 見出しの文言はそのまま */}
            <span className="min-w-0 text-balance">{m.notice.title}</span>
            <Sprig flip />
          </h1>

          {/* 注意事項欄の高さはアイコン拡大前と同じ（拡大前の「残りの高さ」と同じ式で固定し、アイコンの分で縮めない）。
              式の 85dvh は当時の領域の高さ（85％）で、領域を90％に広げた後も欄の大きさは変えないため据え置く。 */}
          <div
            ref={boxRef}
            onScroll={handleScroll}
            className="h-[max(120px,min(46dvh,calc(85dvh-319px)))] max-h-[46dvh] min-h-[120px] shrink-0 overflow-y-auto rounded-xl [@media(max-height:480px)]:h-[max(120px,min(46dvh,calc(85dvh-251px)))] border border-sr-line bg-white px-4 py-3 text-[1rem] leading-[1.75] tracking-[0.02em] text-sr-ink"
          >
            <div className="space-y-3.5">
              <section>
                <h2 className="mb-0.5 text-sm font-bold text-sr-red-strong">{m.notice.safetyHeading}</h2>
                <p>{m.notice.safetyBody}</p>
              </section>
              <section>
                <h2 className="mb-0.5 text-sm font-bold text-sr-red-strong">{m.notice.privacyHeading}</h2>
                <p>{m.notice.privacyBody}</p>
              </section>
              <section>
                <h2 className="mb-0.5 text-sm font-bold text-sr-red-strong">{m.notice.otherHeading}</h2>
                <p>{m.notice.otherBody}</p>
              </section>
              <section>
                <h2 className="mb-0.5 text-sm font-bold text-sr-red-strong">{m.notice.dataRetentionHeading}</h2>
                <p>{m.notice.dataRetentionBody}</p>
              </section>
            </div>
          </div>

          <label
            className={`flex shrink-0 items-center gap-2 text-sm font-bold ${
              scrolledToEnd ? 'text-sr-ink' : 'text-sr-sub opacity-60'
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={!scrolledToEnd}
              onChange={(e) => setChecked(e.target.checked)}
              className="h-5 w-5 accent-sr-red-strong"
            />
            確認しました
          </label>
        </div>
      </div>

      <div className="sticky bottom-0 mb-auto shrink-0 bg-sr-bg px-5 pt-1 pb-2 [@media(max-height:480px)]:py-2">
        <Button variant="notice" icon={BUTTON_ICONS.start} onClick={handleStart} disabled={!scrolledToEnd || !checked}>
          {m.common.start}
        </Button>
      </div>
    </PageContainer>
  );
}
