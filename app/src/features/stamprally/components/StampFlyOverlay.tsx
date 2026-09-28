import { useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
  size: number;
}

interface StampFlyOverlayProps {
  char: string;
  from: Point;
  to: Point;
  onDone: () => void;
}

// GET!演出のアイコン位置(from)から、実際のスタンプ一覧の空き枠の位置(to)まで、
// 回転しながら縮小して飛んでいく演出。座標はどちらも viewport 基準のpx
// （getBoundingClientRect由来）なので、スマホ・PCどちらの画面幅でもそのまま使える。
// 距離ではなく時間（CSSアニメーションの duration）で動くため、画面サイズや
// 移動距離が変わっても速度の見え方は揺れない。
const FLY_MS = 750;
const LAND_MS = 320;

export default function StampFlyOverlay({ char, from, to, onDone }: StampFlyOverlayProps) {
  const [phase, setPhase] = useState<'flying' | 'landing'>('flying');

  useEffect(() => {
    const flyTimer = window.setTimeout(() => setPhase('landing'), FLY_MS);
    return () => window.clearTimeout(flyTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'landing') return;
    const landTimer = window.setTimeout(onDone, LAND_MS);
    return () => window.clearTimeout(landTimer);
  }, [phase, onDone]);

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const scale = to.size / from.size;

  return (
    <div
      // canvas-confetti が挿入するcanvasはz-index:100固定で、/revealからここへ
      // 画面遷移した直後の一瞬だけ残っている可能性があるため、念のためそれより
      // 前面に出しておく（本体はStampRevealScreen側でconfetti.reset()して消している）。
      className="pointer-events-none fixed z-[110]"
      style={
        {
          left: from.x - from.size / 2,
          top: from.y - from.size / 2,
          width: from.size,
          height: from.size,
          '--dx': `${dx}px`,
          '--dy': `${dy}px`,
          '--land-scale': scale,
        } as React.CSSProperties
      }
    >
      <div
        className={`flex h-full w-full items-center justify-center rounded-full border-4 border-stamprally-collected bg-[#fff3e0] text-5xl font-bold text-stamprally-collected ${
          phase === 'flying' ? 'animate-stamp-fly-to-slot' : 'animate-stamp-land-bounce'
        }`}
      >
        {char}
      </div>
    </div>
  );
}
