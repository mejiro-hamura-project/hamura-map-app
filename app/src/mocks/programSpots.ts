import type { Spot } from '../shared/types';
import { STAGE_SPOTS } from './stageSpots';
import { MOCK_TIMETABLE } from './timetable';

/**
 * ステージの演目を、検索・ジャンル絞り込み・口コミの投稿先で扱えるスポット（Spot）にしたもの。
 * 演目のデータはタイムテーブル（mocks/timetable.ts）だけに置き、ここではそこから作る（二重に管理しない）。
 * 位置・会場は演目を行うステージ（メイン／サブ）と同じにする。
 */
function buildProgramSpots(): { spots: Spot[]; stageBySpotId: Map<string, Spot> } {
  const spots: Spot[] = [];
  const stageBySpotId = new Map<string, Spot>();
  for (const day of MOCK_TIMETABLE) {
    for (const stage of STAGE_SPOTS) {
      if (!stage.stageKey) continue;
      for (const program of day.stages[stage.stageKey]) {
        const schedule = `${day.dateLabel} ${program.start}〜${program.end}`;
        const spot: Spot = {
          id: `program-${day.date}-${stage.stageKey}-${program.start}`,
          name: program.title,
          categoryId: stage.categoryId,
          tagIds: [],
          genreId: program.genreId,
          description: `${schedule}・${stage.name}${stage.venueId != null ? `（第${stage.venueId}会場）` : ''}`,
          images: [],
          mapId: stage.mapId,
          x: stage.x,
          y: stage.y,
          schedule,
          eventId: stage.eventId,
          venueId: stage.venueId,
        };
        spots.push(spot);
        stageBySpotId.set(spot.id, stage);
      }
    }
  }
  return { spots, stageBySpotId };
}

const PROGRAM_SPOT_INDEX = buildProgramSpots();

/** 両日・両ステージの全演目 */
export const PROGRAM_SPOTS: Spot[] = PROGRAM_SPOT_INDEX.spots;

/** 演目のスポットを行うステージのスポット。演目以外は undefined */
export function findProgramStageSpot(spotId: string): Spot | undefined {
  return PROGRAM_SPOT_INDEX.stageBySpotId.get(spotId);
}
