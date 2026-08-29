import type { MapProvider } from './types';

/**
 * イラスト地図（画像）用の実装。
 * スポットのx, yは「地図画像に対する割合（0〜100）」として保存されている前提で、
 * そのままCSSのleft/topに使える%へ変換するだけ。
 */
export const imageMapProvider: MapProvider = {
  getPosition(spot) {
    return { left: `${spot.x}%`, top: `${spot.y}%` };
  },
};
