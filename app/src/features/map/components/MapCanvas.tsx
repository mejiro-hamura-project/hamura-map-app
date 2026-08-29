import type { Spot, VenueMap } from '../../../shared/types';
import ZoomPanView from '../../../shared/ui/ZoomPanView';
import SpotPin from './SpotPin';
import SpotPopup from './SpotPopup';
import SearchFab from './SearchFab';
import QrMarker from './QrMarker';
import QrPopup from './QrPopup';
import MapLegendToggle from './MapLegendToggle';

type MapCanvasProps = {
  venueMap: VenueMap | null;
  shopSpots: Spot[];
  qrSpots: Spot[];
  qrVisible: boolean;
  selectedSpot: Spot | null;
  highlightedSpotIds?: string[];
  onSpotTap: (spotId: string) => void;
  onCloseSpot: () => void;
  onOpenSearch: () => void;
  onToggleQrVisible: () => void;
};

export default function MapCanvas({
  venueMap,
  shopSpots,
  qrSpots,
  qrVisible,
  selectedSpot,
  highlightedSpotIds = [],
  onSpotTap,
  onCloseSpot,
  onOpenSearch,
  onToggleQrVisible,
}: MapCanvasProps) {
  const isSelectedQr = selectedSpot?.categoryId === 'stamp-qr';

  return (
    <div className="relative mx-3.5 min-h-0 flex-1 overflow-hidden rounded-b-xl border border-t-0 border-line bg-[#f7f9f4]">
      <MapLegendToggle visible={qrVisible} onToggle={onToggleQrVisible} />
      <ZoomPanView className="h-full w-full">
        {venueMap && (
          // 地図画像と同じ縦横比の枠。ピンはこの枠の中に置くことで、必ず画像の上に重なる。
          <div className="relative w-full" style={{ aspectRatio: `${venueMap.width} / ${venueMap.height}` }}>
            <img
              src={venueMap.imageUrl}
              alt={venueMap.name}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
            />
            {shopSpots.map((spot) => (
              <SpotPin
                key={spot.id}
                spot={spot}
                highlighted={highlightedSpotIds.includes(spot.id)}
                onTap={() => onSpotTap(spot.id)}
              />
            ))}
            {qrVisible && qrSpots.map((spot) => <QrMarker key={spot.id} spot={spot} onTap={() => onSpotTap(spot.id)} />)}
          </div>
        )}
      </ZoomPanView>
      {selectedSpot &&
        (isSelectedQr ? (
          <QrPopup spot={selectedSpot} onClose={onCloseSpot} />
        ) : (
          <SpotPopup spot={selectedSpot} onClose={onCloseSpot} />
        ))}
      <SearchFab onClick={onOpenSearch} />
    </div>
  );
}
