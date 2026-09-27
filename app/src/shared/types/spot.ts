import type { StageKey } from './timetable';

/**
 * 地図上の1点。出店・団体・ステージ・エリアなどを表す中核エンティティ。
 * スタンプラリーのQR設置場所も、専用の型は作らずこの Spot（stampCheckpointId 付き）として扱う。
 */
export interface Spot {
  id: string;
  name: string;
  /** 名前の読み（ひらがな）。任意。前方一致検索で「やきそば」のようなかな入力にも一致させるために使う */
  reading?: string;
  categoryId: string;
  tagIds: string[];
  /** 出店の細かいジャンル（食べ物の種類・物販・ステージの演目など）。1店に1つの前提 */
  genreId?: string;
  description: string;
  images: string[];
  /** 表示する地図（VenueMap）のid */
  mapId: string;
  /** 所属する会場番号（1〜3）。「全体」地図では会場番号に関わらず全スポットを表示する */
  venueId?: number;
  /** 地図画像上のx座標（ImageMap用） */
  x: number;
  /** 地図画像上のy座標（ImageMap用） */
  y: number;
  /** 緯度（任意。GeoMap・GPS用） */
  lat?: number;
  /** 経度（任意。GeoMap・GPS用） */
  lng?: number;
  /** 開始/終了時刻（ステージ等のイベント系のみ。例："11:00〜"） */
  schedule?: string;
  eventId: string;
  /** スタンプラリーのチェックポイントIDと対応づける場合のみ設定 */
  stampCheckpointId?: number;
  /** このスポットがステージ（メイン/サブ）そのものを表す場合のみ設定。タイムテーブルの参照キーになる */
  stageKey?: StageKey;
}
