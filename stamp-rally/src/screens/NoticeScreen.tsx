import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import type { UseStampRally } from '../hooks/useStampRally';

export default function NoticeScreen() {
  const navigate = useNavigate();
  const { resetAll } = useOutletContext<UseStampRally>();

  const handleReset = () => {
    if (window.confirm('進行状況（スタンプ・登録情報・交換履歴）をすべて消去して最初からやり直しますか？')) {
      resetAll();
    }
  };

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pb-8">
        <div className="rounded-2xl border-2 border-notice bg-[#fdecea] px-4 py-3">
          <h1 className="text-center text-lg font-bold text-notice">注意事項</h1>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-[#4a4038]">
          <section>
            <h2 className="mb-1 font-bold text-notice">安全に関するお願い</h2>
            {/* TODO: 本文は仮テキストです。差し替え可能 */}
            <p>
              境内は多くの参拝者で賑わいます。走ったり、他の参拝者にぶつかったりしないよう、周囲に気をつけてお楽しみください。スマートフォンを見ながらの歩行は大変危険ですので、立ち止まってご利用ください。
            </p>
          </section>

          <section>
            <h2 className="mb-1 font-bold text-notice">個人情報について</h2>
            {/* TODO: 本文は仮テキストです。差し替え可能 */}
            <p>
              ご登録いただいた情報は、本イベントの運営・景品交換の確認・統計目的にのみ使用し、それ以外の目的では使用いたしません。第三者への提供は行いません。
            </p>
          </section>

          <section>
            <h2 className="mb-1 font-bold text-notice">その他</h2>
            {/* TODO: 本文は仮テキストです。差し替え可能 */}
            <p>
              景品の交換は数に限りがあり、なくなり次第終了とさせていただく場合がございます。あらかじめご了承ください。
            </p>
          </section>
        </div>

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
        <Button variant="notice" onClick={() => navigate('/howto')}>
          スタート
        </Button>
      </div>
    </PageContainer>
  );
}
