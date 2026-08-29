/**
 * カタカナをひらがなに変換する。
 * 「ドリンク」を「どりんく」と入力しても読みがなと一致させたい、といった
 * かな入力の前方一致検索で使う（店名検索・投稿の店選択など、複数画面で使う想定）。
 */
export function toHiragana(input: string): string {
  return input.replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
}
