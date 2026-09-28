import { STAMP_RALLY_ROUTES } from '../routes';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useI18n } from '../i18n/useI18n';

// app側のpublic/stamprally/app-icon.pngをBASE_URL経由で参照する。
const APP_ICON_SRC = `${import.meta.env.BASE_URL}stamprally/app-icon.png`;

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
      <Header />
      {/* ページ全体はスクロールしない。イラスト側(上半分)と注意事項の枠(下半分)の
          領域自体は固定し、枠の中だけを縦スクロールできるようにする。 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-4">
        <div className="flex h-[50%] shrink-0 items-center justify-center overflow-hidden py-2">
          <img
            src={APP_ICON_SRC}
            alt={m.notice.iconAlt}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex h-[50%] shrink-0 flex-col gap-3 overflow-hidden">
          <h1 className="shrink-0 text-center text-lg font-bold text-stamprally-notice">{m.notice.title}</h1>

          <div
            ref={boxRef}
            onScroll={handleScroll}
            className="min-h-0 flex-1 overflow-y-auto rounded-2xl border-2 border-stamprally-notice bg-[#fdecea] p-4 text-base leading-relaxed text-[#4a4038]"
          >
            <div className="space-y-4">
              <section>
                <h2 className="mb-1 font-bold text-stamprally-notice">{m.notice.safetyHeading}</h2>
                <p>{m.notice.safetyBody}</p>
              </section>
              <section>
                <h2 className="mb-1 font-bold text-stamprally-notice">{m.notice.privacyHeading}</h2>
                <p>{m.notice.privacyBody}</p>
              </section>
              <section>
                <h2 className="mb-1 font-bold text-stamprally-notice">{m.notice.otherHeading}</h2>
                <p>{m.notice.otherBody}</p>
              </section>
              <section>
                <h2 className="mb-1 font-bold text-stamprally-notice">{m.notice.dataRetentionHeading}</h2>
                <p>{m.notice.dataRetentionBody}</p>
              </section>
            </div>
          </div>

          <label
            className={`flex shrink-0 items-center gap-2 text-sm font-bold ${
              scrolledToEnd ? 'text-[#4a4038]' : 'text-[#bbb]'
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={!scrolledToEnd}
              onChange={(e) => setChecked(e.target.checked)}
              className="h-5 w-5"
            />
            確認しました
          </label>
        </div>
      </div>

      <div className="sticky bottom-0 shrink-0 border-t border-[#eee] bg-white px-6 py-4">
        <Button variant="notice" onClick={handleStart} disabled={!scrolledToEnd || !checked}>
          {m.common.start}
        </Button>
      </div>
    </PageContainer>
  );
}
