
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'Supabase URL or Anon Key is not configured. Please check your .env.local file. Image functionalities using Supabase will not work, or may use fallback behavior.'
    );
  } else {
    // In production, this might be a critical error depending on how Supabase is used.
    // For now, we'll allow the app to run but features will be degraded.
    console.error(
      'Supabase URL or Anon Key is not configured. This is required for image storage in production.'
    );
  }
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;

/**
 * Generates a public URL for an image stored in Supabase Storage.
 * @param bucketName The name of the Supabase Storage bucket.
 *   Make sure this bucket has appropriate public access policies set in Supabase.
 * @param filePath The path to the file within the bucket (e.g., 'folder/image.jpg').
 * @returns The public URL of the image, or a placeholder if Supabase is not configured.
 */
export const getSupabaseImageUrl = (bucketName: string, filePath: string): string => {
  if (!supabase) {
    console.warn('Supabase client is not initialized. Returning placeholder image URL.');
    // You might want to return a specific placeholder or handle this error differently
    return `https://placehold.co/600x400/CCCCCC/FFFFFF.png?text=Supabase+Issue`;
  }
  try {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (data && data.publicUrl) {
      return data.publicUrl;
    }
    console.warn(`Could not retrieve public URL for ${bucketName}/${filePath}. Check bucket policies and file path.`);
    return `https://placehold.co/600x400/CCCCCC/FFFFFF.png?text=URL+Error`;
  } catch (error) {
    console.error('Error getting Supabase image URL:', error);
    return `https://placehold.co/600x400/CCCCCC/FFFFFF.png?text=URL+Exception`;
  }
};

// Example of how you might use this in your project data:
// Assuming you have a bucket named 'project-images'
// In src/data/projects.ts:
// thumbnailUrl: getSupabaseImageUrl('project-images', 'project-showcase-platform/thumbnail.jpg'),
// bannerUrl: getSupabaseImageUrl('project-images', 'project-showcase-platform/banner.jpg'),
// galleryImages: [
//   getSupabaseImageUrl('project-images', 'project-showcase-platform/gallery1.jpg'),
//   getSupabaseImageUrl('project-images', 'project-showcase-platform/gallery2.jpg'),
// ],
