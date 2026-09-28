import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { getBrowserLocales, getMessages, resolveLocale } from './index';
import { I18nContext, type I18nValue } from './I18nContext';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState(() => resolveLocale(getBrowserLocales()));

  // 端末やブラウザの設定言語が変わったら、表示言語も追従する。
  useEffect(() => {
    const handleLanguageChange = () => {
      setLocale(resolveLocale(getBrowserLocales()));
    };
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const value = useMemo<I18nValue>(() => ({ locale, m: getMessages(locale) }), [locale]);

  return (
    <I18nContext.Provider value={value}>
      <section lang={locale} className="stamprally flex h-full min-h-0 flex-col bg-[#f7f3ec] text-[#2f2a24]">
        {children}
      </section>
    </I18nContext.Provider>
  );
}
