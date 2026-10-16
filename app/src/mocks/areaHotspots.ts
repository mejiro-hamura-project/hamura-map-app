import type { AreaHotspot } from '../shared/types';

/**
 * 会場地図（base-map-第1会場.png）の上での、特殊区画のタップ範囲（会場番号→エリア配列）。
 * 範囲は地図の見た目に合わせて目で合わせた仮の値。説明文は会場図の記載と出店者一覧（PR展）から転記。
 * 第2〜第4会場は、新しい会場図から下地を作り直した後に追加する。
 */
export const AREA_HOTSPOTS_BY_VENUE: Record<number, AreaHotspot[]> = {
  1: [
    {
      id: 'area-playland',
      name: 'プレイランド',
      description: '恐竜キャラクターパーク、ふわふわ遊具、公園遊具体験など、子どもが遊べるエリアです。',
      notes: [
        '土：スポーツ体験（ラダーゲッター・モルック）／羽村市スポーツ推進委員協議会',
        '日：パットゴルフ',
      ],
      x: 26.2,
      y: 34.3,
      width: 39.3,
      height: 31.5,
    },
    {
      id: 'area-construction-booth',
      name: '建設業ブース',
      description: '射的、包丁研ぎ、まな板削りなど。',
      x: 70,
      y: 29.5,
      width: 9.5,
      height: 14.4,
    },
    {
      id: 'area-construction-machinery',
      name: '建設業重機',
      description: '重機の展示など。',
      x: 75,
      y: 45.2,
      width: 8.5,
      height: 22.6,
    },
    {
      id: 'area-food-education',
      name: 'はむら食育ステーション',
      description: '展示とゲームで楽しく食育を学べます。',
      notes: ['土：はむら食育ステーション', '日：農産物チャリティバザー'],
      x: 14,
      y: 73.3,
      width: 12.5,
      height: 12.3,
    },
  ],
};
