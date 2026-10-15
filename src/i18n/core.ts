import { createContext, useContext } from 'react';
import en, { type Dict } from './en';

export type Lang = 'en' | 'zh' | 'so' | 'ar';

export const LANGUAGES: { code: Lang; short: string; name: string; htmlLang: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', short: 'EN', name: 'English', htmlLang: 'en', dir: 'ltr' },
  { code: 'zh', short: '中文', name: '中文', htmlLang: 'zh-Hans', dir: 'ltr' },
  { code: 'so', short: 'SO', name: 'Soomaali', htmlLang: 'so', dir: 'ltr' },
  { code: 'ar', short: 'عربي', name: 'العربية', htmlLang: 'ar', dir: 'rtl' },
];

export const loaders: Record<Exclude<Lang, 'en'>, () => Promise<{ default: Dict }>> = {
  zh: () => import('./zh'),
  so: () => import('./so'),
  ar: () => import('./ar'),
};

/** `/so/...` -> 'so'; anything else -> null. */
export const langFromPath = (path: string): Lang | null => {
  const m = /^\/(so|ar|zh)(?:\/|$)/.exec(path);
  return m ? (m[1] as Lang) : null;
};

export const pathForLang = (lang: Lang): string => (lang === 'en' ? '/' : `/${lang}/`);

/** Maps browser language tags (e.g. "zh-CN", "ar-SA", "so") to a supported language. */
export const matchBrowserLanguage = (tags: readonly string[]): Lang | null => {
  for (const tag of tags) {
    const base = tag.toLowerCase().split('-')[0];
    if (base === 'en' || base === 'zh' || base === 'so' || base === 'ar') return base;
  }
  return null;
};

export interface I18nValue {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18nValue>({ lang: 'en', t: en, setLang: () => undefined });

export const useI18n = () => useContext(I18nContext);

