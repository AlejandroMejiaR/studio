
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
    projectsTitle: string;
    viewMoreProjects: string;
  };
  aboutMe: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    paragraph4: string;
    workTogether: string;
    skillsTitle: string;
    technologiesTitle: string;
    skills: {
      gameDesign: string;
      uxDesign: string;
      generativeAI: string;
      englishB2: string;
      coding: string;
      gameDevelopment: string;
    };
    jobTitle: string;
    jobSpecialization: string;
    education: {
      title: string;
      course1: string;
    };
    coursesTitle: string;
    tech_areas: {
      design: string;
      develop: string;
      management: string;
    };
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
    viewCaseStudy: string;
  };
  footer: {
    portfolioTitle: string;
    rightsReservedText: string;
    quickLinksTitle: string;
    aboutMeLink: string;
    projectsLink: string;
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
        subtitle: "Hello!\nI'm Alejandro\nGame Developer\nUX Designer\nI'm passionate about shaping the future of digital interaction — powered by AI.",
      },
      buttons: {
        viewWork: "View My Work",
        aboutMe: "About Me",
      },
      projectsTitle: "Projects",
      viewMoreProjects: "View More Projects",
    },
    aboutMe: {
      title: "Hello Again!",
      paragraph1: "I am a Multimedia Engineer with a passion for video game design and development. I am driven by the curiosity and interest in problem-solving that guide me to transform ideas into functional, visually attractive, and user-centered solutions.",
      paragraph2: "I am always learning new things and remain open to opportunities that challenge me to grow personally and professionally.",
      paragraph3: "",
      paragraph4: "",
      workTogether: "Let's Work Together.",
      skillsTitle: "Skills",
      technologiesTitle: "Technologies",
      skills: {
        gameDesign: "Game Design",
        uxDesign: "UX Design",
        generativeAI: "Generative AI",
        englishB2: "English B2",
        coding: "Coding",
        gameDevelopment: "Game Development",
      },
      jobTitle: "Multimedia Engineer",
      jobSpecialization: "Game · UX Designer",
      education: {
        title: "Education",
        course1: "Multimedia Engineering",
      },
      coursesTitle: "Courses & Certificates",
      tech_areas: {
        design: "Design",
        develop: "Develop",
        management: "Management",
      },
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
      viewCaseStudy: "View Case Study",
    },
    footer: {
      portfolioTitle: "Portfolio",
      rightsReservedText: "All rights reserved.",
      quickLinksTitle: "Quick Links",
      aboutMeLink: "About",
      projectsLink: "Projects",
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
        subtitle: "¡Hola!\nSoy Alejandro\nDesarrollador de Videojuegos\nDiseñador UX\nMe apasiona dar forma al futuro de la interacción digital — impulsada por IA.",
      },
      buttons: {
        viewWork: "Ver Mi Trabajo",
        aboutMe: "Sobre Mí",
      },
      projectsTitle: "Proyectos",
      viewMoreProjects: "Ver Más Proyectos",
    },
    aboutMe: {
      title: "¡Hola de Nuevo!",
      paragraph1: "Soy Ingeniero en Multimedia apasionado por el diseño y el desarrollo de videojuegos. Me impulsa la curiosidad y el interés por resolver problemas, que me guían para transformar ideas en soluciones funcionales, visualmente atractivas y centradas en el usuario.",
      paragraph2: "Siempre estoy aprendiendo cosas nuevas y me mantengo abierto a oportunidades que me desafíen a crecer personal y profesionalmente.",
      paragraph3: "",
      paragraph4: "",
      workTogether: "Trabajemos Juntos.",
      skillsTitle: "Habilidades",
      technologiesTitle: "Tecnologías",
      skills: {
        gameDesign: "Diseño de Juegos",
        uxDesign: "Diseño UX",
        generativeAI: "IA Generativa",
        englishB2: "Inglés B2",
        coding: "Programación",
        gameDevelopment: "Desarrollo de Juegos",
      },
      jobTitle: "Ingeniero en Multimedia",
      jobSpecialization: "Game · UX Designer",
      education: {
        title: "Educación",
        course1: "Ingeniería en Multimedia",
      },
      coursesTitle: "Cursos y Certificados",
      tech_areas: {
        design: "Diseño",
        develop: "Desarrollo",
        management: "Gestión",
      },
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
      viewCaseStudy: "Ver caso de estudio",
    },
    footer: {
      portfolioTitle: "Portafolio",
      rightsReservedText: "Todos los derechos reservados.",
      quickLinksTitle: "Enlaces Rápidos",
      aboutMeLink: "Sobre mí",
      projectsLink: "Proyectos",
    },
    projectCard: {
      viewMore: "Ver más",
    },
  },
};
