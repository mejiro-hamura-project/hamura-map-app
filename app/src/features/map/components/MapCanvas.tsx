import type { Booth, Spot, Store, VenueHotspot, VenueMap } from '../../../shared/types';
import ZoomPanView from '../../../shared/ui/ZoomPanView';
import StageNowBubble from './StageNowBubble';
import VenueHotspotArea from './VenueHotspotArea';
import BoothButton from './BoothButton';
import BoothCodesPopup from './BoothCodesPopup';
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
  /** ステージ（メイン/サブ）スポットのid→今の演目名。無ければ吹き出しを出さない */
  stageNowTitles?: Record<string, string>;
  /** 「全体」地図の上に置く、会場（第1〜第3）のタップ範囲 */
  venueHotspots?: VenueHotspot[];
  /** 会場表示のときだけ使う、配置ツールのブース一覧 */
  booths?: Booth[];
  /** ブースの記号に紐づく、この会場の店データ */
  stores?: Store[];
  /** タップ中のブース。無ければブースのポップアップは出さない */
  selectedBooth: Booth | null;
  /** ブースの店一覧からタップされた店の詳細。無ければ詳細ポップアップは出さない */
  selectedStoreSpot: Spot | null;
  onSpotTap: (spotId: string) => void;
  onCloseSpot: () => void;
  onOpenSearch: () => void;
  onToggleQrVisible: () => void;
  onSelectVenue: (venueId: number) => void;
  onBoothTap: (booth: Booth) => void;
  onCloseBooth: () => void;
  onSelectStore: (store: Store) => void;
  onCloseStoreSpot: () => void;
};

export default function MapCanvas({
  venueMap,
  shopSpots,
  qrSpots,
  qrVisible,
  selectedSpot,
  stageNowTitles = {},
  venueHotspots = [],
  booths = [],
  stores = [],
  selectedBooth,
  selectedStoreSpot,
  onSpotTap,
  onCloseSpot,
  onOpenSearch,
  onToggleQrVisible,
  onSelectVenue,
  onBoothTap,
  onCloseBooth,
  onSelectStore,
  onCloseStoreSpot,
}: MapCanvasProps) {
  const isSelectedQr = selectedSpot?.categoryId === 'stamp-qr';
  // スタンプQRは「全体」地図（venueId未設定）のときだけ表示する
  const isAllVenues = venueMap?.venueId == null;

  return (
    <div className="relative mx-3.5 min-h-0 flex-1 overflow-hidden rounded-b-xl border border-t-0 border-line bg-[#f7f9f4]">
      <div className="absolute left-1/2 top-2 z-[15] -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-white/95 px-3 py-1 text-[10px] font-bold text-sub shadow">
        {isAllVenues ? '会場をタップすると、その会場を拡大できます' : 'ブースをタップすると、お店の詳細が見られます'}
      </div>
      {isAllVenues ? (
        <MapLegendToggle visible={qrVisible} onToggle={onToggleQrVisible} />
      ) : (
        <div className="absolute bottom-4 left-5 z-[15] rounded-full border border-line bg-white/95 px-3 py-1.5 text-[11px] font-bold text-sub shadow">
          スタンプQRの場所は全体表示でご確認ください
        </div>
      )}
      {/*
        会場ごとに画像の縦横比が違うため、切り替えるたびに key を変えて
        ZoomPanView を作り直す＝ズーム・パンの状態を毎回リセットする。
        前の会場の拡大位置を引き継ぐと表示が崩れるため。
      */}
      <ZoomPanView key={venueMap?.id ?? 'none'} className="h-full w-full">
        {venueMap && (
          // 地図画像と同じ縦横比の枠。ピンはこの枠の中に置くことで、必ず画像の上に重なる。
          // containerType を指定し、この枠の実際の表示幅を基準にした単位（cqw）を
          // 子要素（ブースボタン等）で使えるようにする。
          <div
            className="relative w-full"
            style={{ aspectRatio: `${venueMap.width} / ${venueMap.height}`, containerType: 'inline-size' }}
          >
            <img
              src={venueMap.imageUrl}
              alt={venueMap.name}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
            />
            {shopSpots
              .filter((spot) => stageNowTitles[spot.id])
              .map((spot) => (
                <StageNowBubble
                  key={spot.id}
                  spot={spot}
                  nowPlayingTitle={stageNowTitles[spot.id]}
                  compact={isAllVenues}
                />
              ))}
            {isAllVenues &&
              qrVisible &&
              qrSpots.map((spot) => <QrMarker key={spot.id} spot={spot} onTap={() => onSpotTap(spot.id)} />)}
            {isAllVenues &&
              venueHotspots.map((hotspot) => (
                <VenueHotspotArea
                  key={hotspot.venueId}
                  hotspot={hotspot}
                  label={`第${hotspot.venueId}会場`}
                  onTap={() => onSelectVenue(hotspot.venueId)}
                />
              ))}
            {!isAllVenues &&
              booths.map((booth, index) => (
                <BoothButton key={index} booth={booth} onTap={() => onBoothTap(booth)} />
              ))}
          </div>
        )}
      </ZoomPanView>
      {selectedSpot &&
        (isSelectedQr
          ? isAllVenues && <QrPopup spot={selectedSpot} onClose={onCloseSpot} />
          : <SpotPopup spot={selectedSpot} onClose={onCloseSpot} />)}
      {selectedBooth && (
        <BoothCodesPopup
          booth={selectedBooth}
          stores={stores}
          onSelectStore={onSelectStore}
          onClose={onCloseBooth}
        />
      )}
      {selectedStoreSpot && <SpotPopup spot={selectedStoreSpot} onClose={onCloseStoreSpot} />}
      <SearchFab onClick={onOpenSearch} />
    </div>
  );
}
