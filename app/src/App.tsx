import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BottomNav from './shared/ui/BottomNav';
import { MapProviderRoot } from './shared/map';
import { DevClockProvider } from './shared/context/DevClockContext';
import HomeScreen from './features/map/HomeScreen';
import EventsScreen from './features/events/EventsScreen';
import StampRallyScreen from './features/stamprally/StampRallyScreen';
import PostsScreen from './features/posts/PostsScreen';

export default function App() {
  return (
    <BrowserRouter>
      <DevClockProvider>
        <MapProviderRoot>
          <div className="mx-auto flex h-dvh max-w-[420px] flex-col bg-bg">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/events" element={<EventsScreen />} />
              <Route path="/stamprally" element={<StampRallyScreen />} />
              <Route path="/posts" element={<PostsScreen />} />
            </Routes>
            <BottomNav />
          </div>
        </MapProviderRoot>
      </DevClockProvider>
    </BrowserRouter>
  );
}
