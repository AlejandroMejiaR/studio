
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  runTransaction,
  increment,
  Firestore,
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import type { Project, ProjectTranslationDetails, ProjectProcessStep } from '@/types';
import { getSupabaseImageUrl } from '@/lib/supabase';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

if (firebaseConfig.projectId) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} else {
  console.warn(
    'Firebase projectId is not configured. Firebase features will be disabled and data will be mocked.'
  );
}

const createDefaultProcess = (): ProjectProcessStep[] => {
  const phases = ['Investigación', 'Definición', 'Ideación', 'Prototipado', 'Pruebas'];
  return phases.map((phase, index) => ({
    title: `${phase} - Título pendiente`,
    description: `Descripción para la fase de ${phase.toLowerCase()} pendiente de añadir desde Firebase.`,
    imagePath: '',
    imageUrl: `https://placehold.co/800x600.png?text=Fase+${index + 1}`,
  }));
};

const mapTranslationDetails = (data: any = {}): ProjectTranslationDetails => {
  const defaultProcess = createDefaultProcess();
  return {
    title: data.title ?? 'Título pendiente',
    shortDescription: data.shortDescription ?? 'Descripción corta pendiente.',
    summary: data.summary ?? 'Resumen del proyecto pendiente de añadir desde Firebase.',
    myRole: data.myRole ?? 'Rol en el proyecto pendiente.',
    problemStatement: data.problemStatement ?? 'Planteamiento del problema pendiente de añadir desde Firebase.',
    objectives: data.objectives ?? ['- Objetivo 1 pendiente.', '- Objetivo 2 pendiente.'],
    processIntro: data.processIntro ?? 'Introducción al proceso de diseño pendiente de añadir desde Firebase.',
    process: data.process ? (data.process as any[]).map(p => ({
      title: p.title || 'Título de fase pendiente',
      description: p.description || 'Descripción de fase pendiente',
      imagePath: p.imagePath || '',
      imageUrl: p.imagePath ? getSupabaseImageUrl('projects', p.imagePath) : `https://placehold.co/800x600.png?text=Imagen+Fase`,
    })) : defaultProcess,
    learnings: data.learnings ?? ['- Aprendizaje 1 pendiente.', '- Aprendizaje 2 pendiente.'],
  };
};

const mapDocToProject = (docId: string, data: any): Project => {
  return {
    id: docId,
    slug: data.slug || `project-${docId}`,
    category: data.category || 'Uncategorized',
    date: data.date || 'N/A',
    technologies: data.technologies || [],
    priority: data.priority,
    liveUrl: data.liveUrl || undefined,
    repoUrl: data.repoUrl || undefined,
    
    thumbnailUrl: data.thumbnailPath ? getSupabaseImageUrl('projects', data.thumbnailPath) : 'https://placehold.co/600x400.png',
    bannerUrl: data.bannerPath ? getSupabaseImageUrl('projects', data.bannerPath) : 'https://placehold.co/1920x1080.png',
    galleryImages: data.galleryImagePaths ? data.galleryImagePaths.map((path: string) => getSupabaseImageUrl('projects', path)) : [
      'https://placehold.co/600x600.png?text=Final+1',
      'https://placehold.co/600x600.png?text=Final+2',
      'https://placehold.co/600x600.png?text=Final+3',
      'https://placehold.co/600x600.png?text=Final+4',
    ],
    reflectionImagePath: data.reflectionImagePath || '',
    reflectionImageUrl: data.reflectionImagePath ? getSupabaseImageUrl('projects', data.reflectionImagePath) : 'https://placehold.co/600x400.png?text=Reflexión',

    en: mapTranslationDetails(data.en),
    es: mapTranslationDetails(data.es),
  };
};

export const getAllProjectsFromFirestore = async (): Promise<Project[]> => {
  if (!db) {
    console.warn("Firebase is not configured. Returning empty projects array.");
    return [];
  }
  try {
    const projectsCol = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCol);
    const projectList = projectSnapshot.docs.map(docSnap => mapDocToProject(docSnap.id, docSnap.data()));
    
    projectList.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

    return projectList;
  } catch (error) {
    console.error("Error fetching all projects from Firestore:", error);
    return [];
  }
};

export const getProjectBySlugFromFirestore = async (slug: string): Promise<Project | undefined> => {
  if (!db) {
    console.warn("Firebase is not configured. Returning undefined for project.");
    return undefined;
  }
  try {
    const projectsCol = collection(db, 'projects');
    const q = query(projectsCol, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const projectDoc = querySnapshot.docs[0];
      return mapDocToProject(projectDoc.id, projectDoc.data());
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching project by slug "${slug}" from Firestore:`, error);
    return undefined;
  }
};
