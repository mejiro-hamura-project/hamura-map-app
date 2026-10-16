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
  /** 特定の会場（1〜3）専用の地図である場合の会場番号。未設定＝会場をまたいだ「全体」の地図 */
  venueId?: number;
}

/**
 * 「全体」地図の上に置く、会場（第1〜第3）のタップ範囲。
 * タップするとその会場の拡大地図に切り替える。x, y, width, height は地図画像に対する割合（0〜100）。
 */
export interface VenueHotspot {
  venueId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 会場地図の上に置く、エリア（区画）のタップ範囲。地図に印刷されたエリア名の上に重ねる透明なボタンで、
 * タップするとエリアの説明を出す。x, y, width, height は地図画像に対する割合（0〜100）。
 */
export interface AreaHotspot {
  id: string;
  name: string;
  description: string;
  /** 曜日・日付ごとの内容など、説明の下に箇条書きで出す補足（任意） */
  notes?: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}
