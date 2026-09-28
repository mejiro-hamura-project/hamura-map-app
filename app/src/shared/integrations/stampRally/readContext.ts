import { createContext } from 'react';
import type { StampRallyReadPort } from './types';
import { placeholderStampRallyPort } from './placeholderPort';

export const StampRallyReadContext = createContext<StampRallyReadPort>(placeholderStampRallyPort);
