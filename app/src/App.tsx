import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import BottomNav from './shared/ui/BottomNav';
import { MapProviderRoot } from './shared/map';
import { DevClockProvider } from './shared/context/DevClockContext';
import HomeScreen from './features/map/HomeScreen';
import EventsScreen from './features/events/EventsScreen';
import StampRallyScreen from './features/stamprally/StampRallyScreen';
import PostsScreen from './features/posts/PostsScreen';
import { isStampRallyFullScreen, STAMP_RALLY_ROUTES } from './features/stamprally/routes';
import StampRallyLayout from './features/stamprally/StampRallyLayout';
import NoticeScreen from './features/stamprally/screens/NoticeScreen';
import HowToPlayScreen from './features/stamprally/screens/HowToPlayScreen';
import RegisterScreen from './features/stamprally/screens/RegisterScreen';
import RallyScreen from './features/stamprally/screens/RallyScreen';
import CameraScreen from './features/stamprally/screens/CameraScreen';
import StampRevealScreen from './features/stamprally/screens/StampRevealScreen';
import PhraseChallengeScreen from './features/stamprally/screens/PhraseChallengeScreen';
import ExchangeScreen from './features/stamprally/screens/ExchangeScreen';
import { StampRallyReadProvider } from './shared/integrations/stampRally';
import { stampRallyReadPort } from './features/stamprally/integrations/readPort';

function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="mx-auto flex h-dvh max-w-[420px] flex-col bg-bg">
      <div className="flex min-h-0 flex-1 flex-col">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/events" element={<EventsScreen />} />
          <Route path={STAMP_RALLY_ROUTES.entry} element={<StampRallyLayout />}>
            <Route index element={<StampRallyScreen />} />
            <Route path="notice" element={<NoticeScreen />} />
            <Route path="howto" element={<HowToPlayScreen />} />
            <Route path="register" element={<RegisterScreen />} />
            <Route path="rally" element={<RallyScreen />} />
            <Route path="camera" element={<CameraScreen />} />
            <Route path="reveal" element={<StampRevealScreen />} />
            <Route path="challenge" element={<PhraseChallengeScreen />} />
            <Route path="exchange" element={<ExchangeScreen />} />
            <Route path="result" element={<Navigate to={STAMP_RALLY_ROUTES.exchange} replace />} />
            <Route path="*" element={<Navigate to={STAMP_RALLY_ROUTES.entry} replace />} />
          </Route>
          <Route path="/posts" element={<PostsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isStampRallyFullScreen(pathname) && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DevClockProvider>
        <MapProviderRoot>
          <StampRallyReadProvider port={stampRallyReadPort}>
            <AppShell />
          </StampRallyReadProvider>
        </MapProviderRoot>
      </DevClockProvider>
    </BrowserRouter>
  );
}
