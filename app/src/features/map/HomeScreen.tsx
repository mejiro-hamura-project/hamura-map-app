import { useEffect, useMemo, useState } from 'react';
import { useMaps, useSpots, useTimetable } from '../../api';
import type { Booth, Spot, Store } from '../../shared/types';
import { useClock } from '../../shared/context/DevClockContext';
import { matchesSpotQuery } from '../../shared/utils/spotSearch';
import { allMapToVenuePercent } from '../../shared/utils/mapCoords';
import { rememberRecentSpot } from '../../shared/utils/recentSpots';
import { getCurrentProgramStatus, getStageStatusText, getTimetableForToday } from '../../shared/utils/timetable';
import { MOCK_VENUE_HOTSPOTS } from '../../mocks/venueHotspots';
import { BOOTHS_BY_VENUE } from '../../mocks/booths';
import { STORES, findStoreSpot, findStoreSpotBooth } from '../../mocks/stores';
import { findProgramStageSpot } from '../../mocks/programSpots';
import VenueHeader from './components/VenueHeader';
import MapCanvas, { type MapHighlight } from './components/MapCanvas';
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
  const [highlight, setHighlight] = useState<MapHighlight | null>(null);

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
  const currentStores = currentMap?.venueId != null ? STORES : [];

  // 「全体」地図（venueId未設定）は全スポットを表示。会場別の地図はその会場番号のスポットだけに絞り込む。
  const mapSpots = useMemo(() => {
    if (!currentMap) return [];
    if (currentMap.venueId == null) return spots;
    return spots.filter((spot) => spot.venueId === currentMap.venueId);
  }, [spots, currentMap]);
  // 地図の上に出す（ステージの吹き出し等）スポット。スポットの位置は「全体」地図上の％なので、
  // 会場の地図を表示しているときは、その会場の地図上の位置に変換してから渡す
  const shopSpots = useMemo(() => {
    const spotsOnMap = mapSpots.filter((spot) => spot.categoryId !== 'stamp-qr');
    const allMap = maps.find((venueMap) => venueMap.venueId == null);
    if (!currentMap || currentMap.venueId == null || !allMap) return spotsOnMap;
    return spotsOnMap.flatMap((spot) => {
      const point = allMapToVenuePercent(spot, currentMap, allMap);
      return point ? [{ ...spot, x: point.x, y: point.y }] : [];
    });
  }, [mapSpots, maps, currentMap]);
  // 範囲（area）を持つスポットのうち、今表示している会場地図の上に置くもの。
  // 大きい範囲から順に並べ、プレイランドの中の枠のように内側にある小さい範囲を後から（上に）描いて押せるようにする
  const areaSpots = useMemo(() => {
    if (!currentMap) return [];
    const areaSize = (spot: Spot) => (spot.area ? spot.area.width * spot.area.height : 0);
    return spots
      .filter((spot) => spot.area?.mapId === currentMap.id)
      .sort((a, b) => areaSize(b) - areaSize(a));
  }, [spots, currentMap]);
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
      // 仕様書では候補は3件程度だが、演目（同じ団体が両日・複数回出る）も対象になったため、結果欄に収まる10件まで出す
      return allShopSpots.filter((spot) => matchesSpotQuery(spot, query)).slice(0, 10);
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
    setHighlight(null);
  }

  // 全体地図で会場エリアがタップされたときに、その会場の拡大地図に切り替える
  function handleSelectVenue(venueId: number) {
    const venueMapEntry = maps.find((venueMap) => venueMap.venueId === venueId);
    if (venueMapEntry) setCurrentMapId(venueMapEntry.id);
    setHighlight(null);
  }

  // 会場名の帯から地図を切り替えたときは、検索で光らせていた表示をやめる
  function handleSelectMap(mapId: string) {
    setCurrentMapId(mapId);
    setHighlight(null);
  }

  // ブースの店一覧から店がタップされたときに、その店のスポット（検索・口コミと共通）を詳細ポップアップで出す
  function handleSelectStore(store: Store) {
    setSelectedStoreSpot(findStoreSpot(store) ?? null);
  }

  // ブースとエリア（スポット詳細）のポップアップは同じ位置に出るため、片方を開いたらもう片方は閉じる
  function handleBoothTap(booth: Booth) {
    setSelectedSpotId(null);
    setSelectedBooth(booth);
  }

  function handleAreaTap(spotId: string) {
    setSelectedBooth(null);
    setSelectedStoreSpot(null);
    setSelectedSpotId(spotId);
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

  // 検索結果が選ばれたとき。店（ブース）・エリア・ステージとその演目は、その会場の地図に切り替えて
  // 該当の場所を光らせ、そこへ寄せる。それ以外（場所を持たないもの）は全体地図のまま詳細ポップアップを出す。
  function handleSelectSearchResult(spotId: string) {
    setIsSearchOpen(false);
    // 検索で選んだものも「最近見た」に入れる（口コミの投稿画面で検索せずに選べるようにする）
    rememberRecentSpot(spotId);
    const spot = spots.find((s) => s.id === spotId);
    const booth = findStoreSpotBooth(spotId);
    const boothMap = booth && maps.find((venueMap) => venueMap.venueId === booth.venueId);
    if (spot && booth && boothMap) {
      setSelectedSpotId(null);
      setCurrentMapId(boothMap.id);
      setHighlight({ spot, boothStyle: booth.style, boothCodes: booth.codes, focus: { x: booth.x, y: booth.y } });
      return;
    }
    // ステージの演目は、演目を行うステージの範囲を光らせる。エリア・ステージは自分の範囲を光らせる
    const areaSpot = findProgramStageSpot(spotId) ?? spot;
    const area = areaSpot?.area;
    const areaMap = area && maps.find((venueMap) => venueMap.id === area.mapId);
    if (spot && areaSpot && area && areaMap) {
      setSelectedSpotId(null);
      setCurrentMapId(areaMap.id);
      setHighlight({
        spot,
        areaSpotId: areaSpot.id,
        focus: { x: area.x + area.width / 2, y: area.y + area.height / 2 },
      });
      return;
    }
    setHighlight(null);
    setSelectedSpotId(spotId);
  }

  // 光らせている店・エリアの「詳細」ボタン。店はブースの店と同じ詳細、エリアはスポットの詳細を開く
  function handleOpenHighlightDetail() {
    if (!highlight) return;
    setSelectedBooth(null);
    if (findStoreSpotBooth(highlight.spot.id)) {
      setSelectedStoreSpot(highlight.spot);
    } else {
      setSelectedSpotId(highlight.spot.id);
    }
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
      <VenueHeader maps={maps} currentMapId={currentMapId} onSelect={handleSelectMap} />
      <MapCanvas
        venueMap={currentMap}
        shopSpots={shopSpots}
        qrSpots={qrSpots}
        qrVisible={qrVisible}
        stageNowTitles={stageNowTitles}
        venueHotspots={MOCK_VENUE_HOTSPOTS}
        areaSpots={areaSpots}
        highlight={highlight}
        onOpenHighlightDetail={handleOpenHighlightDetail}
        onClearHighlight={() => setHighlight(null)}
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
        onBoothTap={handleBoothTap}
        onAreaTap={handleAreaTap}
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
