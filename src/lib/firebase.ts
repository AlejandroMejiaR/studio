
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

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db: Firestore = getFirestore(app);

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

    en: {
      title: data.en?.title ?? defaultEnTranslation.title,
      shortDescription: data.en?.shortDescription ?? defaultEnTranslation.shortDescription,
      problemStatement: data.en?.problemStatement || defaultEnTranslation.problemStatement,
      solutionOverview: data.en?.solutionOverview || defaultEnTranslation.solutionOverview,
      keyFeatures: data.en?.keyFeatures || defaultEnTranslation.keyFeatures,
    },
    es: {
      title: data.es?.title ?? defaultEsTranslation.title,
      shortDescription: data.es?.shortDescription ?? defaultEsTranslation.shortDescription,
      problemStatement: data.es?.problemStatement || defaultEsTranslation.problemStatement,
      solutionOverview: data.es?.solutionOverview || defaultEsTranslation.solutionOverview,
      keyFeatures: data.es?.keyFeatures || defaultEsTranslation.keyFeatures,
    },
  };
};

export const getAllProjectsFromFirestore = async (): Promise<Project[]> => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Returning empty projects array.");
    return [];
  }
  try {
    const projectsCol = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCol);
    const projectList = projectSnapshot.docs.map(docSnap => mapDocToProject(docSnap.id, docSnap.data()));
    return projectList;
  } catch (error) {
    console.error("Error fetching all projects from Firestore:", error);
    return [];
  }
};

export const getProjectBySlugFromFirestore = async (slug: string): Promise<Project | undefined> => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Returning undefined for project.");
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

export const getProjectLikes = async (projectId: string): Promise<number> => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Mocking likes.");
    return Math.floor(Math.random() * 100); // Mock likes
  }
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    if (projectSnap.exists() && projectSnap.data().likes !== undefined) {
      return projectSnap.data().likes;
    }
    return 0; // Default to 0 if no likes field or project doesn't exist
  } catch (error) {
    console.error(`Error fetching likes for project ${projectId}:`, error);
    return 0; // Return 0 in case of error
  }
};

const updateLikesInFirestore = async (projectId: string, amount: number): Promise<number> => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Likes will not be updated in Firestore.");
    const currentLikes = await getProjectLikes(projectId); 
    return currentLikes + amount;
  }

  const projectRef = doc(db, 'projects', projectId);
  try {
    let finalLikes = 0;
    await runTransaction(db, async (transaction) => {
      const projectDoc = await transaction.get(projectRef);
      if (!projectDoc.exists()) {
        const initialLikes = amount > 0 ? amount : 0;
        transaction.set(projectRef, { likes: initialLikes }, { merge: true });
        finalLikes = initialLikes;
      } else {
        const currentLikes = projectDoc.data().likes || 0;
        const newLikes = Math.max(0, currentLikes + amount); 
        transaction.update(projectRef, { likes: newLikes });
        finalLikes = newLikes;
      }
    });
    return finalLikes;
  } catch (error) {
    console.error(`Error updating likes for project ${projectId} in Firestore:`, error);
    const currentLikes = await getProjectLikes(projectId);
    return currentLikes;
  }
};


export const incrementProjectLike = (projectId: string): Promise<number> => {
  return updateLikesInFirestore(projectId, 1);
};

export const decrementProjectLike = (projectId: string): Promise<number> => {
  return updateLikesInFirestore(projectId, -1);
};


// Session-based like tracking (client-side)
const LIKED_PROJECTS_KEY = 'portfolioAce_likedProjects';

export const hasSessionLiked = (projectId: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const likedProjects = JSON.parse(sessionStorage.getItem(LIKED_PROJECTS_KEY) || '{}');
    return !!likedProjects[projectId];
  } catch (error) {
    console.error("Error reading liked projects from session storage:", error);
    return false;
  }
};

export const setSessionLiked = (projectId: string, liked: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    const likedProjects = JSON.parse(sessionStorage.getItem(LIKED_PROJECTS_KEY) || '{}');
    if (liked) {
      likedProjects[projectId] = true;
    } else {
      delete likedProjects[projectId];
    }
    sessionStorage.setItem(LIKED_PROJECTS_KEY, JSON.stringify(likedProjects));
  } catch (error) {
    console.error("Error saving liked projects to session storage:", error);
  }
};
