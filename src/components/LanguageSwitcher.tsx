import { LANGUAGES, useI18n } from '@/i18n/core';

export default function LanguageSwitcher() {
  const { lang, t, setLang } = useI18n();
  return (
    <div className="lang-switch" role="group" aria-label={t.ui.language}>
      {LANGUAGES.map((l) => (
        <button key={l.code} type="button" lang={l.htmlLang} title={l.name} aria-label={l.name} aria-pressed={lang === l.code} className={lang === l.code ? 'active' : ''} onClick={() => setLang(l.code)}>
          {l.short}
        </button>
      ))}
    </div>
  );
}
