
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
  aboutMe: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    experienceCard: {
      title: string;
      detail: string;
    };
    projectsCard: {
      title: string;
      detailNumber: string;
      detailText: string;
    };
    focusCard: {
      title: string;
      detail: string;
    };
    skillsTitle: string;
    downloadCVButton: string;
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
    aboutMe: {
      title: "About Me",
      paragraph1: "Hello! I’m an aspiring Multimedia Engineer based in Bogotá, Colombia. I focus on interactive application development and interaction design (UX). My journey in tech is fueled by a love of problem-solving and by shaping digital solutions that are as functional as they are visually compelling.",
      paragraph2: "When I’m not coding, you’ll probably find me exploring new technology trends or enjoying a good cup of coffee. I strongly believe in continuous learning and am always looking to expand my skill set—open to new challenges and collaborations.",
      experienceCard: {
        title: "Experience",
        detail: "Continuous Learner",
      },
      projectsCard: {
        title: "Projects",
        detailNumber: "5+",
        detailText: "Web, Unity & Unreal prototyping",
      },
      focusCard: {
        title: "Focus",
        detail: "Game Design & Gen AI",
      },
      skillsTitle: "My Skills",
      downloadCVButton: "Download CV",
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
    aboutMe: {
      title: "Sobre mí",
      paragraph1: "¡Hola! Soy un aspirante a Ingeniero en Multimedia en Bogotá, Colombia. Me especializo en el desarrollo de aplicaciones interactivas y el diseño de interacción (UX). Mi camino en la tecnología está impulsado por una pasión por la resolución de problemas y por crear soluciones digitales que sean tan funcionales como visualmente atractivas.",
      paragraph2: "Cuando no estoy programando, probablemente me encuentres explorando nuevas tendencias tecnológicas o disfrutando de una buena taza de café. Creo firmemente en el aprendizaje continuo y siempre estoy buscando ampliar mis habilidades, abierto a nuevos desafíos y colaboraciones.",
      experienceCard: {
        title: "Experiencia",
        detail: "Aprendiz continuo",
      },
      projectsCard: {
        title: "Proyectos",
        detailNumber: "5+",
        detailText: "Prototipado en Web, Unity y Unreal",
      },
      focusCard: {
        title: "Enfoque",
        detail: "UX e IA generativa",
      },
      skillsTitle: "Mis Habilidades",
      downloadCVButton: "Descargar CV",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translationsForLanguage: AppTranslations;
  isClientReady: boolean;
  getEnglishTranslation: (keyPath: (translations: AppTranslations) => string | undefined) => string | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('portfolio-ace-language') as Language | null;
    if (storedLanguage && (storedLanguage === 'EN' || storedLanguage === 'ES')) {
      return storedLanguage;
    }
  }
  return 'EN'; // Default language
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true); // Client is ready after mount
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
  
  const getEnglishTranslation = useCallback((keyPath: (translations: AppTranslations) => string | undefined) => {
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
