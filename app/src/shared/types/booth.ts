/** ブースの色の種類（配置ツールの分類に合わせる。pr=青／band=緑／pink=ピンク） */
export type BoothStyle = 'pr' | 'band' | 'pink';

/**
 * ブース配置ツールで作った、地図上のブース1つぶんのデータ。
 * x, y, angle, scale はツールの書き出しそのままの値（x, yは地図画像に対する％）。
 */
export interface Booth {
  style: BoothStyle;
  x: number;
  y: number;
  angle: number;
  scale: number;
  orient: 'h' | 'v';
  codes: string[];
}
