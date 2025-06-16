
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
import type { Project } from '@/types';
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
  // Convert Firestore Timestamps to string dates if applicable for 'date' field
  // Assuming 'date' in Firestore might be a Timestamp or already a string.
  // If it's a string from Firestore, this conversion won't harm it.
  // If it's a Timestamp, it needs conversion. For simplicity, we'll assume it's stored as a string.
  // If it were a Timestamp: const date = data.date instanceof Timestamp ? data.date.toDate().toLocaleDateString() : data.date;
  
  return {
    id: docId,
    slug: data.slug || '',
    title: data.title || '',
    category: data.category || '',
    date: data.date || '', // Assuming date is stored as a string that fits 'Summer 2023' format
    shortDescription: data.shortDescription || '',
    thumbnailUrl: data.thumbnailPath ? getSupabaseImageUrl('projects', data.thumbnailPath) : 'https://placehold.co/600x400.png',
    dataAiHint: data.dataAiHint || 'project image',
    bannerUrl: data.bannerPath ? getSupabaseImageUrl('projects', data.bannerPath) : 'https://placehold.co/1200x600.png',
    technologies: data.technologies || [],
    problemStatement: data.problemStatement,
    solutionOverview: data.solutionOverview,
    keyFeatures: data.keyFeatures || [],
    galleryImages: data.galleryImagePaths ? data.galleryImagePaths.map((path: string) => getSupabaseImageUrl('projects', path)) : [],
    liveUrl: data.liveUrl,
    repoUrl: data.repoUrl,
    longDescriptionMarkdown: data.longDescriptionMarkdown,
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
    console.warn("Firebase projectId is not configured. Likes will be mocked.");
    return Math.floor(Math.random() * 100); 
  }
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    if (projectSnap.exists()) {
      return projectSnap.data()?.likes || 0;
    }
    // Initialize likes if document doesn't exist and has 'likes' field.
    // This part might be optional if projects are always created with a 'likes' field.
    // For now, we assume 'likes' field might not exist and default to 0.
    // If you ensure all project docs have 'likes', you might not need to write it here.
    // await runTransaction(db, async (transaction) => {
    //   transaction.set(projectRef, { likes: 0 }, { merge: true }); // merge true to not overwrite other fields
    // });
    return 0;
  } catch (error) {
    console.error("Error fetching project likes:", error);
    return 0; 
  }
};

export const incrementProjectLike = async (projectId: string): Promise<number> => {
   if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Like not incremented.");
    return Math.floor(Math.random() * 100) + 1; 
  }
  const projectRef = doc(db, 'projects', projectId);
  try {
    let newLikes = 0;
    await runTransaction(db, async (transaction) => {
      const projectDoc = await transaction.get(projectRef);
      if (!projectDoc.exists() || typeof projectDoc.data()?.likes === 'undefined') {
        // If doc doesn't exist or likes field is missing, set likes to 1
        transaction.set(projectRef, { likes: 1 }, { merge: true });
        newLikes = 1;
      } else {
        const currentLikes = projectDoc.data()?.likes || 0;
        newLikes = currentLikes + 1;
        transaction.update(projectRef, { likes: increment(1) });
      }
    });
    return newLikes;
  } catch (error) {
    console.error("Error incrementing project like:", error);
    throw error;
  }
};

export const decrementProjectLike = async (projectId: string): Promise<number> => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Like not decremented.");
    return Math.floor(Math.random() * 100); 
  }
  const projectRef = doc(db, 'projects', projectId);
  try {
    let newLikes = 0;
    await runTransaction(db, async (transaction) => {
      const projectDoc = await transaction.get(projectRef);
      if (projectDoc.exists() && typeof projectDoc.data()?.likes !== 'undefined') {
        const currentLikes = projectDoc.data()?.likes || 0;
        newLikes = Math.max(0, currentLikes - 1);
        transaction.update(projectRef, { likes: newLikes });
      } else {
         // If doc doesn't exist or likes field is missing, set likes to 0
         transaction.set(projectRef, { likes: 0 }, { merge: true });
         newLikes = 0;
      }
    });
    return newLikes;
  } catch (error) {
    console.error("Error decrementing project like:", error);
    throw error;
  }
};

export const hasSessionLiked = (projectId: string): boolean => {
  if (typeof window !== 'undefined') {
    const likedProjects = JSON.parse(localStorage.getItem('portfolioAceLikedProjects') || '[]');
    return likedProjects.includes(projectId);
  }
  return false;
};

export const setSessionLiked = (projectId: string, liked: boolean): void => {
  if (typeof window !== 'undefined') {
    let likedProjects: string[] = JSON.parse(localStorage.getItem('portfolioAceLikedProjects') || '[]');
    if (liked) {
      if (!likedProjects.includes(projectId)) {
        likedProjects.push(projectId);
      }
    } else {
      likedProjects = likedProjects.filter(id => id !== projectId);
    }
    localStorage.setItem('portfolioAceLikedProjects', JSON.stringify(likedProjects));
  }
};

export { db, app };

    