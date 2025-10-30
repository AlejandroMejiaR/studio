
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment,
  DocumentData,
} from 'firebase/firestore';
import type { Project } from '@/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;

if (firebaseConfig.projectId) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} else {
  console.warn(
    'Firebase projectId is not configured. Firebase features will be disabled.'
  );
}

const mapDocToProject = (doc: DocumentData): Project => {
  const data = doc.data();
  return {
    id: doc.id,
    slug: data.slug,
    category: data.category,
    date: data.date,
    technologies: data.technologies,
    thumbnailUrl: data.thumbnailUrl,
    bannerUrl: data.bannerUrl,
    galleryImages: data.galleryImages || [],
    reflectionImageUrl: data.reflectionImageUrl,
    liveUrl: data.liveUrl,
    repoUrl: data.repoUrl,
    priority: data.priority,
    likeCount: data.likeCount || 0,
    en: data.en,
    es: data.es,
    type: data.type,
  };
};

export const getAllProjectsFromFirestore = async (): Promise<Project[]> => {
  if (!db) {
    console.log("Firebase is not configured. Returning empty project list.");
    return [];
  }

  try {
    const projectsCol = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCol);
    const projectList = projectSnapshot.docs.map(doc => mapDocToProject(doc));
    // Sort by priority if it exists
    projectList.sort((a, b) => (a.priority || 99) - (b.priority || 99));
    return projectList;
  } catch (error) {
    console.error("Error fetching projects from Firestore: ", error);
    return [];
  }
};

export const getProjectBySlugFromFirestore = async (slug: string): Promise<Project | undefined> => {
  if (!db) {
    console.log("Firebase is not configured. Returning undefined.");
    return undefined;
  }

  try {
    // Firestore uses document ID to fetch, and we are using slug as ID.
    const projectDocRef = doc(db, 'projects', slug);
    const projectSnap = await getDoc(projectDocRef);

    if (projectSnap.exists()) {
      return mapDocToProject(projectSnap);
    } else {
      console.log(`No project found with slug: ${slug}`);
      return undefined;
    }
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}: `, error);
    return undefined;
  }
};


export const incrementLikeCount = async (slug: string): Promise<void> => {
  if (!db) return;
  const projectRef = doc(db, 'projects', slug);
  await updateDoc(projectRef, {
    likeCount: increment(1)
  });
};

export const getLikeCount = async (slug: string): Promise<number> => {
    if (!db) return 0;
    const projectRef = doc(db, 'projects', slug);
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
        return docSnap.data().likeCount || 0;
    }
    return 0;
};
