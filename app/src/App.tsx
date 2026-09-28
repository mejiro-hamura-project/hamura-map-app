import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import BottomNav from './shared/ui/BottomNav';
import { MapProviderRoot } from './shared/map';
import { DevClockProvider } from './shared/context/DevClockContext';
import HomeScreen from './features/map/HomeScreen';
import EventsScreen from './features/events/EventsScreen';
import StampRallyScreen from './features/stamprally/StampRallyScreen';
import PostsScreen from './features/posts/PostsScreen';
import { isStampRallyFullScreen, STAMP_RALLY_ROUTES } from './features/stamprally/routes';

function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="mx-auto flex h-dvh max-w-[420px] flex-col bg-bg">
      <div className="flex min-h-0 flex-1 flex-col">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/events" element={<EventsScreen />} />
          <Route path={STAMP_RALLY_ROUTES.entry} element={<StampRallyScreen />} />
          <Route path="/posts" element={<PostsScreen />} />
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
          <AppShell />
        </MapProviderRoot>
      </DevClockProvider>
    </BrowserRouter>
  );
}
