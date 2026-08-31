import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'ur';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  script: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', dir: 'ltr', script: 'Latin' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', script: 'Devanagari' },
  { code: 'ur', label: 'Urdu', nativeName: 'اردو', dir: 'rtl', script: 'Arabic-Persian' }
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageOption[];
}

const STORAGE_KEY = 'vtw_language_preference';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import { UI_TRANSLATIONS } from '../i18n/translations';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'hi' || saved === 'ur') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const dir: 'ltr' | 'rtl' = language === 'ur' ? 'rtl' : 'ltr';
  const isRtl = dir === 'rtl';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }

    // Update document HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = dir;

    if (language === 'ur') {
      document.documentElement.classList.add('font-urdu');
      document.documentElement.classList.remove('font-hindi');
    } else if (language === 'hi') {
      document.documentElement.classList.add('font-hindi');
      document.documentElement.classList.remove('font-urdu');
    } else {
      document.documentElement.classList.remove('font-urdu', 'font-hindi');
    }
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = UI_TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = UI_TRANSLATIONS['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        isRtl,
        t,
        languages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
