import type { AreaHotspot } from '../shared/types';

/**
 * 会場地図の上での、特殊区画のタップ範囲（会場番号→エリア配列）。
 * 範囲は今年版の会場図（第4会場入り）に合わせた値。説明文は会場図の記載と出店者一覧（PR展）から転記し、
 * 内容がまだ届いていないエリアは description を省略している（ポップアップで「準備中」と出る）。
 */
export const AREA_HOTSPOTS_BY_VENUE: Record<number, AreaHotspot[]> = {
  1: [
    {
      id: 'area-agriculture',
      name: '農業展',
      description: '野菜の宝船、農産物の展示・即売。',
      notes: ['土：展示', '日：即売'],
      x: 11.7,
      y: 17.5,
      width: 15.2,
      height: 13.9,
    },
    {
      id: 'area-farm-stand',
      name: '農産物直売所',
      x: 12.2,
      y: 34.2,
      width: 6.1,
      height: 17.4,
    },
    {
      id: 'area-bonsai',
      name: '盆栽展',
      x: 12.2,
      y: 56,
      width: 4.1,
      height: 10.1,
    },
    {
      id: 'area-playland',
      name: 'プレイランド',
      description: 'スポーツ体験（ラダーゲッター・モルック）。羽村市スポーツ推進委員協議会の活動紹介もあります。',
      notes: ['10/31（土）のみ'],
      x: 25.9,
      y: 35.6,
      width: 40,
      height: 29.9,
    },
    {
      id: 'area-construction-booth',
      name: '建設業ブース',
      description: '射的、包丁研ぎ、まな板削りなど。',
      x: 69.5,
      y: 29.3,
      width: 10.1,
      height: 14.6,
    },
    {
      id: 'area-construction-machinery',
      name: '建設業重機',
      description: '重機の展示など。',
      x: 74.1,
      y: 44.6,
      width: 8.6,
      height: 22.9,
    },
    {
      id: 'area-food-education',
      name: 'はむら食育ステーション',
      notes: ['土：はむら食育ステーション', '日：農産物チャリティバザー'],
      x: 13.8,
      y: 73.1,
      width: 12.7,
      height: 12.5,
    },
    {
      id: 'area-consumer',
      name: '消費者展',
      x: 71.7,
      y: 74.7,
      width: 5.3,
      height: 6.3,
    },
  ],
  2: [
    {
      id: 'area-industry',
      name: '工業展',
      x: 23.6,
      y: 7.1,
      width: 10.4,
      height: 20.5,
    },
  ],
  4: [
    {
      id: 'area-tennis',
      name: 'テニス体験コーナー',
      description: 'テニスコート全面を使ったテニス体験コーナーです。',
      x: 18.4,
      y: 17.8,
      width: 51.9,
      height: 53.9,
    },
  ],
};
