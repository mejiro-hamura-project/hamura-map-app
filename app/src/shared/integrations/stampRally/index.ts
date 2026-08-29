import { placeholderStampRallyPort } from './placeholderPort';

export * from './types';
export * from './placeholderPort';

/** 今使う窓口の実体。差し替えるときはここだけ変える */
export const stampRallyPort = placeholderStampRallyPort;

/**
 * 指定したチェックポイントが取得済みかどうか。
 * 接続できていない（null が返ってきた）場合は、安全側に倒して「未取得」扱いにする。
 */
export function isCheckpointCollected(checkpointId: number): boolean {
  const statuses = stampRallyPort.getCheckpointStatuses();
  if (!statuses) return false;
  return statuses.some((status) => status.checkpointId === checkpointId && status.collected);
}
