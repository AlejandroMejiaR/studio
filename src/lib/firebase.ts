
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import type { Project } from '@/types';
import { placeholderProjects } from '@/lib/placeholder-data';

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

// NOTE: The functions below are now using placeholder data.
// Once you connect to your new Firebase project, this logic will need to be updated.

export const getAllProjectsFromFirestore = async (): Promise<Project[]> => {
  console.log("Using placeholder project data.");
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50)); 
  return placeholderProjects;
};

export const getProjectBySlugFromFirestore = async (slug: string): Promise<Project | undefined> => {
    console.log(`Using placeholder project data for slug: ${slug}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return placeholderProjects.find(p => p.slug === slug);
};

/**
 * Generates a public URL for an image.
 * In a real scenario, this would point to a service like Firebase Storage.
 * @param imagePath The path to the image file.
 * @returns A placeholder URL for now.
 */
export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath; // It's already a full URL
  }
  // For now, let's assume imagePath is just a placeholder identifier
  // We can return a generic placeholder or a more specific one if needed.
  return `https://placehold.co/600x400.png?text=${imagePath}`;
};
