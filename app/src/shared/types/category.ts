/** スポットの大分類（イベント一覧タブに対応）。実データは shared/taxonomy で1箇所だけ定義する。 */
export interface Category {
  id: string;
  name: string;
  /** 表示色（16進カラーコード）。ジャンルタグの色分けに使う */
  color: string;
}

/** 横断的な属性タグ（フィルター・口コミ絞り込みに対応）。実データは shared/taxonomy で1箇所だけ定義する。 */
export interface Tag {
  id: string;
  name: string;
}
