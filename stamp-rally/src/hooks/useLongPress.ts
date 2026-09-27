import { useCallback, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  /** 長押しと判定するまでの保持時間（ミリ秒）。 */
  duration?: number;
  /** これ以上指/カーソルが動いたら長押しをキャンセルする距離（px）。スクロール操作を妨げないための遊び。 */
  moveThreshold?: number;
}

// スタッフ専用操作（景品交換の確認画面を開く）のための長押し検出。
// 通常の短いタップや、スクロールのための指の移動では反応しない。
export function useLongPress({ onLongPress, duration = 650, moveThreshold = 12 }: UseLongPressOptions) {
  const timerRef = useRef<number | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPos.current = null;
  }, []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      // マウスの場合は主ボタン（左クリック）のみを対象にする
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      startPos.current = { x: event.clientX, y: event.clientY };
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        onLongPress();
      }, duration);
    },
    [duration, onLongPress],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (!startPos.current) return;
      const dx = event.clientX - startPos.current.x;
      const dy = event.clientY - startPos.current.y;
      if (Math.hypot(dx, dy) > moveThreshold) clearTimer();
    },
    [clearTimer, moveThreshold],
  );

  const onPointerUp = useCallback(() => clearTimer(), [clearTimer]);
  const onPointerCancel = useCallback(() => clearTimer(), [clearTimer]);
  // 長押し中にブラウザ標準のコンテキストメニュー（テキスト選択・画像保存など）が出ないようにする
  const onContextMenu = useCallback((event: ReactMouseEvent) => event.preventDefault(), []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onContextMenu };
}
