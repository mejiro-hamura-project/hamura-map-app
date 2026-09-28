// スタンプラリーの「答え（キーワード）」データ。
// 表記は指定どおり一切変換しない（漢字→ひらがな変換などは行わない）。
// 正解判定・タイル文字・画面表示のすべてで、この text をそのまま使う。
//
// このファイルは scripts/generate-qrcodes.ts のようなNode製スクリプトからも
// checkpoints.ts 経由で読み込まれるため、バンドラー（Vite）専用の画像import は
// 置かない（プレーンなNode/tsxは .jpg 等の拡張子を解決できずエラーになるため）。
// お題の紹介写真は answerImages.ts 側で別管理している。
export interface AnswerDefinition {
  id: string;
  text: string;
  /** お題正解時に表示する紹介文。文言はそのまま表示する（変換・要約しない）。 */
  description: string;
}

// 通常キーワード（5種類）。各コースはこのうち1つを正解として、
// 7つのチェックポイントで1文字ずつ集める（checkpoints.ts 側で text の7文字を
// QR取得順にばらして割り当てる）。
export const NORMAL_KEYWORDS: AnswerDefinition[] = [
  {
    id: 'red-panda',
    text: 'れっさーぱんだ',
    description:
      '「れっさーぱんだ」:羽村市動物公園の象徴的な存在であるシセンレッサーパンダ。6月28日に待望の赤ちゃんが誕生！9月19日に行われるお披露目イベントでは、名前が「きのこ」と発表されました！',
  },
  {
    id: 'tulip-field',
    text: 'ちゅーりっぷ畑',
    description:
      '「ちゅーりっぷ畑」:春になると、約35万本のチューリップが一面に咲き誇ります！🌷\n毎年開催される「はむら花と水のまつり」では、色とりどりのチューリップを楽しみながら春の訪れを感じられます👒',
  },
  {
    id: 'negarami-suiden',
    text: '根がらみ前水田',
    description:
      '「根がらみ前水田」:昔ながらの田園風景が広がる根がらみ前水田🌷\n羽村の農業や暮らしの歴史を感じながら、のんびり散策を楽しめます！四季折々の自然に出会える、ほっとする場所です🌿',
  },
  {
    id: 'hamura-sakura',
    text: 'はむらのさくら',
    description:
      '「はむらのさくら」:春の羽村市は、多摩川沿いを中心に桜が咲き、まちがやさしいピンク色に包まれます🌸\n川辺を歩きながら、のんびりお花見を楽しめる春ならではの景色が魅力です。',
  },
  {
    id: 'maimaizu-ido',
    text: 'まいまいず井戸',
    description:
      '「まいまいず井戸」:JR羽村駅東口近くの五ノ神社境内にあり、羽村の歴史を感じられます⛩\n水の得られる深さまでスリバチ状に掘り、そこへ続く螺旋状の通路が特徴です！\nカタツムリを意味する「まいまい」に由来する名前も、ユニークな見どころのひとつです。🐌',
  },
];

// 小学生専用キーワード（2種類・上記のうち、もともと漢字を含まないもの）。
// 表記は通常キーワードと完全に同じ文字列を参照するだけで、変換は一切行わない。
export const ELEMENTARY_ANSWER_IDS: readonly string[] = ['red-panda', 'hamura-sakura'];

export function isElementaryKeyword(answer: AnswerDefinition): boolean {
  return ELEMENTARY_ANSWER_IDS.includes(answer.id);
}
