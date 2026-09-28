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

const FULL_SCREEN_ROUTES: readonly string[] = [
  STAMP_RALLY_ROUTES.camera,
  STAMP_RALLY_ROUTES.reveal,
  STAMP_RALLY_ROUTES.exchange,
  STAMP_RALLY_ROUTES.result,
];

export function isStampRallyFullScreen(pathname: string): boolean {
  return FULL_SCREEN_ROUTES.includes(pathname.replace(/\/+$/, ''));
}
