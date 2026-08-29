import { useEffect, useMemo, useState } from 'react';
import { useMaps, useSpots } from '../../api';
import type { Spot } from '../../shared/types';
import { matchesSpotQuery } from '../../shared/utils/spotSearch';
import VenueHeader from './components/VenueHeader';
import MapCanvas from './components/MapCanvas';
import SearchSheet from './components/SearchSheet';

export default function HomeScreen() {
  const { maps, isLoading: isLoadingMaps } = useMaps();
  const { spots, isLoading: isLoadingSpots } = useSpots();
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrVisible, setQrVisible] = useState(true);

  useEffect(() => {
    if (!currentMapId && maps.length > 0) {
      setCurrentMapId(maps[0].id);
    }
  }, [maps, currentMapId]);

  const mapSpots = useMemo(() => spots.filter((spot) => spot.mapId === currentMapId), [spots, currentMapId]);
  const shopSpots = useMemo(() => mapSpots.filter((spot) => spot.categoryId !== 'stamp-qr'), [mapSpots]);
  const qrSpots = useMemo(() => mapSpots.filter((spot) => spot.categoryId === 'stamp-qr'), [mapSpots]);

  const searchResults = useMemo<Spot[]>(() => {
    const query = searchQuery.trim();
    if (query) {
      return shopSpots.filter((spot) => matchesSpotQuery(spot, query)).slice(0, 3);
    }
    if (activeTagId) {
      return shopSpots.filter((spot) => spot.tagIds.includes(activeTagId));
    }
    return [];
  }, [shopSpots, activeTagId, searchQuery]);

  if (isLoadingMaps || isLoadingSpots) {
    return (
      <main className="flex flex-1 items-center justify-center text-sm text-sub">地図を読み込み中...</main>
    );
  }

  const selectedSpot = mapSpots.find((spot) => spot.id === selectedSpotId) ?? null;
  const currentMap = maps.find((venueMap) => venueMap.id === currentMapId) ?? null;
  const highlightedSpotIds = activeTagId || searchQuery.trim() ? searchResults.map((spot) => spot.id) : [];

  function handleToggleTag(tagId: string) {
    setActiveTagId((prev) => (prev === tagId ? null : tagId));
    setSearchQuery('');
  }

  function handleQueryChange(query: string) {
    setSearchQuery(query);
    if (query) setActiveTagId(null);
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
        selectedSpot={selectedSpot}
        highlightedSpotIds={highlightedSpotIds}
        onSpotTap={setSelectedSpotId}
        onCloseSpot={() => setSelectedSpotId(null)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleQrVisible={handleToggleQrVisible}
      />
      {isSearchOpen && (
        <SearchSheet
          results={searchResults}
          activeTagId={activeTagId}
          query={searchQuery}
          onToggleTag={handleToggleTag}
          onQueryChange={handleQueryChange}
          onSelectSpot={handleSelectSearchResult}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </main>
  );
}
