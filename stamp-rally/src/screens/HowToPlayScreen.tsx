import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';

const STEPS = [
  {
    // TODO: 本文・差し込み画像は仮です
    title: '境内のQRコードを探そう',
    body: '境内各所に設置された、スタンプラリー専用のQRコードを探してください。',
  },
  {
    title: 'カメラで撮影しよう',
    body: 'アプリのカメラでQRコードを読み取ります。読み取ると自動で判定されます。',
  },
  {
    title: '文字を集めよう',
    body: '読み取るごとに1文字ずつ手に入ります。7つ集めると、お題の言葉が完成します。',
  },
  {
    title: 'お題を完成させて交換しよう',
    body: '7つ全て集めたら、本殿にて景品と交換できます。スタッフにアプリの画面をご提示ください。',
  },
];

export default function HowToPlayScreen() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pb-8">
        <div className="rounded-2xl border-2 border-howto bg-[#eaf7f0] px-4 py-3">
          <h1 className="text-center text-lg font-bold text-howto">遊び方</h1>
        </div>

        <ol className="space-y-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-howto text-sm font-bold text-white">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#2f2a24]">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#4a4038]">{step.body}</p>
                <div className="mt-2 flex h-28 w-full items-center justify-center rounded-xl bg-[#f0f0f0] text-xs text-[#999]">
                  画像プレースホルダー
                </div>
              </div>
            </li>
          ))}
        </ol>
      </main>

      <div className="sticky bottom-0 border-t border-[#eee] bg-white px-6 py-4">
        <Button variant="howto" onClick={() => navigate('/register')}>
          スタート
        </Button>
      </div>
    </PageContainer>
  );
}
