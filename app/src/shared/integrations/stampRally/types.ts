/** QR設置位置1か所ぶんの取得状況 */
export interface StampRallyCheckpointStatus {
  /** 設置位置番号（1〜7）。内部のコース固有checkpoint IDとは区別する。 */
  checkpointId: number;
  collected: boolean;
}

/**
 * 既存スタンプラリーの情報を「読むだけ」で受け取るための窓口。
 * 中身は書き換えず、この形を実装したものを差し替えて使う。
 * appのcomposition箇所からfeatureのread adapterを注入する。
 * sharedはfeatureのUI/hookへ依存しない。
 */
export interface StampRallyReadPort {
  isRegistered(): boolean;
  /** チェックポイントごとの取得状況一覧。まだ接続できていない場合は null */
  getCheckpointStatuses(): StampRallyCheckpointStatus[] | null;
}
