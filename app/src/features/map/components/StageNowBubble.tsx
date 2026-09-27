import { useMapProvider } from '../../../shared/map';
import type { Spot } from '../../../shared/types';

type StageNowBubbleProps = {
  spot: Spot;
  nowPlayingTitle: string;
  /** 「全体」表示のときtrue。他の表示と重なりやすいため、吹き出しを小さく・短くする */
  compact?: boolean;
};

// 吹き出しが地図の右端／左端でちぎれないように、ピンの位置に応じて吹き出しの伸びる向きを変える
function bubbleAnchorClass(x: number): string {
  if (x >= 70) return 'right-0';
  if (x <= 30) return 'left-0';
  return 'left-1/2 -translate-x-1/2';
}

/**
 * ステージの「ただいま：〇〇」をその場所に表示するだけの、タップできない表示専用の部品。
 * お店の当たり判定は今後ブースのボタンで別途作るため、ここには一切タップ領域を持たせない
 * （ボタンの当たり判定と二重に重なるのを防ぐため）。
 */
export default function StageNowBubble({ spot, nowPlayingTitle, compact }: StageNowBubbleProps) {
  const mapProvider = useMapProvider();
  const position = mapProvider.getPosition(spot);
  // 全体表示ではメイン・サブのステージが近い位置にあり吹き出しが重なりやすいため、
  // サブステージ側だけさらに上にずらして間隔を空ける
  const extraLiftClass = compact && spot.stageKey === 'sub' ? 'mb-7' : 'mb-1';

  return (
    <div
      className="pointer-events-none absolute z-[5] -translate-x-1/2 -translate-y-1/2"
      style={{ left: position.left, top: position.top }}
    >
      {compact ? (
        <span
          className={`absolute bottom-0 ${extraLiftClass} flex w-[84px] items-center gap-1 truncate whitespace-nowrap rounded-full border border-brand-magenta bg-white px-2 py-1 text-[8.5px] font-bold text-brand-magenta shadow-md ${bubbleAnchorClass(spot.x)}`}
        >
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-magenta" />
          <span className="truncate">{nowPlayingTitle}</span>
        </span>
      ) : (
        <span
          className={`absolute bottom-0 mb-1 flex w-[150px] items-start gap-1 rounded-2xl border border-brand-magenta bg-white px-2.5 py-1.5 text-[10px] font-bold leading-tight text-brand-magenta shadow-md ${bubbleAnchorClass(spot.x)}`}
        >
          <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-magenta" />
          <span className="line-clamp-2 break-words">{nowPlayingTitle}</span>
        </span>
      )}
    </div>
  );
}
