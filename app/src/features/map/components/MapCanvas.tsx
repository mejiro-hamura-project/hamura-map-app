import { useMemo } from 'react';
import type { Booth, Post, Spot, Store, VenueHotspot, VenueMap } from '../../../shared/types';
import ZoomPanView from '../../../shared/ui/ZoomPanView';
import StageNowBubble from './StageNowBubble';
import VenueHotspotArea from './VenueHotspotArea';
import AreaHotspotButton from './AreaHotspotButton';
import BoothButton from './BoothButton';
import BoothCodesPopup from './BoothCodesPopup';
import SpotPopup from './SpotPopup';
import SearchFab from './SearchFab';
import QrMarker from './QrMarker';
import QrPopup from './QrPopup';
import MapLegendToggle from './MapLegendToggle';

/** 地図上で光らせて示すスポット。店ならブースの色と記号、エリアならスポットid。focus はそこへ寄せる位置（会場地図上の％） */
export type MapHighlight = {
  spot: Spot;
  boothStyle?: Booth['style'];
  boothCodes?: string[];
  areaSpotId?: string;
  focus: { x: number; y: number };
};

type MapCanvasProps = {
  venueMap: VenueMap | null;
  shopSpots: Spot[];
  qrSpots: Spot[];
  qrVisible: boolean;
  selectedSpot: Spot | null;
  /** ステージ（メイン/サブ）スポットのid→今の演目名。無ければ吹き出しを出さない */
  stageNowTitles?: Record<string, string>;
  /** 「全体」地図の上に置く、会場（第1〜第4）のタップ範囲 */
  venueHotspots?: VenueHotspot[];
  /** 会場表示のときだけ使う、範囲（area）を持つスポット。会場地図の上に透明なタップ範囲として置く */
  areaSpots?: Spot[];
  /** 検索で選ばれ、地図上で光らせて示しているスポット（店・エリア）。無ければ何も光らせない */
  highlight?: MapHighlight | null;
  /** 光らせているスポットの詳細を開く */
  onOpenHighlightDetail?: () => void;
  /** 光らせるのをやめる */
  onClearHighlight?: () => void;
  /** 会場表示のときだけ使う、配置ツールのブース一覧 */
  booths?: Booth[];
  /** ブースの記号に紐づく、この会場の店データ */
  stores?: Store[];
  /** タップ中のブース。無ければブースのポップアップは出さない */
  selectedBooth: Booth | null;
  /** ブースの店一覧からタップされた店の詳細。無ければ詳細ポップアップは出さない */
  selectedStoreSpot: Spot | null;
  /** 店の詳細ポップアップに口コミを出すための投稿一覧 */
  posts?: Post[];
  onSpotTap: (spotId: string) => void;
  onCloseSpot: () => void;
  onOpenSearch: () => void;
  onToggleQrVisible: () => void;
  onSelectVenue: (venueId: number) => void;
  onBoothTap: (booth: Booth) => void;
  onAreaTap?: (spotId: string) => void;
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
  areaSpots = [],
  highlight = null,
  onOpenHighlightDetail,
  onClearHighlight,
  booths = [],
  stores = [],
  selectedBooth,
  selectedStoreSpot,
  posts = [],
  onSpotTap,
  onCloseSpot,
  onOpenSearch,
  onToggleQrVisible,
  onSelectVenue,
  onBoothTap,
  onAreaTap,
  onCloseBooth,
  onSelectStore,
  onCloseStoreSpot,
}: MapCanvasProps) {
  const isSelectedQr = selectedSpot?.categoryId === 'stamp-qr';
  // スタンプQRは「全体」地図（venueId未設定）のときだけ表示する
  const isAllVenues = venueMap?.venueId == null;

  // 光らせたブース・エリアへ寄せる位置。highlight が変わるたびに新しいオブジェクトにして、ZoomPanView に適用させる
  const focus = useMemo(
    () => (highlight ? { x: highlight.focus.x, y: highlight.focus.y, scale: 2 } : null),
    [highlight],
  );

  return (
    <div className="relative mx-3.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-xl border border-t-0 border-line bg-[#f7f9f4]">
      {/* 案内文は地図に重ねず、地図の上に帯として置く（地図の上端のブースに文字がかぶらないように） */}
      <div className="shrink-0 border-b border-line bg-white/95 px-3 py-1 text-center text-[10px] font-bold text-sub">
        {isAllVenues ? '会場をタップすると、その会場を拡大できます' : 'ブースやエリア名をタップすると、詳細が見られます'}
      </div>
      {highlight ? (
        <div className="absolute bottom-4 left-3 right-[84px] z-[16] flex items-center gap-2 rounded-2xl border-2 border-[#ffc400] bg-white px-3 py-2 shadow-lg">
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold text-sub">選んだ場所はここです</span>
            <span className="block truncate text-xs font-extrabold">{highlight.spot.name}</span>
          </span>
          <button
            type="button"
            onClick={onOpenHighlightDetail}
            className="shrink-0 rounded-full bg-brand-blue px-3 py-1.5 text-[11px] font-bold text-white"
          >
            詳細
          </button>
          <button
            type="button"
            onClick={onClearHighlight}
            aria-label="表示を消す"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1f2f4] text-xs text-[#8a9098]"
          >
            ✕
          </button>
        </div>
      ) : isAllVenues ? (
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
      <ZoomPanView key={venueMap?.id ?? 'none'} className="min-h-0 w-full flex-1" focus={focus}>
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
              areaSpots.map(
                (spot) =>
                  spot.area && (
                    <AreaHotspotButton
                      key={spot.id}
                      spot={spot}
                      area={spot.area}
                      highlighted={highlight?.areaSpotId === spot.id}
                      onTap={() => onAreaTap?.(spot.id)}
                    />
                  ),
              )}
            {!isAllVenues &&
              booths.map((booth, index) => (
                <BoothButton
                  key={index}
                  booth={booth}
                  highlightCodes={highlight?.boothStyle === booth.style ? highlight.boothCodes : undefined}
                  onTap={() => onBoothTap(booth)}
                />
              ))}
          </div>
        )}
      </ZoomPanView>
      {selectedSpot &&
        (isSelectedQr
          ? isAllVenues && <QrPopup spot={selectedSpot} onClose={onCloseSpot} />
          : <SpotPopup spot={selectedSpot} posts={posts} onClose={onCloseSpot} />)}
      {selectedBooth && (
        <BoothCodesPopup
          booth={selectedBooth}
          stores={stores}
          onSelectStore={onSelectStore}
          onClose={onCloseBooth}
        />
      )}
      {selectedStoreSpot && <SpotPopup spot={selectedStoreSpot} posts={posts} onClose={onCloseStoreSpot} />}
      <SearchFab onClick={onOpenSearch} />
    </div>
  );
}
