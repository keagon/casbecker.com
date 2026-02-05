'use client';

import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { locale, toggleLanguage, t } = useLanguage();
  
  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full
                 backdrop-blur-md bg-white/70 border border-slate-200 
                 hover:bg-white hover:border-emerald-300 hover:shadow-lg
                 text-slate-700 font-medium text-sm
                 transition-all duration-300"
      aria-label={`Switch to ${locale === 'en' ? 'Dutch' : 'English'}`}
    >
      <span>{locale === 'en' ? '🇳🇱' : '🇬🇧'}</span>
      <span>{t.language.switch}</span>
    </button>
  );
}
