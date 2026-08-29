/** Phase 1ではニックネームのみの最小構成。Phase 2で認証・プロフィール・フォローへ拡張予定 */
export interface User {
  id: string;
  nickname: string;
}
