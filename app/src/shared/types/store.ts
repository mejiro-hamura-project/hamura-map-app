/**
 * 店のエリアの色。ブース（配置ツール）の色（pr/band/pink）に、まだブースが無い
 * 「orange（特産品）」を加えた4種。店データ側だけ先に4色を受け付けられるようにしておく。
 */
export type StoreStyle = 'pink' | 'pr' | 'band' | 'orange';

/**
 * 店登録ツールで作った、ブースの記号に紐づく店のデータ。
 * 店は「エリアの色（style）＋記号（code）」の組み合わせで一意に決まる
 * （ピンクの「11」と青の「11」は別の店として区別される）。
 */
export interface Store {
  style: StoreStyle;
  code: string;
  name: string;
  genreId: string;
  /** 店の説明文。店登録ツールのデータには無いため任意（無ければ詳細ポップアップに説明行を出さない） */
  detail?: string;
  /** お店紹介サイトのURL（任意。今は未表示。サイト完成後に表示対応を追加する） */
  link?: string;
}
