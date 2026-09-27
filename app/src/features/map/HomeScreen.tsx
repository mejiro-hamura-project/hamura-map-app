import { useEffect, useMemo, useState } from 'react';
import { useMaps, useSpots, useTimetable } from '../../api';
import type { Booth, Spot, Store } from '../../shared/types';
import { useClock } from '../../shared/context/DevClockContext';
import { matchesSpotQuery } from '../../shared/utils/spotSearch';
import { getCurrentProgramStatus, getStageStatusText, getTimetableForToday } from '../../shared/utils/timetable';
import { MOCK_VENUE_HOTSPOTS } from '../../mocks/venueHotspots';
import { BOOTHS_BY_VENUE } from '../../mocks/booths';
import { STORES_BY_VENUE } from '../../mocks/stores';
import VenueHeader from './components/VenueHeader';
import MapCanvas from './components/MapCanvas';
import SearchSheet from './components/SearchSheet';

export default function HomeScreen() {
  const { maps, isLoading: isLoadingMaps } = useMaps();
  const { spots, isLoading: isLoadingSpots } = useSpots();
  const { timetable } = useTimetable();
  const { now } = useClock();
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeGenreId, setActiveGenreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrVisible, setQrVisible] = useState(true);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [selectedStoreSpot, setSelectedStoreSpot] = useState<Spot | null>(null);

  useEffect(() => {
    if (!currentMapId && maps.length > 0) {
      setCurrentMapId(maps[0].id);
    }
  }, [maps, currentMapId]);

  // 地図を切り替えたら、開いていたブース・店のポップアップは閉じる
  useEffect(() => {
    setSelectedBooth(null);
    setSelectedStoreSpot(null);
  }, [currentMapId]);

  const currentMap = maps.find((venueMap) => venueMap.id === currentMapId) ?? null;
  const currentBooths = currentMap?.venueId != null ? (BOOTHS_BY_VENUE[currentMap.venueId] ?? []) : [];
  const currentStores = currentMap?.venueId != null ? (STORES_BY_VENUE[currentMap.venueId] ?? []) : [];

  // 「全体」地図（venueId未設定）は全スポットを表示。会場別の地図はその会場番号のスポットだけに絞り込む。
  const mapSpots = useMemo(() => {
    if (!currentMap) return [];
    if (currentMap.venueId == null) return spots;
    return spots.filter((spot) => spot.venueId === currentMap.venueId);
  }, [spots, currentMap]);
  const shopSpots = useMemo(() => mapSpots.filter((spot) => spot.categoryId !== 'stamp-qr'), [mapSpots]);
  const qrSpots = useMemo(() => mapSpots.filter((spot) => spot.categoryId === 'stamp-qr'), [mapSpots]);

  // 検索は今選んでいる会場に関わらず、会場をまたいで全スポットから探す
  const allShopSpots = useMemo(() => spots.filter((spot) => spot.categoryId !== 'stamp-qr'), [spots]);

  // ステージ（メイン/サブ）の「今の状態」。イベント一覧のタイムテーブルと同じ共通ロジックで判定するため、
  // ここでの結果は必ず一致する。上演中の演目が無い時間帯でも、常に何か表示されるようにする。
  const stageNowTitles = useMemo(() => {
    const todayTimetable = getTimetableForToday(timetable, now);
    const titles: Record<string, string> = {};
    if (!todayTimetable) return titles;
    for (const spot of spots) {
      if (!spot.stageKey) continue;
      const programs = todayTimetable.stages[spot.stageKey];
      const { current } = getCurrentProgramStatus(programs, now);
      titles[spot.id] = current ? `ただいま：${current.title}` : getStageStatusText(programs, now);
    }
    return titles;
  }, [spots, timetable, now]);

  const searchResults = useMemo<Spot[]>(() => {
    const query = searchQuery.trim();
    if (query) {
      return allShopSpots.filter((spot) => matchesSpotQuery(spot, query)).slice(0, 3);
    }
    if (activeGenreId) {
      return allShopSpots.filter((spot) => spot.genreId === activeGenreId);
    }
    return [];
  }, [allShopSpots, activeGenreId, searchQuery]);

  if (isLoadingMaps || isLoadingSpots) {
    return (
      <main className="flex flex-1 items-center justify-center text-sm text-sub">地図を読み込み中...</main>
    );
  }

  const selectedSpot = mapSpots.find((spot) => spot.id === selectedSpotId) ?? null;

  // 検索条件が入ったら「全体」地図に切り替える。会場をまたいで探せるようにするため。
  function switchToAllVenues() {
    const allVenuesMap = maps.find((venueMap) => venueMap.venueId == null);
    if (allVenuesMap) setCurrentMapId(allVenuesMap.id);
  }

  // 全体地図で会場エリアがタップされたときに、その会場の拡大地図に切り替える
  function handleSelectVenue(venueId: number) {
    const venueMapEntry = maps.find((venueMap) => venueMap.venueId === venueId);
    if (venueMapEntry) setCurrentMapId(venueMapEntry.id);
  }

  // ブースの店一覧から店がタップされたときに、既存のスポット詳細ポップアップで表示するための
  // 疑似スポットをその場で組み立てる（本物のSpotデータと混ぜず、地図上のピン等には影響しない）
  function handleSelectStore(store: Store) {
    setSelectedStoreSpot({
      id: `store-${store.style}-${store.code}`,
      name: store.name,
      categoryId: '',
      tagIds: [],
      genreId: store.genreId,
      description: store.detail,
      images: [],
      mapId: currentMap?.id ?? '',
      x: 0,
      y: 0,
      eventId: '',
    });
  }

  function handleToggleGenre(genreId: string) {
    setActiveGenreId((prev) => {
      const next = prev === genreId ? null : genreId;
      if (next) switchToAllVenues();
      return next;
    });
    setSearchQuery('');
  }

  function handleQueryChange(query: string) {
    setSearchQuery(query);
    if (query) {
      setActiveGenreId(null);
      switchToAllVenues();
    }
  }

  function handleSelectSearchResult(spotId: string) {
    setSelectedSpotId(spotId);
    setIsSearchOpen(false);
  }

  function handleToggleQrVisible() {
    setQrVisible((visible) => !visible);
    setSelectedSpotId((id) => {
      const spot = mapSpots.find((s) => s.id === id);
      // QRレイヤーを非表示にしたら、開いていたQRポップアップも閉じる
      return spot?.categoryId === 'stamp-qr' ? null : id;
    });
  }

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden pb-3">
      <VenueHeader maps={maps} currentMapId={currentMapId} onSelect={setCurrentMapId} />
      <MapCanvas
        venueMap={currentMap}
        shopSpots={shopSpots}
        qrSpots={qrSpots}
        qrVisible={qrVisible}
        stageNowTitles={stageNowTitles}
        venueHotspots={MOCK_VENUE_HOTSPOTS}
        booths={currentBooths}
        stores={currentStores}
        selectedBooth={selectedBooth}
        selectedStoreSpot={selectedStoreSpot}
        selectedSpot={selectedSpot}
        onSpotTap={setSelectedSpotId}
        onCloseSpot={() => setSelectedSpotId(null)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleQrVisible={handleToggleQrVisible}
        onSelectVenue={handleSelectVenue}
        onBoothTap={setSelectedBooth}
        onCloseBooth={() => setSelectedBooth(null)}
        onSelectStore={handleSelectStore}
        onCloseStoreSpot={() => setSelectedStoreSpot(null)}
      />
      {isSearchOpen && (
        <SearchSheet
          results={searchResults}
          activeGenreId={activeGenreId}
          query={searchQuery}
          onToggleGenre={handleToggleGenre}
          onQueryChange={handleQueryChange}
          onSelectSpot={handleSelectSearchResult}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </main>
  );
}
