import type { StampRallyReadPort } from './types';

/**
 * read adapterが注入されていない場合の安全なfallback。
 */
export const placeholderStampRallyPort: StampRallyReadPort = {
  isRegistered() {
    return false;
  },
  getCheckpointStatuses() {
    return null;
  },
};
