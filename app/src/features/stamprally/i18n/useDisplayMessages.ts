import { useMemo } from 'react';
import { useI18n } from './useI18n';
import { deepMerge, type Messages } from './index';
import { jaElementaryOverride } from './locales/ja';
import { isElementaryMode } from './elementaryMode';

type RegistrationLike = Parameters<typeof isElementaryMode>[0];

// register画面より後（rally〜exchange）で使う。学校区分が「小学生」の参加者にだけ、
// 通常表示（漢字を使ったしっかりした文章）の代わりに、ひらがな中心の言い回しを返す。
// 他言語では分ける必要が無いため、日本語表示のときだけ適用する。
export function useDisplayMessages(registration: RegistrationLike): Messages {
  const { m, locale } = useI18n();
  return useMemo(() => {
    if (locale === 'ja' && isElementaryMode(registration)) {
      return deepMerge(m, jaElementaryOverride);
    }
    return m;
  }, [m, locale, registration]);
}
