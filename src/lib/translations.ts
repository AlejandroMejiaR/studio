export interface AppTranslations {
  brandName: string;
  brandNameShort: string;
  nav: {
    projects: string;
    about: string;
    mobileMenuTitle: string;
    changeLanguageHint: string;
    goBack: string;
  };
  home: {
    hero: {
      animatingTitle: string[];
      subtitle: string;
    };
    buttons: {
      viewWork: string;
      aboutMe: string;
      viewAllProjects: string;
    };
    featuredProjectsTitle: string;
    viewMoreProjects: string;
  };
  aboutMe: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    workTogether: string;
    skillsTitle: string;
    technologiesTitle: string;
    skills: {
      gameDesign: string;
      uxDesign: string;
      generativeAI: string;
      englishB2: string;
      coding: string;
    };
    jobTitle: string;
    jobSpecialization: string;
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
    technologiesTitle: string;
    liveDemoButton: string;
    viewCodeButton: string;
    otherProjectsTitle: string;
  };
  footer: {
    portfolioTitle: string;
    rightsReservedText: string;
    quickLinksTitle: string;
    projectsLink: string;
    aboutMeLink: string;
  };
  allProjectsPage: {
    title: string;
  };
}

export type Language = 'EN' | 'ES';

export const translations: Record<Language, AppTranslations> = {
  EN: {
    brandName: "Alejandro Mejia - Multimedia Engineer",
    brandNameShort: "Alejandro Mejia",
    nav: {
      projects: "Projects",
      about: "About",
      mobileMenuTitle: "Mobile Navigation Menu",
      changeLanguageHint: "Change Language",
      goBack: "Go Back",
    },
    home: {
      hero: {
        animatingTitle: ["Transforming", "Ideas Into", "Interactive", "Worlds"],
        subtitle: "Hello! I'm Alejandro\n\nI focus on designing and developing digital experiences\n\nCentered on UX\nDriven by AI\nPowered by Game Design\n\nLet's bring your idea to the digital world!",
      },
      buttons: {
        viewWork: "View My Work",
        aboutMe: "About Me",
        viewAllProjects: "View All Projects",
      },
      featuredProjectsTitle: "Featured Projects",
      viewMoreProjects: "View More Projects",
    },
    aboutMe: {
      title: "About Me",
      paragraph1: "Hello! I am an aspiring Multimedia Engineer, currently in my 10th semester in Bogotá, Colombia. I specialize in the development of interactive applications and interaction design (UX). My journey in technology is driven by a passion for problem-solving and for creating digital solutions that are both functional and visually appealing.",
      paragraph2: "I'm always learning, open to new challenges and collaborations.",
      workTogether: "Let's Work Together.",
      skillsTitle: "My Skills",
      technologiesTitle: "Technologies",
      skills: {
        gameDesign: "Game Design",
        uxDesign: "UX Design",
        generativeAI: "Generative AI",
        englishB2: "English B2",
        coding: "Coding",
      },
      jobTitle: "Multimedia Engineer",
      jobSpecialization: "Game · UX Designer",
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
      technologiesTitle: "Technologies",
      liveDemoButton: "Live Demo",
      viewCodeButton: "View Code",
      otherProjectsTitle: "Other Projects",
    },
    footer: {
      portfolioTitle: "Portfolio",
      rightsReservedText: "All rights reserved.",
      quickLinksTitle: "Quick Links",
      projectsLink: "Projects",
      aboutMeLink: "About Me",
    },
    allProjectsPage: {
      title: "All Projects",
    },
  },
  ES: {
    brandName: "Alejandro Mejía - Ingeniero en Multimedia",
    brandNameShort: "Alejandro Mejía",
    nav: {
      projects: "Proyectos",
      about: "Sobre mí",
      mobileMenuTitle: "Menú de Navegación Móvil",
      changeLanguageHint: "Cambiar Idioma",
      goBack: "Regresar",
    },
    home: {
      hero: {
        animatingTitle: ["Transforma", "Ideas En", "Mundos", "Interactivos"],
        subtitle: "¡Hola! Soy Alejandro\n\nMe enfoco en el diseño y desarrollo de experiencias digitales\n\nCentradas en UX\nImpulsadas por IA\nPotenciadas con Game Design\n\n¡Llevemos tu idea al mundo digital!",
      },
      buttons: {
        viewWork: "Ver Mi Trabajo",
        aboutMe: "Sobre Mí",
        viewAllProjects: "Ver Todos los Proyectos",
      },
      featuredProjectsTitle: "Proyectos Destacados",
      viewMoreProjects: "Ver Más Proyectos",
    },
    aboutMe: {
      title: "Sobre mí",
      paragraph1: "¡Hola! Soy un aspirante a Ingeniero en Multimedia, actualmente cursando el 10º semestre en Bogotá, Colombia. Me especializo en el desarrollo de aplicaciones interactivas y el diseño de interacción (UX). Mi camino en la tecnología está impulsado por una pasión por la resolución de problemas y por crear soluciones digitales que sean tanto funcionales como visualmente atractivas.",
      paragraph2: "Siempre estoy en constante aprendizaje, abierto a nuevos desafíos y colaboraciones.",
      workTogether: "Trabajemos Juntos.",
      skillsTitle: "Mis Habilidades",
      technologiesTitle: "Tecnologías",
      skills: {
        gameDesign: "Diseño de Juegos",
        uxDesign: "Diseño UX",
        generativeAI: "IA Generativa",
        englishB2: "Inglés B2",
        coding: "Programación",
      },
      jobTitle: "Ingeniero en Multimedia",
      jobSpecialization: "Game · UX Designer",
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
      technologiesTitle: "Tecnologías",
      liveDemoButton: "Demo en Vivo",
      viewCodeButton: "Ver Código",
      otherProjectsTitle: "Otros Proyectos",
    },
    footer: {
      portfolioTitle: "Portafolio",
      rightsReservedText: "Todos los derechos reservados.",
      quickLinksTitle: "Enlaces Rápidos",
      projectsLink: "Proyectos",
      aboutMeLink: "Sobre Mí",
    },
    allProjectsPage: {
      title: "Todos los Proyectos",
    },
  },
};
