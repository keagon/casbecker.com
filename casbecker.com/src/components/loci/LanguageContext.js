'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import en from './dictionaries/en.json';
import nl from './dictionaries/nl.json';

const dictionaries = { en, nl };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Check for saved preference or browser language
    try {
      const saved = localStorage.getItem('loci-language');
      if (saved && dictionaries[saved]) {
        setLocale(saved);
      } else {
        // Check browser language
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'nl') {
          setLocale('nl');
        }
      }
    } catch (e) {
      // localStorage not available
    }
  }, []);
  
  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'nl' : 'en';
    setLocale(newLocale);
    localStorage.setItem('loci-language', newLocale);
  };
  
  const t = dictionaries[locale];
  
  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
