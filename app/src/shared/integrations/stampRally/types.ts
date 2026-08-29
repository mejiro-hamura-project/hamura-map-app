/** チェックポイント1か所ぶんの取得状況 */
export interface StampRallyCheckpointStatus {
  /** stamp-rally側のチェックポイントID（1〜7）。Spot.stampCheckpointId と対応 */
  checkpointId: number;
  collected: boolean;
}

/**
 * 既存スタンプラリーの情報を「読むだけ」で受け取るための窓口。
 * 中身は書き換えず、この形を実装したものを差し替えて使う。
 * 現状スタンプラリーは別アプリのため接続できておらず、null を返す実装（placeholderPort）のみ用意している。
 * 詳細は docs/integration-notes.md を参照。
 */
export interface StampRallyReadPort {
  /** チェックポイントごとの取得状況一覧。まだ接続できていない場合は null */
  getCheckpointStatuses(): StampRallyCheckpointStatus[] | null;
}
