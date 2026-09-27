import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useI18n } from '../i18n/useI18n';

export default function HowToPlayScreen() {
  const navigate = useNavigate();
  const { m } = useI18n();

  return (
    <PageContainer>
      <Header />
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pb-8">
        <div className="rounded-2xl border-2 border-howto bg-[#eaf7f0] px-4 py-3">
          <h1 className="text-center text-lg font-bold text-howto">{m.howto.title}</h1>
        </div>

        <ol className="space-y-5">
          {m.howto.steps.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-howto text-sm font-bold text-white">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#2f2a24]">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#4a4038]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </main>

      <div className="sticky bottom-0 border-t border-[#eee] bg-white px-6 py-4">
        <Button variant="howto" onClick={() => navigate('/register')}>
          {m.common.start}
        </Button>
      </div>
    </PageContainer>
  );
}
