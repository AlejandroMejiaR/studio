
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
import type { Project, ProjectTranslationDetails } from '@/types';
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

// Only initialize Firebase if projectId is provided
if (firebaseConfig.projectId) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} else {
  // This warning will be logged on the server during build/dev and on the client.
  console.warn(
    'Firebase projectId is not configured. Firebase features will be disabled and data will be mocked.'
  );
}

// Helper to convert Firestore data to Project type
const mapDocToProject = (docId: string, data: any): Project => {
  const defaultEnTranslation: ProjectTranslationDetails = {
    title: 'English Title Missing',
    shortDescription: 'English short description missing.',
    problemStatement: '',
    solutionOverview: '',
    keyFeatures: [],
  };
  const defaultEsTranslation: ProjectTranslationDetails = {
    title: 'Título en Español Faltante',
    shortDescription: 'Descripción corta en español faltante.',
    problemStatement: '',
    solutionOverview: '',
    keyFeatures: [],
  };

  const finalEnData: ProjectTranslationDetails = data.en ? {
    title: data.en.title ?? defaultEnTranslation.title,
    shortDescription: data.en.shortDescription ?? defaultEnTranslation.shortDescription,
    problemStatement: data.en.problemStatement ?? defaultEnTranslation.problemStatement,
    solutionOverview: data.en.solutionOverview ?? defaultEnTranslation.solutionOverview,
    keyFeatures: data.en.keyFeatures ?? defaultEnTranslation.keyFeatures,
  } : defaultEnTranslation;

  const finalEsData: ProjectTranslationDetails = data.es ? {
    title: data.es.title ?? defaultEsTranslation.title,
    shortDescription: data.es.shortDescription ?? defaultEsTranslation.shortDescription,
    problemStatement: data.es.problemStatement ?? defaultEsTranslation.problemStatement,
    solutionOverview: data.es.solutionOverview ?? defaultEsTranslation.solutionOverview,
    keyFeatures: data.es.keyFeatures ?? defaultEsTranslation.keyFeatures,
  } : defaultEsTranslation;

  return {
    id: docId,
    slug: data.slug || `project-${docId}`, // Ensure slug exists
    category: data.category || 'Uncategorized',
    date: data.date || 'N/A',
    thumbnailUrl: data.thumbnailPath ? getSupabaseImageUrl('projects', data.thumbnailPath) : 'https://placehold.co/600x400.png',
    bannerUrl: data.bannerPath ? getSupabaseImageUrl('projects', data.bannerPath) : 'https://placehold.co/1200x600.png',
    technologies: data.technologies || [],
    galleryImages: data.galleryImagePaths ? data.galleryImagePaths.map((path: string) => getSupabaseImageUrl('projects', path)) : [],
    liveUrl: data.liveUrl || undefined,
    repoUrl: data.repoUrl || undefined,
    priority: data.priority,
    en: finalEnData,
    es: finalEsData,
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
    
    // Sort projects by priority. Lower numbers first. Projects without priority go to the end.
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
