import type { ReactNode } from 'react';
import type { StampRallyReadPort } from './types';
import { StampRallyReadContext } from './readContext';

export function StampRallyReadProvider({ port, children }: { port: StampRallyReadPort; children: ReactNode }) {
  return <StampRallyReadContext.Provider value={port}>{children}</StampRallyReadContext.Provider>;
}
