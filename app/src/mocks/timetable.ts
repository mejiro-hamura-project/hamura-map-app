import type { DailyStageTimetable } from '../shared/types';

/**
 * ステージのタイムテーブル（2026年 本番用）。
 * 出どころ：ステージタイムテーブル（10/15版）。メイン＝第2会場、サブ＝第3会場。
 * 演目名は「団体名／内容」、内容が団体名と同じ枠（開会式など）は団体名だけにしている。
 * 表で「-」になっている枠は空き時間として、演目を入れていない。
 * genreId は内容から当てはめたステージ系ジャンル（検索のジャンル絞り込みに使う）。開会式など催し物でない枠は無し。
 */
export const MOCK_TIMETABLE: DailyStageTimetable[] = [
  {
    date: '2026-10-31',
    dateLabel: '10/31(土)',
    stages: {
      main: [
        { start: '10:00', end: '10:30', title: '小作台小学校／楽器演奏', genreId: 'stage-gakki' },
        { start: '10:30', end: '11:00', title: '羽村西小学校／楽器演奏', genreId: 'stage-gakki' },
        { start: '11:00', end: '11:30', title: '富士見小学校／楽器演奏', genreId: 'stage-gakki' },
        { start: '11:30', end: '12:00', title: 'ICUラムズ／サンバ', genreId: 'stage-dance' },
        { start: '12:00', end: '12:30', title: '開会式' },
        { start: '12:30', end: '13:00', title: '華風舞姫（はなふぶき）／ダンス（よさこい踊り）', genreId: 'stage-dance' },
        { start: '13:00', end: '13:30', title: '東京ミッドウエスト吹奏楽団ジュニア部／楽器演奏', genreId: 'stage-gakki' },
        { start: '13:30', end: '14:00', title: "Studio Labo／ダンス（HIP-HOP, K-POP, JAZZ FUNK, BREAKIN'）", genreId: 'stage-dance' },
        {
          start: '14:00',
          end: '14:30',
          title: 'emanation Dance Studio 羽村校／未就学児から中学生のHIPHOP、Jazzfunk、Houseダンス',
          genreId: 'stage-dance',
        },
        { start: '14:30', end: '15:00', title: 'ICUラムズ／サンバ', genreId: 'stage-dance' },
        { start: '15:30', end: '16:00', title: '日本航空高等学校石川 書道部／書道パフォーマンス', genreId: 'stage-dance' },
      ],
      sub: [
        { start: '10:00', end: '10:30', title: '福生交通少年団／鼓笛隊演奏及び交通安全広報', genreId: 'stage-gakki' },
        { start: '10:30', end: '11:00', title: 'STROBE WING（ストロボウイング）／ダンス', genreId: 'stage-dance' },
        { start: '11:00', end: '11:30', title: 'DANCE STUDIO BUZZ羽村校／ダンス', genreId: 'stage-dance' },
        { start: '11:30', end: '12:00', title: 'じゅん爺／歌', genreId: 'stage-uta' },
        { start: '12:00', end: '12:30', title: '譜楽理（ふらり）／オカリナ演奏', genreId: 'stage-gakki' },
        { start: '12:30', end: '13:00', title: 'カントリーラインダンス Apple Jack 羽村教室／ダンス', genreId: 'stage-dance' },
        { start: '13:00', end: '13:30', title: 'さかえフリーダンス／ダンス', genreId: 'stage-dance' },
        { start: '13:30', end: '14:00', title: '玉水保育園／ニンバ踊り', genreId: 'stage-dance' },
        { start: '14:00', end: '14:30', title: 'プアエナOme&あきる野／フラダンス', genreId: 'stage-dance' },
        { start: '14:30', end: '15:00', title: 'KWU SENSHI JAPAN 成嶋道場／空手演武', genreId: 'stage-dance' },
        { start: '15:00', end: '15:30', title: '羽村市子ども日本舞踊サークルさくらの舞／日本舞踊（主に民踊）', genreId: 'stage-dance' },
        { start: '15:30', end: '16:00', title: 'アライアンス羽村教会／演奏・歌唱', genreId: 'stage-uta' },
      ],
    },
  },
  {
    date: '2026-11-01',
    dateLabel: '11/1(日)',
    stages: {
      main: [
        { start: '10:00', end: '10:30', title: '羽村市少年野球連盟・羽村リトルシニア野球協会／団体紹介' },
        { start: '10:30', end: '11:00', title: 'ウニアン・ドス・アマドーリス／サンバ', genreId: 'stage-dance' },
        { start: '11:00', end: '11:30', title: 'はむすぽジュニアチアダンス／チアダンス', genreId: 'stage-dance' },
        { start: '11:30', end: '12:20', title: 'キッズステーションpresents それいけ！アンパンマンショー', genreId: 'stage-dance' },
        { start: '12:30', end: '13:00', title: '羽村市町内会連合会／阿波踊り', genreId: 'stage-dance' },
        { start: '13:00', end: '13:30', title: 'ウニアン・ドス・アマドーリス／サンバ', genreId: 'stage-dance' },
        { start: '13:30', end: '14:00', title: '羽村太鼓普及会／和太鼓演奏', genreId: 'stage-gakki' },
        { start: '14:00', end: '14:50', title: 'キッズステーションpresents それいけ！アンパンマンショー', genreId: 'stage-dance' },
        { start: '15:00', end: '15:50', title: '農産物共進会表彰式' },
        { start: '15:50', end: '16:00', title: '閉会式' },
      ],
      sub: [
        { start: '10:00', end: '10:30', title: '福生消防少年団／鼓笛演奏', genreId: 'stage-gakki' },
        { start: '11:30', end: '12:00', title: '羽村市吹奏楽団4989（シックハック）／吹奏楽アンサンブル', genreId: 'stage-gakki' },
        { start: '12:00', end: '12:30', title: '和太鼓 灯音（ビート）／和太鼓演奏', genreId: 'stage-gakki' },
        { start: '12:30', end: '13:00', title: 'Haʻawina（ハアヴィナ）／フラダンス', genreId: 'stage-dance' },
        { start: '13:00', end: '13:30', title: 'BAD B!TCHE’S／ダンス', genreId: 'stage-dance' },
        { start: '13:30', end: '14:00', title: '小作台ジャズ・コンボ／ジャズ演奏', genreId: 'stage-gakki' },
        { start: '14:00', end: '14:30', title: 'ブルーパラダイス／歌謡バンド', genreId: 'stage-uta' },
        {
          start: '14:30',
          end: '15:00',
          title:
            'A-VICTORY DANCE STUDIO／ダンス【キッズチア、JHH（ジャズヒップホップ）、ロッキン、ポッピン、親父ダンス（仮）、おばダンス（仮）】',
          genreId: 'stage-dance',
        },
        { start: '15:00', end: '15:30', title: '太鼓芸術鼓宮舞／和太鼓', genreId: 'stage-gakki' },
        {
          start: '15:30',
          end: '16:00',
          title: 'マイキー（Maiky）／ギター弾き語り（演歌、洋楽のカバー曲、オリジナル曲も少々）',
          genreId: 'stage-uta',
        },
      ],
    },
  },
];
