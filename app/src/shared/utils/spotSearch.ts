import type { Spot } from '../types';
import { toHiragana } from './kana';

/** "11：焼きそば横丁" → "焼きそば横丁" のように、番号・記号部分を除いた名前を取り出す */
export function spotDisplayName(name: string): string {
  return name.replace(/^[0-9A-Z]+：/, '');
}

/**
 * 表示名（例："焼きそば横丁"）だけでなく、読みがな（例："やきそばよこちょう"）でも
 * 前方一致するかどうかを判定する。カタカナで入力されてもひらがなに揃えて比較する。
 * これにより、店名を漢字に変換しなくても「やきそば」でヒットするようになる。
 * ホーム地図の検索・投稿作成の店選択など、前方一致検索が必要な画面で共通して使う。
 */
export function matchesSpotQuery(spot: Spot, query: string): boolean {
  if (spotDisplayName(spot.name).startsWith(query)) return true;
  if (spot.reading) {
    return toHiragana(spot.reading).startsWith(toHiragana(query));
  }
  return false;
}
