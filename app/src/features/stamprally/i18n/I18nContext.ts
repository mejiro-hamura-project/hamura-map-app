import { createContext } from 'react';
import type { Messages } from './index';

export interface I18nValue {
  /** 実際に選ばれた表示言語（例: 'ja' / 'en'）。 */
  locale: string;
  /** ja を土台にマージ済みの完全なメッセージ。どのキーも undefined にならない。 */
  m: Messages;
}

export const I18nContext = createContext<I18nValue | null>(null);
