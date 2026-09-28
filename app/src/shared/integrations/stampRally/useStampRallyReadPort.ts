import { useContext } from 'react';
import { StampRallyReadContext } from './readContext';

export function useStampRallyReadPort() {
  return useContext(StampRallyReadContext);
}
