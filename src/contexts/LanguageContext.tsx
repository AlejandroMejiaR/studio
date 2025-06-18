
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
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Function to get initial language from localStorage or default
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') { // Ensure this only runs on client
    const storedLanguage = localStorage.getItem('portfolio-ace-language') as Language | null;
    if (storedLanguage && (storedLanguage === 'EN' || storedLanguage === 'ES')) {
      return storedLanguage;
    }
  }
  return 'EN'; // Default language
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with value from localStorage if available, otherwise default.
  // This function (getInitialLanguage) runs only on the initial render on the client.
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // setLanguage function to update state and localStorage
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-ace-language', lang);
    }
  }, []);

  // This useEffect ensures that localStorage is updated if the initial language was the default
  // (because localStorage was empty/invalid), or if the language state changes for other reasons.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentStoredLanguage = localStorage.getItem('portfolio-ace-language');
      // If language in state is different from localStorage, update localStorage.
      // This covers the case where getInitialLanguage defaulted and localStorage was empty,
      // ensuring the default language is persisted.
      if (language !== currentStoredLanguage) {
        localStorage.setItem('portfolio-ace-language', language);
      }
    }
  }, [language]); // Rerun when language state changes

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translationsForLanguage: translations[language] }}>
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
