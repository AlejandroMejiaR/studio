
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

// This function should only be called on the client.
const getInitialLanguage = (): Language => {
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
  // 3. Default to English if detection fails or not 'es'
  return 'EN';
};


export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Always initialize with a static default ('EN') to prevent mismatch.
  // The server will render 'EN', and the client's first render will also be 'EN'.
  const [language, setLanguageState] = useState<Language>('EN');
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render (hydration).
    const initialLang = getInitialLanguage(); // Safely get the language from the browser
    setLanguageState(initialLang); // Update the language
    setIsClientReady(true); // Signal that client-side logic has run

    // Store the detected language if not already set by user choice, making it persist.
    if (localStorage.getItem('portfolio-ace-language') !== initialLang) {
        localStorage.setItem('portfolio-ace-language', initialLang);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

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
        translationsForLanguage: translations[language], // On first render, this is EN for both server/client.
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
