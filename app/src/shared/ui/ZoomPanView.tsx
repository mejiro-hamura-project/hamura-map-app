import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

type ZoomPanViewProps = {
  children: ReactNode;
  className?: string;
  /**
   * 中身のこの位置（中身に対する％）が枠の中央に来るように、指定の倍率で拡大する。
   * 値が変わるたびに適用する（検索で選んだ店のブースへ寄せる等）。
   */
  focus?: { x: number; y: number; scale: number } | null;
};

type Point = { x: number; y: number };
type Transform = { scale: number; x: number; y: number };

const MIN_SCALE = 1;
const MAX_SCALE = 3;

function distanceBetween(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/**
 * 1方向（横または縦）の移動量を、中身が枠からはみ出しすぎない範囲に収める。
 * size は拡大前の中身の大きさ、viewport は枠の大きさ。中身は枠の端（0）に置かれ、中心を基準に拡大される前提。
 */
function clampAxis(offset: number, size: number, viewport: number, scale: number): number {
  // 移動0のとき、拡大後の中身の端は (1 - scale) * size / 2 の位置に来る。これを枠の端（0）に合わせる移動量
  const alignStart = ((scale - 1) * size) / 2;
  if (size * scale <= viewport) return alignStart;
  // 中身の反対側の端を、枠の反対側の端に合わせる移動量
  const alignEnd = viewport - ((scale + 1) * size) / 2;
  return Math.min(alignStart, Math.max(alignEnd, offset));
}

/**
 * 指2本でのピンチズーム、指1本（またはマウス）でのドラッグ移動、
 * PCではマウスホイールでの拡大縮小に対応した汎用の枠。
 * 地図専用ではなく、拡大したい画像などにも使い回せる部品として shared/ui に置いている。
 */
// この距離（px）より動いたら「ドラッグ」とみなす。それ未満は「タップ」として扱い、
// ピンなど子要素のクリックをそのまま通す。
const DRAG_THRESHOLD_PX = 6;

export default function ZoomPanView({ children, className, focus }: ZoomPanViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const pointerStartPoints = useRef(new Map<number, Point>());
  const capturedPointerIds = useRef(new Set<number>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const panStart = useRef<{ pointer: Point; origin: Point } | null>(null);

  const [transform, setTransform] = useState<Transform>({ scale: 1, x: 0, y: 0 });

  function clampPosition(x: number, y: number, scale: number): Point {
    const container = containerRef.current;
    const content = contentRef.current;
    const containerWidth = container?.clientWidth ?? 0;
    const containerHeight = container?.clientHeight ?? 0;
    // 中身（content）の「拡大していない元のサイズ」は、枠（container）と同じとは限らない
    // （地図画像の縦横比によっては枠より小さかったり大きかったりする）。
    // 実際に描画されている中身のサイズを見て、はみ出す分だけ動かせるようにする。
    // 中身は枠の左上に置かれ、拡大は中身の中心を基準に行われる。
    // 拡大後の中身が枠より大きい向きは、枠の外に空白が出ない範囲で動かせる。
    // 枠に収まる向きは、中身の左上（上端）を枠の左上（上端）に合わせて固定する
    // （拡大で中身の上側が枠の外へはみ出して戻せなくなるのを防ぐ）。
    const contentWidth = content?.offsetWidth ?? containerWidth;
    const contentHeight = content?.offsetHeight ?? containerHeight;
    return {
      x: clampAxis(x, contentWidth, containerWidth, scale),
      y: clampAxis(y, contentHeight, containerHeight, scale),
    };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pointerStartPoints.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      // 指2本になった時点で確実にピンチ操作なので、ここだけは最初からキャプチャする
      for (const pointerId of pointers.current.keys()) {
        if (!capturedPointerIds.current.has(pointerId)) {
          e.currentTarget.setPointerCapture(pointerId);
          capturedPointerIds.current.add(pointerId);
        }
      }
      const [p1, p2] = [...pointers.current.values()];
      pinchStart.current = { distance: distanceBetween(p1, p2), scale: transform.scale };
      panStart.current = null;
    } else if (pointers.current.size === 1) {
      panStart.current = { pointer: { x: e.clientX, y: e.clientY }, origin: { x: transform.x, y: transform.y } };
    }
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [p1, p2] = [...pointers.current.values()];
      const distance = distanceBetween(p1, p2);
      const nextScale = clampScale(pinchStart.current.scale * (distance / pinchStart.current.distance));
      setTransform((t) => ({ ...clampPosition(t.x, t.y, nextScale), scale: nextScale }));
    } else if (pointers.current.size === 1 && panStart.current) {
      // 動いた距離がしきい値を超えるまではキャプチャしない。
      // こうしないと、ピンなどをただタップしただけでもドラッグ扱いになり、
      // クリックイベントが子要素に届かなくなってしまう。
      if (!capturedPointerIds.current.has(e.pointerId)) {
        const start = pointerStartPoints.current.get(e.pointerId);
        if (start && distanceBetween(start, { x: e.clientX, y: e.clientY }) > DRAG_THRESHOLD_PX) {
          e.currentTarget.setPointerCapture(e.pointerId);
          capturedPointerIds.current.add(e.pointerId);
        }
      }
      const dx = e.clientX - panStart.current.pointer.x;
      const dy = e.clientY - panStart.current.pointer.y;
      setTransform((t) => ({ ...clampPosition(panStart.current!.origin.x + dx, panStart.current!.origin.y + dy, t.scale), scale: t.scale }));
    }
  }

  function endPointer(e: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    pointerStartPoints.current.delete(e.pointerId);
    capturedPointerIds.current.delete(e.pointerId);
    pinchStart.current = null;
    if (pointers.current.size === 1) {
      const [remaining] = [...pointers.current.values()];
      panStart.current = { pointer: remaining, origin: { x: transform.x, y: transform.y } };
    } else {
      panStart.current = null;
    }
  }

  // focus が指定されたら、その位置が枠の中央に来るように拡大・移動する。
  // 中身は枠の左上を基準に置かれ、拡大は中身の中心を基準に行われる（transform の既定）ことを前提に計算する。
  useEffect(() => {
    if (!focus) return;
    const frame = requestAnimationFrame(() => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;
      const scale = clampScale(focus.scale);
      const contentWidth = content.offsetWidth;
      const contentHeight = content.offsetHeight;
      const pointX = (focus.x / 100 - 0.5) * contentWidth * scale + contentWidth / 2;
      const pointY = (focus.y / 100 - 0.5) * contentHeight * scale + contentHeight / 2;
      const next = clampPosition(container.clientWidth / 2 - pointX, container.clientHeight / 2 - pointY, scale);
      setTransform({ scale, ...next });
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  // ホイールでの拡大縮小はブラウザ標準のページスクロールを止める必要があり、
  // React の onWheel は passive 指定のため preventDefault が効かないことがある。
  // そのためネイティブの addEventListener を使う。
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      const delta = -e.deltaY * 0.0015;
      setTransform((t) => {
        const nextScale = clampScale(t.scale + delta);
        return { ...clampPosition(t.x, t.y, nextScale), scale: nextScale };
      });
    }

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative touch-none overflow-hidden ${className ?? ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <div
        ref={contentRef}
        className="w-full"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
