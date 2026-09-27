import { useEffect } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes, useOutletContext } from 'react-router-dom';
import { useStampRally, type UseStampRally } from './hooks/useStampRally';
import { flushQueuedSync } from './lib/sheetApi';
import DemoResetButton from './components/DemoResetButton';
import NoticeScreen from './screens/NoticeScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import RegisterScreen from './screens/RegisterScreen';
import RallyScreen from './screens/RallyScreen';
import CameraScreen from './screens/CameraScreen';
import StampRevealScreen from './screens/StampRevealScreen';
import PhraseChallengeScreen from './screens/PhraseChallengeScreen';
import ExchangeScreen from './screens/ExchangeScreen';

function AppLayout() {
  const stampRally = useStampRally();

  // 電波不良などで送信できなかった進行状況の同期を、オンライン復帰時に再送する。
  useEffect(() => {
    flushQueuedSync();
    window.addEventListener('online', flushQueuedSync);
    return () => window.removeEventListener('online', flushQueuedSync);
  }, []);

  return (
    <>
      {/* デモ用「初めに戻る」: 全画面共通・左上。デモ用アプリのため常時表示。 */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] mx-auto flex max-w-[420px] flex-col items-start gap-2 p-2">
        <DemoResetButton onReset={stampRally.resetAll} />
      </div>
      <Outlet context={stampRally} />
    </>
  );
}

// Returning visitors who already registered skip the intro screens entirely
// and go straight back to where their progress lives, instead of being
// forced through notice/how-to/register (and re-registering) every reopen.
function RootRedirect() {
  const { registration } = useOutletContext<UseStampRally>();
  return <Navigate to={registration ? '/rally' : '/notice'} replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/notice" element={<NoticeScreen />} />
          <Route path="/howto" element={<HowToPlayScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/rally" element={<RallyScreen />} />
          <Route path="/camera" element={<CameraScreen />} />
          <Route path="/reveal" element={<StampRevealScreen />} />
          <Route path="/challenge" element={<PhraseChallengeScreen />} />
          <Route path="/exchange" element={<ExchangeScreen />} />
          <Route path="/result" element={<Navigate to="/exchange" replace />} />
          <Route path="*" element={<Navigate to="/notice" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
