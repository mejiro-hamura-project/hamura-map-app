/**
 * スタンプラリーのボタンの左側に添える絵文字（操作の種類ごとに1つ。画面が違っても同じ操作は同じ絵文字）。
 * ボタンの文言そのものは変えず、Button の icon として別に表示する。
 */
export const BUTTON_ICONS = {
  start: '🚀',
  register: '📝',
  camera: '📷',
  qrLocation: '📍',
  arrange: '🎨',
  check: '🔍',
  prize: '🎁',
  next: '➡️',
  back: '⬅️',
  reset: '🔄',
  stamps: '🏵️',
  howto: '📖',
  agree: '☑️',
  done: '✅',
} as const;
