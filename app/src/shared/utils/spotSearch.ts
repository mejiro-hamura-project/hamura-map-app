import type { Spot } from '../types';
import { toHiragana } from './kana';

/** "11：焼きそば横丁"・"キ1：○○"・"2・3：○○" → 店名のように、先頭の番号・記号部分を除いた名前を取り出す */
export function spotDisplayName(name: string): string {
  return name.replace(/^[^：]+：/, '');
}

/**
 * 表示名（例："焼きそば横丁"）だけでなく、読みがな（例："やきそばよこちょう"）でも
 * 前方一致するかどうかを判定する。カタカナで入力されてもひらがなに揃えて比較する。
 * これにより、店名を漢字に変換しなくても「やきそば」でヒットするようになる。
 * ホーム地図の検索・投稿作成の店選択など、前方一致検索が必要な画面で共通して使う。
 */
export function matchesSpotQuery(spot: Spot, query: string): boolean {
  const displayName = spotDisplayName(spot.name);
  if (displayName.startsWith(query)) return true;
  // カタカナの店名（例：スナック紅蓮）は、ひらがなで入力しても一致させる
  if (toHiragana(displayName).startsWith(toHiragana(query))) return true;
  // 「団体名／内容」の演目や「北杜市／植松農園」、「それいけ！アンパンマンショー」のような名前は、
  // 「／」・空白・「！」で区切った後ろの部分（例：サンバ、アンパンマン）からも探せるようにする
  const laterParts = displayName.split(/[／\s！]+/).slice(1);
  if (laterParts.some((part) => toHiragana(part).startsWith(toHiragana(query)))) return true;
  if (spot.reading) {
    return toHiragana(spot.reading).startsWith(toHiragana(query));
  }
  return false;
}
