/**
 * 出店の細かい分類（食べ物の種類・物販・ステージの演目など）。
 * Category（大分類）とは別の、アイコン表示・絞り込み用の分類。実データは shared/taxonomy で1箇所だけ定義する。
 */
export interface Genre {
  id: string;
  name: string;
  /** アイコン画像のURL（透過PNG） */
  iconUrl: string;
}
