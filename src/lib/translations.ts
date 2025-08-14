
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
      exploreMiniProjects: string;
    };
    featuredProjectsTitle: string;
    viewMoreProjects: string;
    caseStudiesTitle: string;
    creativeProjectsTitle: string;
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
    caseStudiesLink: string;
    miniProjectsLink: string;
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
        exploreMiniProjects: "Explore mini projects",
      },
      featuredProjectsTitle: "Featured Projects",
      viewMoreProjects: "View More Projects",
      caseStudiesTitle: "Case Studies",
      creativeProjectsTitle: "Mini Projects",
    },
    aboutMe: {
      title: "Hello Again!",
      paragraph1: "I am a Multimedia Engineer, passionate about video game design and development.",
      paragraph2: "I am motivated to transform ideas into solutions that are functional, visually attractive, and user-centered. My path in technology is guided by curiosity and an interest in problem-solving.",
      paragraph3: "",
      paragraph4: "I am constantly learning new things and remain open to opportunities that push me to grow personally and professionally.",
      workTogether: "Let's Work Together.",
      skillsTitle: "Skills",
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
      caseStudiesLink: "Case Studies",
      miniProjectsLink: "Mini Projects",
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
        subtitle: "¡Hola!\nSoy Alejandro\nDiseñador UX y de Videojuegos\nMe apasiona dar forma al futuro de la interacción digital — impulsada por IA.",
      },
      buttons: {
        viewWork: "Ver Mi Trabajo",
        aboutMe: "Sobre Mí",
        exploreMiniProjects: "Explora los mini proyectos",
      },
      featuredProjectsTitle: "Proyectos Destacados",
      viewMoreProjects: "Ver Más Proyectos",
      caseStudiesTitle: "Casos de Estudio",
      creativeProjectsTitle: "Mini Proyectos",
    },
    aboutMe: {
      title: "¡Hola de Nuevo!",
      paragraph1: "Soy Ingeniero Multimedia, apasionado por el diseño y desarrollo de videojuegos.",
      paragraph2: "Me motiva transformar ideas en soluciones que sean funcionales, visualmente atractivas y pensadas para el usuario, guiado por la curiosidad y el interés por resolver problemas.",
      paragraph3: "",
      paragraph4: "Estoy constantemente aprendiendo cosas nuevas y me mantengo abierto a oportunidades que me impulsen a crecer personal y profesionalmente.",
      workTogether: "Trabajemos Juntos.",
      skillsTitle: "Habilidades",
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
      education: {
        title: "Educación",
        course1: "Ingeniería Multimedia",
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
      caseStudiesLink: "Casos de estudio",
      miniProjectsLink: "Mini proyectos",
    },
    projectCard: {
      viewMore: "Ver más",
    },
  },
};

    
