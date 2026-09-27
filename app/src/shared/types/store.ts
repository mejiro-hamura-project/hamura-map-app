import type { BoothStyle } from './booth';

/**
 * ブースの記号に紐づく店のデータ。
 * 店は「エリアの色（style）＋記号（code）」の組み合わせで一意に決まる
 * （ピンクの「11」と青の「11」は別の店として区別される）。
 */
export interface Store {
  style: BoothStyle;
  code: string;
  name: string;
  genreId: string;
  detail: string;
}
