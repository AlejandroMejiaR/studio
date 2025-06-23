
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, type Language, type AppTranslations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translationsForLanguage: AppTranslations;
  isClientReady: boolean;
  getEnglishTranslation: <T>(keyPath: (translations: AppTranslations) => T) => T | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    // 1. Check localStorage first (user's explicit choice via navbar toggle)
    const storedLanguage = localStorage.getItem('portfolio-ace-language') as Language | null;
    if (storedLanguage && (storedLanguage === 'EN' || storedLanguage === 'ES')) {
      return storedLanguage;
    }

    // 2. If no stored preference, detect browser language
    const browserLanguage = navigator.language || (navigator as any).userLanguage; // For older IE
    if (browserLanguage) {
      if (browserLanguage.toLowerCase().startsWith('es')) {
        return 'ES'; // Spanish if browser is Spanish
      }
    }
  }
  // 3. Default to English if detection fails, not 'es', or window is not defined
  return 'EN';
};


export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Set client ready and ensure language reflects initial detection or stored value
    setIsClientReady(true);
    const initialLang = getInitialLanguage();
    if (language !== initialLang) {
        setLanguageState(initialLang);
    }
    // Store the determined language in localStorage if it wasn't already there
    // from a previous explicit user choice. This makes the detected language "stick"
    // until the user changes it with the toggle.
    if (localStorage.getItem('portfolio-ace-language') !== initialLang) {
        localStorage.setItem('portfolio-ace-language', initialLang);
    }
  }, []); // Runs once on mount, language dependency removed to avoid loop with setLanguageState

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-ace-language', lang);
    }
  }, []);
  
  const getEnglishTranslation = useCallback(<T,>(keyPath: (translations: AppTranslations) => T) => {
    if (translations['EN']) {
      const value = keyPath(translations['EN']);
      return value;
    }
    return undefined; 
  }, []);


  return (
    <LanguageContext.Provider value={{ 
        language, 
        setLanguage, 
        translationsForLanguage: translations[language] || translations[getInitialLanguage()], 
        isClientReady, 
        getEnglishTranslation,
      }}>
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
