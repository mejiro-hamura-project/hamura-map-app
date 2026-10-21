import type { BoothStyle } from './booth';

/** 店のエリアの色。ブース（配置ツール）の色と同じ4種（pr/band/pink/orange） */
export type StoreStyle = BoothStyle;

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
