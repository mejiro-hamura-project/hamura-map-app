import type { Tag } from '../types';

/**
 * タグの共通マスタ。地図フィルター・投稿フィルターはすべてここを参照する（画面ごとの個別定義を禁止）。
 */
export const TAGS: Tag[] = [
  { id: 'drink', name: 'ドリンク' },
  { id: 'meat', name: '肉' },
  { id: 'workshop', name: 'ワークショップ' },
  { id: 'recommended', name: 'オススメ' },
];

export function findTagById(id: string): Tag | undefined {
  return TAGS.find((tag) => tag.id === id);
}
