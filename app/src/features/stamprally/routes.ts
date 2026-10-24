/** BrowserRouter内で使用するスタンプラリーのURL。QRの値とは別の定義。 */
export const STAMP_RALLY_ROUTES = {
  entry: '/stamprally',
  notice: '/stamprally/notice',
  howto: '/stamprally/howto',
  register: '/stamprally/register',
  rally: '/stamprally/rally',
  camera: '/stamprally/camera',
  reveal: '/stamprally/reveal',
  challenge: '/stamprally/challenge',
  exchange: '/stamprally/exchange',
  result: '/stamprally/result',
} as const;

/**
 * 共通の下部ナビゲーションを出さない（全画面表示にする）画面か。表示の判定だけで、
 * URL・画面遷移には関与しない。本番運用では下部ナビゲーションを使わないため、
 * スタンプラリーの全画面（/stamprally 配下）を全画面表示にする。
 */
export function isStampRallyFullScreen(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '');
  return path === STAMP_RALLY_ROUTES.entry || path.startsWith(`${STAMP_RALLY_ROUTES.entry}/`);
}
