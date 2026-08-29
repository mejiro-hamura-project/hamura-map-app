/**
 * 会場・地図アセット。仕様書のエンティティ名は「Map」だが、
 * TypeScript / JavaScript 組み込みの Map（連想配列）と紛らわしいため VenueMap という名前にしている。
 */
export interface VenueMap {
  id: string;
  name: string;
  /** 地図画像のURL（ImageMap用） */
  imageUrl: string;
  /** 地図画像の幅（px）。x, y 座標の基準 */
  width: number;
  /** 地図画像の高さ（px）。x, y 座標の基準 */
  height: number;
}
