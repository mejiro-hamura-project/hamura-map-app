import type { Spot } from '../types';

/** 画面上の位置（CSSのleft/topにそのまま使える値） */
export interface MapPosition {
  left: string;
  top: string;
}

/**
 * 「スポットの座標データ」を「画面上の位置」に変換する窓口。
 * 今はイラスト地図の画像座標（x, y）をそのまま使う実装（ImageMapProvider）だけを用意する。
 * 将来、実地図（緯度経度）を使う実装（GeoMapProvider）に差し替えても、
 * 呼び出し側（地図画面）のコードは変更しなくてよい。
 */
export interface MapProvider {
  getPosition(spot: Pick<Spot, 'x' | 'y' | 'lat' | 'lng'>): MapPosition;
}
