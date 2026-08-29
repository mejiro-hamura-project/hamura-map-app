import type { Category } from '../types';

/**
 * カテゴリの共通マスタ。地図・検索・イベント一覧はすべてここを参照する（画面ごとの個別定義を禁止）。
 * UIプロトタイプ（docs/市民祭りアプリ_UIプロトタイプ.html）の実際の分類・色に合わせている。
 */
export const CATEGORIES: Category[] = [
  { id: 'gourmet', name: 'グルメ', color: '#e05fa6' },
  { id: 'pr', name: '紹介PR', color: '#5b8dd6' },
  { id: 'goods', name: '商品販売', color: '#3fae86' },
  { id: 'main-stage', name: 'メインステージ', color: '#f4a52c' },
  { id: 'play-land', name: 'プレイランド', color: '#2fa98a' },
  { id: 'specialty', name: '特産品販売コーナー', color: '#e8534b' },
  // スタンプラリーのQR設置場所（Spot種別＝スタンプQR）の表示用カテゴリ
  { id: 'stamp-qr', name: 'スタンプQR', color: '#8f80d6' },
];

export function findCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}
