
const admin = require('firebase-admin');

// IMPORTANT: Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// to the path of your Firebase service account key JSON file before running this script.
// Example: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    // If GOOGLE_APPLICATION_CREDENTIALS is set, you don't need to pass credential here.
    // Otherwise, you can initialize with a credential object:
    // credential: admin.credential.cert(require('/path/to/your/serviceAccountKey.json')),
    // projectId: 'YOUR_FIRESTORE_PROJECT_ID' // Replace if not inferable
  });
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase Admin SDK already initialized.');
  } else {
    console.error('Firebase Admin SDK initialization error:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

const SOURCE_COLLECTION = 'projects';
const SOURCE_DOC_ID = 'project-showcase-platform'; // The document you want to duplicate
const TARGET_DOC_IDS = ['1', '2', '3']; // The new IDs for the duplicated documents

/**
 * Updates an image path to point to a new folder based on the target ID.
 * Assumes original path might be like "some_original_folder/image.filename.ext"
 * and transforms it to "targetId/image.filename.ext".
 * @param {string | undefined} originalPath The original image path.
 * @param {string} targetId The new folder name (which is the target document ID).
 * @returns {string | undefined} The updated path, or undefined if original was undefined.
 */
function updateImagePath(originalPath, targetId) {
  if (!originalPath || typeof originalPath !== 'string') {
    return undefined;
  }
  const parts = originalPath.split('/');
  if (parts.length > 0) {
    const filename = parts[parts.length - 1];
    return `${targetId}/${filename}`;
  }
  // If path is just a filename without a folder
  return `${targetId}/${originalPath}`;
}

async function duplicateDocument() {
  try {
    const sourceDocRef = db.collection(SOURCE_COLLECTION).doc(SOURCE_DOC_ID);
    const sourceDoc = await sourceDocRef.get();

    if (!sourceDoc.exists) {
      console.error(`Source document ${SOURCE_COLLECTION}/${SOURCE_DOC_ID} does not exist.`);
      return;
    }

    const sourceData = sourceDoc.data();
    if (!sourceData) {
      console.error(`Source document ${SOURCE_COLLECTION}/${SOURCE_DOC_ID} has no data.`);
      return;
    }

    console.log(`Fetched data from ${SOURCE_COLLECTION}/${SOURCE_DOC_ID}.`);

    for (const targetId of TARGET_DOC_IDS) {
      const newDocData = JSON.parse(JSON.stringify(sourceData)); // Deep clone

      // Modify fields for the new document
      newDocData.slug = `${sourceData.slug || 'project'}-${targetId}`;
      newDocData.title = `${sourceData.title || 'Project'} (Copy ${targetId})`;

      // Update image paths
      if (sourceData.thumbnailPath) {
        newDocData.thumbnailPath = updateImagePath(sourceData.thumbnailPath, targetId);
      }
      if (sourceData.bannerPath) {
        newDocData.bannerPath = updateImagePath(sourceData.bannerPath, targetId);
      }
      if (sourceData.galleryImagePaths && Array.isArray(sourceData.galleryImagePaths)) {
        newDocData.galleryImagePaths = sourceData.galleryImagePaths.map(p => updateImagePath(p, targetId)).filter(p => p !== undefined);
      }
      
      // Ensure likes field is initialized if it doesn't exist or is properly carried over
      if (newDocData.likes === undefined) {
        newDocData.likes = 0;
      }

      const targetDocRef = db.collection(SOURCE_COLLECTION).doc(targetId);
      await targetDocRef.set(newDocData);
      console.log(`Successfully created document ${SOURCE_COLLECTION}/${targetId}`);
    }

    console.log('Duplication process completed.');

  } catch (error) {
    console.error('Error duplicating document:', error);
  }
}

duplicateDocument().then(() => {
  // Optional: Close admin app if script is meant to exit
  // admin.app().delete().then(() => console.log('Firebase Admin App shut down.'));
}).catch(error => {
  console.error('Unhandled error in duplicateDocument:', error);
});
