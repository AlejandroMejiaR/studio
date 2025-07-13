
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
  projectList: {
    noProjects: string;
  };
  projectDetails: {
    // OLD KEYS
    theChallenge: string;
    theApproach: string;
    liveDemoButton: string;
    viewCodeButton: string;

    // NEW KEYS
    projectSummary: string;
    myRole: string;
    technologies: string;
    category: string;
    date: string;
    mainChallengeTitle: string;
    problemDescription: string;
    projectObjectives: string;
    processTitle: string;
    finalSolutionTitle: string;
    exploreLiveDemo: string;
    learningsAndReflections: string;
    myLearnings: string;
  };
  footer: {
    portfolioTitle: string;
    rightsReservedText: string;
    quickLinksTitle: string;
    projectsLink: string;
    aboutMeLink: string;
  };
  projectCard: {
    viewMore: string;
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
        animatingTitle: ["Transform", "Ideas Into", "Interactive", "Worlds"],
        subtitle: "Hello!\nI'm Alejandro\nUX & Game Designer\nI'm passionate about shaping the future of digital interaction — powered by AI.",
      },
      buttons: {
        viewWork: "View My Work",
        aboutMe: "About Me",
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
    projectList: {
      noProjects: "No projects to display yet. Check back soon!",
    },
    projectDetails: {
      theChallenge: "The Challenge",
      theApproach: "The Approach",
      liveDemoButton: "Live Demo",
      viewCodeButton: "View Code",
      projectSummary: "Project Summary",
      myRole: "My Role",
      technologies: "Technologies",
      category: "Category",
      date: "Date",
      mainChallengeTitle: "The Main Challenge",
      problemDescription: "Problem Description",
      projectObjectives: "Project Objectives",
      processTitle: "Our User-Centered Design Process",
      finalSolutionTitle: "The Final Solution: High-Fidelity Design",
      exploreLiveDemo: "Explore Live Demo",
      learningsAndReflections: "Learnings and Reflections",
      myLearnings: "My Learnings",
    },
    footer: {
      portfolioTitle: "Portfolio",
      rightsReservedText: "All rights reserved.",
      quickLinksTitle: "Quick Links",
      projectsLink: "Projects",
      aboutMeLink: "About",
    },
    projectCard: {
      viewMore: "View More",
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
        subtitle: "¡Hola!\nSoy Alejandro\nDiseñador UX y de Videojuegos\nMe apasiona dar forma al futuro de la interacción digital, impulsada por IA.",
      },
      buttons: {
        viewWork: "Ver Mi Trabajo",
        aboutMe: "Sobre Mí",
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
    projectList: {
      noProjects: "Aún no hay proyectos para mostrar. ¡Vuelve pronto!",
    },
    projectDetails: {
      theChallenge: "El Desafío",
      theApproach: "El Enfoque",
      liveDemoButton: "Demo en Vivo",
      viewCodeButton: "Ver Código",
      projectSummary: "Resumen del Proyecto",
      myRole: "Mi Rol",
      technologies: "Tecnologías",
      category: "Categoría",
      date: "Fecha",
      mainChallengeTitle: "El Desafío Principal",
      problemDescription: "Descripción del Problema",
      projectObjectives: "Objetivos del Proyecto",
      processTitle: "Nuestro Proceso de Diseño Centrado en el Usuario",
      finalSolutionTitle: "La Solución Final: Diseño de Alta Fidelidad",
      exploreLiveDemo: "Explorar Demo Interactiva",
      learningsAndReflections: "Aprendizajes y Reflexiones",
      myLearnings: "Mis Conclusiones",
    },
    footer: {
      portfolioTitle: "Portafolio",
      rightsReservedText: "Todos los derechos reservados.",
      quickLinksTitle: "Enlaces Rápidos",
      projectsLink: "Proyectos",
      aboutMeLink: "Sobre mí",
    },
    projectCard: {
      viewMore: "Ver más",
    },
  },
};
