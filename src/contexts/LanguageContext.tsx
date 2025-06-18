
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Language = 'EN' | 'ES';

export interface AppTranslations {
  brandName: string;
  nav: {
    projects: string;
    about: string;
  };
  home: {
    hero: {
      line1: string;
      line2: string;
      line3?: string;
      subtitle: string;
    };
    buttons: {
      viewWork: string;
      aboutMe: string;
    }
  };
  // Add other sections/keys as needed
}

const translations: Record<Language, AppTranslations> = {
  EN: {
    brandName: "Alejandro Mejia - Multimedia Engineer",
    nav: {
      projects: "Projects",
      about: "About",
    },
    home: {
      hero: {
        line1: "Transforming Ideas",
        line2: "Into Interactive Worlds",
        subtitle: "Hello, I'm Alejandro. I design and develop interactive experiences by integrating game design, UX, and generative AI.\n\nExplore my work — let's build something amazing together.",
      },
      buttons: {
        viewWork: "View My Work",
        aboutMe: "About Me",
      }
    },
  },
  ES: {
    brandName: "Alejandro Mejía - Ingeniero en Multimedia",
    nav: {
      projects: "Proyectos",
      about: "Sobre mí",
    },
    home: {
      hero: {
        line1: "Transformando ideas",
        line2: "en mundos",
        line3: "interactivos",
        subtitle: "Hola, soy Alejandro. Diseño y desarrollo experiencias interactivas integrando game design, UX e IA generativa.\n\nExplora mi trabajo — construyamos algo increíble juntos.",
      },
      buttons: {
        viewWork: "Ver Mi Trabajo",
        aboutMe: "Sobre Mí",
      }
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translationsForLanguage: AppTranslations;
  isClientReady: boolean; // Added
  getEnglishTranslation: (keyPath: (translations: AppTranslations) => string) => string; // Helper
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('portfolio-ace-language') as Language | null;
    if (storedLanguage && (storedLanguage === 'EN' || storedLanguage === 'ES')) {
      return storedLanguage;
    }
  }
  return 'EN';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [isClientReady, setIsClientReady] = useState(false); // Added

  useEffect(() => {
    setIsClientReady(true); // Set client ready after mount
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-ace-language', lang);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentStoredLanguage = localStorage.getItem('portfolio-ace-language');
      if (language !== currentStoredLanguage) {
        localStorage.setItem('portfolio-ace-language', language);
      }
    }
  }, [language]);

  const getEnglishTranslation = useCallback((keyPath: (translations: AppTranslations) => string) => {
    return keyPath(translations['EN']);
  }, []);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, translationsForLanguage: translations[language], isClientReady, getEnglishTranslation }}>
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
