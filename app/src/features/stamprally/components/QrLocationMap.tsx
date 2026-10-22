import { useState, type ReactNode } from 'react';
import { useMapZoom } from '../hooks/useMapZoom';
import { useMaps, useSpots } from '../../../api';
import { useMapProvider } from '../../../shared/map';
import type { Checkpoint } from '../types';
import { BUTTON_ICONS } from '../buttonIcons';

interface QrLocationMapProps {
  /** 参加者のコースのチェックポイント（useStampRally の courseId から取得したもの） */
  checkpoints: Checkpoint[];
  /** 取得済みのチェックポイントID（useStampRally.collectedIds）。表示に使うだけで変更しない */
  collectedIds: number[];
  title: string;
  collectedLabel: string;
  notCollectedLabel: string;
  /** 拡大中だけ出す「元の大きさに戻す」ボタンの文言 */
  resetLabel: string;
  /** 地図の上に重ねる一時的な表示（取得直後のお知らせなど） */
  overlay?: ReactNode;
}

function QrPin({
  number,
  done,
  small = false,
  highlight = false,
}: {
  number: number;
  done: boolean;
  small?: boolean;
  highlight?: boolean;
}) {
  // 地図画面のスタンプQRマーカー（features/map/components/QrMarker.tsx）と同じ配色・形。
  // 未取得＝紫、取得済み＝オレンジ＋白丸のチェックマーク（色だけに頼らない）。
  // highlight＝下のボタンで選んだ設置場所（赤い輪で囲んで大きく表示する）。
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-[9px] border-2 border-white font-extrabold text-white shadow-md [text-shadow:0_1px_1px_rgba(0,0,0,0.35)] ${
        small ? 'h-5 w-5 rounded-md border text-[11px]' : 'h-8 w-8 text-[0.875rem]'
      } ${done ? 'bg-brand-orange' : 'bg-brand-purple'} ${
        highlight ? 'scale-125 ring-4 ring-stamprally-step-current' : ''
      }`}
    >
      {number}
      {done && (
        <span
          className={`absolute flex items-center justify-center rounded-full bg-white font-extrabold text-[#c6791a] shadow [text-shadow:none] ${
            small ? '-right-1.5 -top-1.5 h-3.5 w-3.5 text-[9px]' : '-right-2 -top-2 h-5 w-5 text-[0.75rem]'
          }`}
        >
          ✓
        </span>
      )}
    </span>
  );
}

/**
 * QRコード設置場所の地図。既存のスポット情報（categoryId 'stamp-qr' / stampCheckpointId）と
 * 既存の地図画像をそのまま使い、新しい場所や座標は作らない。
 * 地図の領域は親の残りの高さいっぱいに広がり、地図画像は縦横比を保ったまま
 * その領域に収まる最大の大きさで表示する（コンテナクエリ単位で計算）。
 * 地図の下には各設置場所のボタンを並べ、押すと地図上の該当ピンを強調して場所名を表示する
 * （もう一度押すと解除）。選択は表示のためだけの一時的な状態で、保存はしない。
 */
export default function QrLocationMap({
  checkpoints,
  collectedIds,
  title,
  collectedLabel,
  notCollectedLabel,
  resetLabel,
  overlay,
}: QrLocationMapProps) {
  const { maps } = useMaps();
  const { spots } = useSpots();
  const mapProvider = useMapProvider();
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  // 地図の拡大・縮小・移動（表示だけの一時的な状態。取得状態や保存データには触れない）
  const zoom = useMapZoom();

  const qrSpots = spots
    .filter((spot) => spot.categoryId === 'stamp-qr' && spot.stampCheckpointId != null)
    .sort((a, b) => (a.stampCheckpointId ?? 0) - (b.stampCheckpointId ?? 0));
  const venueMap = maps.find((m) => m.id === qrSpots[0]?.mapId);
  const spotsOnMap = venueMap ? qrSpots.filter((spot) => spot.mapId === venueMap.id) : [];

  // 取得済みの設置位置番号（1〜7）。地図画面へ取得状況を渡している既存の read adapter
  // （integrations/readPort.ts）と同じ対応（phraseIndex + 1）で求める。
  const collectedPositions = new Set(
    checkpoints.filter((c) => collectedIds.includes(c.id)).map((c) => c.phraseIndex + 1),
  );

  return (
    <div className="flex min-w-0 flex-[1_0_auto] flex-col gap-2 [@media(max-height:480px)]:gap-1">
      <section
        data-qr-map
        aria-label={title}
        className="relative min-h-0 flex-[1_0_140px] overflow-hidden rounded-2xl border border-sr-line bg-[#f7f9f4] [container-type:size]"
      >
        {/* 2本指のピンチで拡大・縮小、1本指のドラッグで移動（PCではホイールでも拡大・縮小）。
            操作を受けるのは地図の領域だけで、画面のほかの部分のスクロールやタッチ操作には影響しない。 */}
        <div
          ref={zoom.ref}
          {...zoom.handlers}
          data-qr-map-viewport
          className="absolute inset-0 origin-top-left touch-none select-none"
          style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})` }}
        >
        {venueMap && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `min(100cqw, calc(100cqh * ${venueMap.width} / ${venueMap.height}))`,
              height: `min(100cqh, calc(100cqw * ${venueMap.height} / ${venueMap.width}))`,
            }}
          >
            <img
              src={venueMap.imageUrl}
              alt={venueMap.name}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
            />
            {spotsOnMap.map((spot) => {
              const position = mapProvider.getPosition(spot);
              const number = spot.stampCheckpointId as number;
              const done = collectedPositions.has(number);
              const selected = spot.id === selectedSpotId;
              const dimmed = selectedSpotId !== null && !selected;
              // 場所名の寄せ方：地図の左端・右端に近いピンでは、名前が地図の外へ切れないよう内側へ寄せる。
              const leftPercent = position.left.endsWith('%') ? parseFloat(position.left) : 50;
              const labelAlign = leftPercent < 25 ? 'left-0' : leftPercent > 75 ? 'right-0' : 'left-1/2 -translate-x-1/2';
              return (
                <span
                  key={spot.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-opacity ${selected ? 'z-10' : ''} ${dimmed ? 'opacity-40' : ''}`}
                  // 拡大してもピンと場所名の大きさは変えない（地図だけを拡大する）
                  style={{ left: position.left, top: position.top, scale: String(1 / zoom.scale) }}
                  role="img"
                  aria-label={`${spot.name}：${done ? collectedLabel : notCollectedLabel}`}
                >
                  <QrPin number={number} done={done} highlight={selected} />
                  {/* 場所名（既存のスポット名をそのまま表示）。地図が狭いときは番号付きのピンだけにするが、
                      ボタンで選んだ場所の名前は常に表示する。 */}
                  <span
                    className={`absolute top-full whitespace-nowrap rounded px-1 text-[0.75rem] font-bold leading-4 shadow-sm ${labelAlign} ${
                      selected
                        ? 'mt-1.5 block bg-stamprally-step-current text-white'
                        : `mt-0.5 hidden @min-[260px]:block ${done ? 'bg-[#fff3e0] text-[#a85a00]' : 'bg-white/95 text-[#2f2a24]'}`
                    }`}
                    aria-hidden="true"
                  >
                    {spot.name}
                  </span>
                </span>
              );
            })}
          </div>
        )}
        </div>
        <h2 className="absolute left-2 top-2 rounded-full border border-sr-line bg-white/95 px-2.5 py-0.5 text-xs font-extrabold text-sr-ink [@media(max-height:480px)]:text-[0.875rem]">
          {title}
        </h2>
        {zoom.scale > 1 && (
          <button
            type="button"
            onClick={zoom.reset}
            className="absolute right-2 top-2 rounded-full border border-sr-line bg-white/95 px-2.5 py-0.5 text-xs font-extrabold text-sr-ink [@media(max-height:480px)]:text-[0.875rem]"
          >
            {resetLabel}
          </button>
        )}
        {overlay}
      </section>

      {/* 各QRコードの設置場所ボタン（以前の一覧と同じ内容：ピン・場所名・取得状態）。
          押すと地図上の該当ピンを強調して場所名を出す。
          7個全体で画面の高さの5分の1（20dvh、最大152px）に収まるよう、2列4段の高さを固定して
          各ボタンは1行（ピン・場所名・取得状態）で表示する。ボタン一覧の幅が360px未満では1行に収まらないため、
          取得状態の文字を省く（カードの色とピンの✓で分かる。読み上げ用ラベルには状態を含める）。
          高さの低い横向きではピンだけを4個ずつ2段に並べる（1列に7個だとピンがボタンからはみ出すため）。
          ボタンの高さは固定せず中身（場所名・取得状態）に合わせる。 */}
      <ul className="@container grid shrink-0 grid-cols-2 gap-1 [@media(max-height:480px)]:grid-cols-4">
        {spotsOnMap.map((spot) => {
          const number = spot.stampCheckpointId as number;
          const done = collectedPositions.has(number);
          const selected = spot.id === selectedSpotId;
          return (
            <li key={spot.id} className="min-h-0 min-w-0">
              <button
                type="button"
                aria-pressed={selected}
                aria-label={`${spot.name}：${done ? collectedLabel : notCollectedLabel}`}
                onClick={() => setSelectedSpotId(selected ? null : spot.id)}
                className={`flex h-full min-h-11 w-full min-w-0 items-center gap-1 rounded-lg border px-1.5 py-1 text-left @max-[300px]:px-1 [@media(max-height:480px)]:justify-center [@media(max-height:480px)]:gap-0 [@media(max-height:480px)]:min-h-8 [@media(max-height:480px)]:px-0 [@media(max-height:480px)]:py-1 ${
                  done ? 'border-white/70 bg-sr-teal-location' : 'border-transparent bg-sr-teal-location'
                } ${selected ? 'ring-2 ring-sr-red-strong ring-offset-1 ring-offset-sr-bg' : ''}`}
              >
                <span className="shrink-0 text-[0.875rem] leading-none [@media(max-height:480px)]:hidden" aria-hidden="true">
                  {BUTTON_ICONS.qrLocation}
                </span>
                <QrPin number={number} done={done} small />
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-1 leading-tight [@media(max-height:480px)]:sr-only" aria-hidden="true">
                  <span className="text-xs font-semibold text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.25)]">{spot.name}</span>
                  <span
                    className={`hidden text-[0.75rem] font-semibold text-white/95 [text-shadow:0_1px_1px_rgba(0,0,0,0.25)] @min-[360px]:inline`}
                  >
                    {done ? `✓${collectedLabel}` : notCollectedLabel}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
