import type { Genre } from '../types';

/**
 * ジャンルの共通マスタ（15種）。イベント一覧のアイコン表示・絞り込みはすべてここを参照する。
 * アイコン画像は app/public/icons/ に配置済み（透過PNG）。
 * 対応表：app/public/icons/README_ジャンルとアイコンの対応.txt
 */
export const GENRES: Genre[] = [
  // 食べ物・飲み物
  { id: 'food-agemono', name: '揚げ物', iconUrl: '/icons/food-agemono.png' },
  { id: 'food-pan', name: 'パン類', iconUrl: '/icons/food-pan.png' },
  { id: 'food-gohan', name: 'ご飯もの', iconUrl: '/icons/food-gohan.png' },
  { id: 'food-sonota', name: 'その他（食事）', iconUrl: '/icons/food-sonota.png' },
  { id: 'food-yakimono', name: '焼き物', iconUrl: '/icons/food-yakimono.png' },
  { id: 'food-menrui', name: '麺類', iconUrl: '/icons/food-menrui.png' },
  { id: 'food-dessert', name: 'デザート・スイーツ', iconUrl: '/icons/food-dessert.png' },
  { id: 'food-drink', name: '飲み物', iconUrl: '/icons/food-drink.png' },
  // 物販・体験
  { id: 'goods-zakka', name: '物販（雑貨）', iconUrl: '/icons/goods-zakka.png' },
  { id: 'goods-info', name: 'インフォメーション', iconUrl: '/icons/goods-info.png' },
  { id: 'goods-shokuhin', name: '物販（食品）', iconUrl: '/icons/goods-shokuhin.png' },
  { id: 'goods-taiken', name: '体験（縁日・スポーツ）', iconUrl: '/icons/goods-taiken.png' },
  // ステージ
  { id: 'stage-uta', name: 'ステージ（歌）', iconUrl: '/icons/stage-uta.png' },
  { id: 'stage-dance', name: 'ステージ（ダンス・パフォーマンス）', iconUrl: '/icons/stage-dance.png' },
  { id: 'stage-gakki', name: 'ステージ（楽器）', iconUrl: '/icons/stage-gakki.png' },
];

export function findGenreById(id: string | undefined): Genre | undefined {
  if (!id) return undefined;
  return GENRES.find((genre) => genre.id === id);
}
