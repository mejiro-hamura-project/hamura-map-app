/**
 * スタンプラリー画面の「表示だけ」の切り替え。
 * 本番運用で使わないナビゲーションを非表示にしている。各ボタンの処理（遷移先・
 * イベントハンドラー）はコード上に残してあり、ここを true に戻せば再表示できる。
 */
export const STAMP_RALLY_DISPLAY = {
  /** ヘッダーの「戻る」（景品交換画面）・「祭り案内へ」 */
  showHeaderNavLinks: false,
  /** QR読み取り（カメラ）画面の「戻る」 */
  showCameraBackButton: false,
} as const;
