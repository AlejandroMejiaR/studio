
'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Language = 'EN' | 'ES';

export interface AppTranslations {
  brandName: string;
  brandNameShort: string;
  nav: {
    projects: string;
    about: string;
    mobileMenuTitle: string;
  };
  home: {
    hero: {
      fullTitle: string[];
      subtitle: string;
    };
    buttons: {
      viewWork: string;
      aboutMe: string;
    };
    projectsSectionTitle: string;
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
  projectCard: {
    viewMore: string;
    technologiesLabel: string;
  };
  projectList: {
    noProjects: string;
  };
  projectDetails: {
    theChallenge: string;
    theApproach: string;
    keyFeaturesOutcomes: string;
    liveDemoButton: string;
    viewCodeButton: string;
  };
  likeButton: {
    unlikedTitle: string;
    unlikedDescription: string;
    likedTitle: string;
    likedDescription: string;
    errorTitle: string;
    errorDescription: string;
  };
  loadingScreen: {
    defaultText: string;
    loadingProject: string;
    returningHome: string;
  };
  footer: {
    portfolioTitle: string;
    rightsReservedText: string;
    quickLinksTitle: string;
    projectsLink: string;
    aboutMeLink: string;
  };
}

const translations: Record<Language, AppTranslations> = {
  EN: {
    brandName: "Alejandro Mejia - Multimedia Engineer",
    brandNameShort: "Alejandro Mejia",
    nav: {
      projects: "Projects",
      about: "About",
      mobileMenuTitle: "Mobile Navigation Menu",
    },
    home: {
      hero: {
        fullTitle: ["Transforming", "Ideas Into", "Interactive", "Worlds"],
        subtitle: "Hello! I'm Alejandro.\n\nI design and develop digital experiences\n\nCentered on UX\nDriven by AI\nPowered by Game Design.",
      },
      buttons: {
        viewWork: "View My Work",
        aboutMe: "About Me",
      },
      projectsSectionTitle: "My Projects",
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
        detail: "UX & Gen AI",
      },
      skillsTitle: "My Skills",
      downloadCVButton: "Download CV",
    },
    projectCard: {
      viewMore: "View More",
      technologiesLabel: "Technologies:",
    },
    projectList: {
      noProjects: "No projects to display yet. Check back soon!",
    },
    projectDetails: {
      theChallenge: "The Challenge",
      theApproach: "The Approach",
      keyFeaturesOutcomes: "Key Features & Outcomes",
      liveDemoButton: "Live Demo",
      viewCodeButton: "View Code",
    },
    likeButton: {
      unlikedTitle: "Unliked!",
      unlikedDescription: "You unliked this project.",
      likedTitle: "Liked!",
      likedDescription: "Thanks for liking this project!",
      errorTitle: "Error",
      errorDescription: "Could not update like status. Please try again.",
    },
    loadingScreen: {
      defaultText: "Loading...",
      loadingProject: "Loading Project...",
      returningHome: "Returning to Home...",
    },
    footer: {
      portfolioTitle: "Portfolio",
      rightsReservedText: "All rights reserved.",
      quickLinksTitle: "Quick Links",
      projectsLink: "Projects",
      aboutMeLink: "About Me",
    },
  },
  ES: {
    brandName: "Alejandro Mejía - Ingeniero en Multimedia",
    brandNameShort: "Alejandro Mejía",
    nav: {
      projects: "Proyectos",
      about: "Sobre mí",
      mobileMenuTitle: "Menú de Navegación Móvil",
    },
    home: {
      hero: {
        fullTitle: ["Transformando", "Ideas En", "Mundos", "Interactivos"],
        subtitle: "¡Hola! Soy Alejandro.\n\nDiseño y desarrollo experiencias digitales\n\nCentradas en UX\nImpulsadas por IA\nPotenciadas con Game Design.",
      },
      buttons: {
        viewWork: "Ver Mi Trabajo",
        aboutMe: "Sobre Mí",
      },
      projectsSectionTitle: "Mis Proyectos",
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
    projectCard: {
      viewMore: "Ver más",
      technologiesLabel: "Tecnologías:",
    },
    projectList: {
      noProjects: "Aún no hay proyectos para mostrar. ¡Vuelve pronto!",
    },
    projectDetails: {
      theChallenge: "El Desafío",
      theApproach: "El Enfoque",
      keyFeaturesOutcomes: "Características Clave y Resultados",
      liveDemoButton: "Demo en Vivo",
      viewCodeButton: "Ver Código",
    },
    likeButton: {
      unlikedTitle: "¡Ya no me gusta!",
      unlikedDescription: "Quitaste tu 'me gusta' de este proyecto.",
      likedTitle: "¡Me gusta!",
      likedDescription: "¡Gracias por darle 'me gusta' a este proyecto!",
      errorTitle: "Error",
      errorDescription: "No se pudo actualizar el estado de 'me gusta'. Por favor, inténtalo de nuevo.",
    },
    loadingScreen: {
      defaultText: "Cargando...",
      loadingProject: "Cargando Proyecto...",
      returningHome: "Volviendo al Inicio...",
    },
    footer: {
      portfolioTitle: "Portafolio",
      rightsReservedText: "Todos los derechos reservados.",
      quickLinksTitle: "Enlaces Rápidos",
      projectsLink: "Proyectos",
      aboutMeLink: "Sobre Mí",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translationsForLanguage: AppTranslations;
  isClientReady: boolean;
  getEnglishTranslation: (keyPath: (translations: AppTranslations) => string | string[] | undefined) => string | string[] | undefined;
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
  
  const getEnglishTranslation = useCallback((keyPath: (translations: AppTranslations) => string | string[] | undefined) => {
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
