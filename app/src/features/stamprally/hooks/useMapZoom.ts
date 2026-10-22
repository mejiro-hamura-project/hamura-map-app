import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

interface MapTransform {
  scale: number;
  x: number;
  y: number;
}

const INITIAL: MapTransform = { scale: 1, x: 0, y: 0 };

// 地図の枠（親要素）の位置と大きさ。拡大中の要素自身は transform で大きさが変わるため親で測る。
function measureFrame(element: HTMLElement | null) {
  const parent = element?.parentElement;
  if (!parent) return null;
  const rect = parent.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: parent.clientWidth, height: parent.clientHeight };
}

/**
 * QRコード設置場所の地図を、指で拡大・縮小・移動するための表示用フック。
 * - 2本指のピンチで拡大・縮小、1本指（マウスではドラッグ）で移動、PCではホイールでも拡大・縮小。
 * - 返す ref の要素は、地図の枠（親要素）いっぱいに敷き、左上を基準に transform で拡大・移動する。
 * - 地図が枠の外へずれて余白が出ないよう、移動量を枠の範囲に収める。等倍より小さくはしない。
 * - 表示のためだけの一時的な状態で、スタンプの取得状態や保存データには一切触れない。
 */
export function useMapZoom(maxScale = 4) {
  const [transform, setTransform] = useState<MapTransform>(INITIAL);
  const transformRef = useRef<MapTransform>(INITIAL);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  const apply = useCallback((next: MapTransform) => {
    const f = measureFrame(elementRef.current);
    const scale = Math.min(maxScale, Math.max(1, next.scale));
    const width = f?.width ?? 0;
    const height = f?.height ?? 0;
    const clamped = {
      scale,
      x: Math.min(0, Math.max(width * (1 - scale), next.x)),
      y: Math.min(0, Math.max(height * (1 - scale), next.y)),
    };
    transformRef.current = clamped;
    setTransform(clamped);
  }, [maxScale]);

  // 枠内の点（clientX/Y）を中心に、倍率を factor 倍にする。
  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number, panX = 0, panY = 0) => {
      const f = measureFrame(elementRef.current);
      if (!f) return;
      const current = transformRef.current;
      const scale = Math.min(maxScale, Math.max(1, current.scale * factor));
      const px = clientX - f.left;
      const py = clientY - f.top;
      const ratio = scale / current.scale;
      apply({ scale, x: px + panX - (px - current.x) * ratio, y: py + panY - (py - current.y) * ratio });
    },
    [apply, maxScale],
  );

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
  }, []);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const map = pointers.current;
      const previous = map.get(event.pointerId);
      if (!previous) return;
      const others = [...map.entries()].filter(([id]) => id !== event.pointerId).map(([, p]) => p);
      const next = { x: event.clientX, y: event.clientY };
      map.set(event.pointerId, next);

      if (others.length === 0) {
        // 1本指：表示位置の移動
        const current = transformRef.current;
        apply({ ...current, x: current.x + next.x - previous.x, y: current.y + next.y - previous.y });
        return;
      }
      // 2本指：2点の距離の変化で拡大・縮小し、2点の中点の移動で表示位置も動かす
      const other = others[0];
      const before = Math.hypot(previous.x - other.x, previous.y - other.y);
      const after = Math.hypot(next.x - other.x, next.y - other.y);
      if (before === 0) return;
      const midBefore = { x: (previous.x + other.x) / 2, y: (previous.y + other.y) / 2 };
      const midAfter = { x: (next.x + other.x) / 2, y: (next.y + other.y) / 2 };
      zoomAt(midBefore.x, midBefore.y, after / before, midAfter.x - midBefore.x, midAfter.y - midBefore.y);
    },
    [apply, zoomAt],
  );

  const onPointerEnd = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
  }, []);

  // ホイールでの拡大・縮小（PC向け）。地図の上でだけページのスクロールを止める必要があるため、
  // passive: false の通常のイベントリスナーで登録する。
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      // 等倍のままさらに縮小しようとしたときは、ページのスクロールを妨げない
      if (event.deltaY > 0 && transformRef.current.scale <= 1) return;
      event.preventDefault();
      zoomAt(event.clientX, event.clientY, Math.exp(-event.deltaY * 0.0015));
    };
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const reset = useCallback(() => apply(INITIAL), [apply]);

  return {
    ref: elementRef,
    ...transform,
    reset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
  };
}
