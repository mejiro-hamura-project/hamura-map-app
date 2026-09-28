import { placeholderStampRallyPort } from './placeholderPort';
import type { StampRallyReadPort } from './types';

export * from './types';
export * from './placeholderPort';
export { StampRallyReadProvider } from './StampRallyReadProvider';
export { useStampRallyReadPort } from './useStampRallyReadPort';

/**
 * 指定したチェックポイントが取得済みかどうか。
 * 接続できていない（null が返ってきた）場合は、安全側に倒して「未取得」扱いにする。
 */
export function isCheckpointCollected(checkpointId: number, port: StampRallyReadPort = placeholderStampRallyPort): boolean {
  const statuses = port.getCheckpointStatuses();
  if (!statuses) return false;
  return statuses.some((status) => status.checkpointId === checkpointId && status.collected);
}
