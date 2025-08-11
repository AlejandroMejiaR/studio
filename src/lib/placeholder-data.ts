
import type { Project, ProjectTranslationDetails } from '@/types';

const createDefaultProcess = () => {
    const phases = ['Investigación', 'Definición', 'Ideación', 'Prototipado', 'Pruebas'];
    return phases.map((phase, index) => ({
      title: `${phase}`,
      description: `Descripción detallada de la fase de ${phase.toLowerCase()}.`,
      imageUrl: `https://placehold.co/800x600.png`,
    }));
  };
  
const enDetails: ProjectTranslationDetails = {
    title: 'Placeholder Project',
    shortDescription: 'This is a short description for an awesome placeholder project.',
    summary: 'This summary explains the placeholder project in more detail, outlining its main goals and achievements.',
    myRole: 'Lead Designer & Developer',
    problemStatement: 'The main problem was the lack of a proper project structure. This placeholder solves that.',
    objectives: ['Define a clear project structure.', 'Use placeholder data effectively.', 'Prepare for backend integration.'],
    processIntro: 'Our process was carefully planned to ensure a smooth transition from backend to placeholder data.',
    process: createDefaultProcess().map(p => ({...p, title: `Phase: ${p.title}`})),
    learnings: ['Learned how to mock data in Next.js.', 'Improved project structure for scalability.'],
};

const esDetails: ProjectTranslationDetails = {
    title: 'Proyecto de Ejemplo',
    shortDescription: 'Esta es una descripción corta para un increíble proyecto de ejemplo.',
    summary: 'Este resumen explica el proyecto de ejemplo con más detalle, describiendo sus objetivos y logros principales.',
    myRole: 'Diseñador y Desarrollador Principal',
    problemStatement: 'El problema principal era la falta de una estructura de proyecto adecuada. Este ejemplo lo soluciona.',
    objectives: ['Definir una estructura de proyecto clara.', 'Usar datos de ejemplo de manera efectiva.', 'Prepararse para la integración con el backend.'],
    processIntro: 'Nuestro proceso fue cuidadosamente planeado para asegurar una transición fluida del backend a los datos de ejemplo.',
    process: createDefaultProcess().map(p => ({...p, title: `Fase: ${p.title}`})),
    learnings: ['Aprendí a simular datos en Next.js.', 'Mejoré la estructura del proyecto para la escalabilidad.'],
};

export const placeholderProjects: Project[] = [
  {
    id: '1',
    slug: 'placeholder-project-1',
    type: 'case-study',
    category: 'Game Design',
    date: '2024',
    technologies: ['Unity', 'C#', 'Blender'],
    thumbnailUrl: 'https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/projects/1/gallery2.png',
    bannerUrl: 'https://placehold.co/1920x1080.png',
    galleryImages: [
        'https://placehold.co/800x600.png',
        'https://placehold.co/800x600.png',
        'https://placehold.co/800x600.png',
        'https://placehold.co/800x600.png',
    ],
    reflectionImageUrl: 'https://placehold.co/800x600.png',
    liveUrl: '#',
    repoUrl: '#',
    priority: 1,
    en: { ...enDetails, title: 'Case Study 1' },
    es: { ...esDetails, title: 'Caso de Estudio 1' },
  },
  {
    id: '2',
    slug: 'placeholder-project-2',
    type: 'case-study',
    category: 'UX Design',
    date: '2023',
    technologies: ['Figma', 'React', 'Firebase'],
    thumbnailUrl: 'https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/projects/1/banner.png',
    bannerUrl: 'https://placehold.co/1920x1080.png',
    galleryImages: [
        'https://placehold.co/800x600.png',
        'https://placehold.co/800x600.png',
        'https://placehold.co/800x600.png',
        'https://placehold.co/800x600.png',
    ],
    reflectionImageUrl: 'https://placehold.co/800x600.png',
    liveUrl: '#',
    repoUrl: '#',
    priority: 2,
    en: { ...enDetails, title: 'Case Study 2' },
    es: { ...esDetails, title: 'Caso de Estudio 2' },
  },
  {
    id: '3',
    slug: 'placeholder-project-3',
    type: 'creative',
    category: 'Web Development',
    date: '2023',
    technologies: ['Next.js', 'TailwindCSS', 'Vercel'],
    thumbnailUrl: 'https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/projects/1/banner.png',
    bannerUrl: 'https://placehold.co/1920x1080.png',
    galleryImages: [
        'https://placehold.co/800x600.png',
        'https://placehold.co/800x600.png',
        'https://placehold.co/800x600.png',
    ],
    reflectionImageUrl: 'https://placehold.co/800x600.png',
    liveUrl: '#',
    repoUrl: '#',
    priority: 3,
    en: { ...enDetails, title: 'Creative Project 1', shortDescription: 'A creative web project.' },
    es: { ...esDetails, title: 'Proyecto Creativo 1', shortDescription: 'Un proyecto web creativo.' },
  },
   {
    id: '4',
    slug: 'placeholder-project-4',
    type: 'creative',
    category: 'Generative Art',
    date: '2024',
    technologies: ['p5.js', 'JavaScript'],
    thumbnailUrl: 'https://placehold.co/600x400.png',
    bannerUrl: 'https://placehold.co/1920x1080.png',
    galleryImages: [
        'https://placehold.co/800x600.png',
        'https://placehold.co/800x600.png',
    ],
    reflectionImageUrl: 'https://placehold.co/800x600.png',
    liveUrl: '#',
    repoUrl: '#',
    priority: 4,
    en: { ...enDetails, title: 'Creative Project 2', shortDescription: 'Generative art showcase.' },
    es: { ...esDetails, title: 'Proyecto Creativo 2', shortDescription: 'Muestra de arte generativo.' },
  },
];
