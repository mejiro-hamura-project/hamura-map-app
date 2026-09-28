import tulipFieldImage from '../assets/answers/tulip-field.jpg';
import negaramiSuidenImage from '../assets/answers/negarami-suiden.jpg';
import hamuraSakuraImage from '../assets/answers/hamura-sakura.jpg';
import maimaizuIdoImage from '../assets/answers/maimaizu-ido.jpg';

// お題（answers.tsのAnswerDefinition.id）ごとの紹介写真。バンドラー（Vite）専用の
// 画像importをここに分離し、answers.ts / checkpoints.ts はNode製スクリプトからも
// 安全に読み込めるようにしている。写真が無いお題（例: れっさーぱんだ）は未登録。
export const ANSWER_IMAGES: Record<string, string> = {
  'tulip-field': tulipFieldImage,
  'negarami-suiden': negaramiSuidenImage,
  'hamura-sakura': hamuraSakuraImage,
  'maimaizu-ido': maimaizuIdoImage,
};
