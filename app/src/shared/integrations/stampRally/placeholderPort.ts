import type { StampRallyReadPort } from './types';

/**
 * 現時点の仮実装。
 * スタンプラリー本体（stamp-rally/）は今のところ独立した別アプリで、
 * 取得状況を外から読む手段がまだ無いため、常に null（＝わからない）を返す。
 * M3で、スタンプラリー側に読み取り用の関数が追加され次第、本物の実装に差し替える。
 */
export const placeholderStampRallyPort: StampRallyReadPort = {
  getCheckpointStatuses() {
    return null;
  },
};
