/** スポット群をまとめる催し。Phase 1では市民祭り本体1件を表す */
export interface Event {
  id: string;
  name: string;
  description?: string;
  /** ISO 8601形式の日時文字列 */
  startAt?: string;
  /** ISO 8601形式の日時文字列 */
  endAt?: string;
}
