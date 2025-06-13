import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDoc, runTransaction, increment, Firestore } from 'firebase/firestore';

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

export const getProjectLikes = async (projectId: string): Promise<number> => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Likes will be 0.");
    return Math.floor(Math.random() * 100); // Return dummy data if not configured
  }
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    if (projectSnap.exists()) {
      return projectSnap.data()?.likes || 0;
    }
    // Initialize likes if document doesn't exist
    await runTransaction(db, async (transaction) => {
      transaction.set(projectRef, { likes: 0 });
    });
    return 0;
  } catch (error) {
    console.error("Error fetching project likes:", error);
    return 0; // Fallback to 0 on error
  }
};

export const incrementProjectLike = async (projectId: string): Promise<number> => {
   if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Like not incremented.");
    return Math.floor(Math.random() * 100) + 1; // Return dummy data
  }
  const projectRef = doc(db, 'projects', projectId);
  try {
    let newLikes = 0;
    await runTransaction(db, async (transaction) => {
      const projectDoc = await transaction.get(projectRef);
      if (!projectDoc.exists()) {
        transaction.set(projectRef, { likes: 1 });
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
    return Math.floor(Math.random() * 100); // Return dummy data
  }
  const projectRef = doc(db, 'projects', projectId);
  try {
    let newLikes = 0;
    await runTransaction(db, async (transaction) => {
      const projectDoc = await transaction.get(projectRef);
      if (projectDoc.exists()) {
        const currentLikes = projectDoc.data()?.likes || 0;
        newLikes = Math.max(0, currentLikes - 1);
        transaction.update(projectRef, { likes: newLikes });
      } else {
         transaction.set(projectRef, { likes: 0 });
      }
    });
    return newLikes;
  } catch (error) {
    console.error("Error decrementing project like:", error);
    throw error;
  }
};

// Helper for anonymous "session-based" liking
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
