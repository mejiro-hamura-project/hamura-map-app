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
/** scale：倍率。x, y：枠の左上から見た、中身の左上の位置（px） */
type View = { scale: number; x: number; y: number };

const MIN_SCALE = 1;
const MAX_SCALE = 3;

// この距離（px）より動いたら「ドラッグ」とみなす。それ未満は「タップ」として扱い、
// ピンなど子要素のクリックをそのまま通す。
const DRAG_THRESHOLD_PX = 6;

function distanceBetween(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/**
 * 1方向（横または縦）の中身の位置を、枠の外に空白が出ない範囲に収める。
 * size は拡大後の中身の大きさ、viewport は枠の大きさ。
 * 枠に収まる向きは、中身の端を枠の端（0）に合わせて固定する。
 */
function clampAxis(offset: number, size: number, viewport: number): number {
  if (size <= viewport) return 0;
  return Math.min(0, Math.max(viewport - size, offset));
}

/**
 * 指2本でのピンチズーム、指1本（またはマウス）でのドラッグ移動、
 * PCではマウスホイールでの拡大縮小に対応した汎用の枠。
 * 地図専用ではなく、拡大したい画像などにも使い回せる部品として shared/ui に置いている。
 *
 * 拡大は CSS の transform: scale ではなく、中身の幅そのものを広げて行う（中身は幅に対する割合で作る前提）。
 * scale で拡大すると、ブラウザが中身全体を高い解像度の1枚の絵として描き直すため、
 * ブースなどを多数重ねた地図では iPhone の Safari がメモリ不足でページごと落ちることがあった。
 * 幅を広げる方式なら、画面に見えている部分だけが描かれる。
 */
export default function ZoomPanView({ children, className, focus }: ZoomPanViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const pointerStartPoints = useRef(new Map<number, Point>());
  const capturedPointerIds = useRef(new Set<number>());
  const pinchStart = useRef<{ distance: number; view: View; anchor: Point } | null>(null);
  const panStart = useRef<{ pointer: Point; origin: Point } | null>(null);

  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  viewRef.current = view;

  /** 倍率1のときの中身の大きさ（幅は枠と同じ。高さは中身の縦横比で決まる） */
  function baseSize(): { width: number; height: number } {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const contentHeight = contentRef.current?.offsetHeight ?? 0;
    return { width: containerWidth, height: contentHeight / viewRef.current.scale };
  }

  function clampView(next: View): View {
    const container = containerRef.current;
    const base = baseSize();
    return {
      scale: next.scale,
      x: clampAxis(next.x, base.width * next.scale, container?.clientWidth ?? 0),
      y: clampAxis(next.y, base.height * next.scale, container?.clientHeight ?? 0),
    };
  }

  /** 枠の中の点 anchor の下にある中身の位置を動かさずに、倍率を変える */
  function zoomAround(from: View, nextScale: number, anchor: Point): View {
    const ratio = nextScale / from.scale;
    return clampView({
      scale: nextScale,
      x: anchor.x - (anchor.x - from.x) * ratio,
      y: anchor.y - (anchor.y - from.y) * ratio,
    });
  }

  function toContainerPoint(clientX: number, clientY: number): Point {
    const rect = containerRef.current?.getBoundingClientRect();
    return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) };
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
      pinchStart.current = {
        distance: distanceBetween(p1, p2),
        view: viewRef.current,
        // 2本の指の真ん中を中心に拡大する
        anchor: toContainerPoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2),
      };
      panStart.current = null;
    } else if (pointers.current.size === 1) {
      panStart.current = { pointer: { x: e.clientX, y: e.clientY }, origin: { x: viewRef.current.x, y: viewRef.current.y } };
    }
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [p1, p2] = [...pointers.current.values()];
      const start = pinchStart.current;
      const nextScale = clampScale(start.view.scale * (distanceBetween(p1, p2) / start.distance));
      setView(zoomAround(start.view, nextScale, start.anchor));
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
      const { pointer, origin } = panStart.current;
      setView(
        clampView({
          scale: viewRef.current.scale,
          x: origin.x + (e.clientX - pointer.x),
          y: origin.y + (e.clientY - pointer.y),
        }),
      );
    }
  }

  function endPointer(e: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    pointerStartPoints.current.delete(e.pointerId);
    capturedPointerIds.current.delete(e.pointerId);
    pinchStart.current = null;
    if (pointers.current.size === 1) {
      const [remaining] = [...pointers.current.values()];
      panStart.current = { pointer: remaining, origin: { x: viewRef.current.x, y: viewRef.current.y } };
    } else {
      panStart.current = null;
    }
  }

  // focus が指定されたら、その位置が枠の中央に来るように拡大・移動する
  useEffect(() => {
    if (!focus) return;
    const frame = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const scale = clampScale(focus.scale);
      const base = baseSize();
      setView(
        clampView({
          scale,
          x: container.clientWidth / 2 - (focus.x / 100) * base.width * scale,
          y: container.clientHeight / 2 - (focus.y / 100) * base.height * scale,
        }),
      );
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
      const current = viewRef.current;
      const nextScale = clampScale(current.scale - e.deltaY * 0.0015);
      // マウスの位置を中心に拡大する
      setView(zoomAround(current, nextScale, toContainerPoint(e.clientX, e.clientY)));
    }

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* transform を使わず、位置（left/top）と幅で表す。理由はコンポーネントの説明を参照 */}
      <div
        ref={contentRef}
        className="absolute"
        style={{ left: view.x, top: view.y, width: `${view.scale * 100}%` }}
      >
        {children}
      </div>
    </div>
  );
}
