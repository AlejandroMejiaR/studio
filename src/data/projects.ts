
// This file is no longer the primary source for project data.
// Project data is now fetched from Firestore.
// See src/lib/firebase.ts for data fetching functions like
// getAllProjectsFromFirestore() and getProjectBySlugFromFirestore().

// You will need to set up a 'projects' collection in your Firestore database
// with documents matching the 'Project' type structure (see src/types/index.ts).
// For image fields (thumbnailUrl, bannerUrl, galleryImages), store relative paths
// in Firestore (e.g., "1/banner.png", "1/gallery_image.jpg").
// The fetching functions in src/lib/firebase.ts will convert these paths
// to full Supabase URLs using getSupabaseImageUrl().

// Example Firestore document structure for a project with ID 'project-example':
/*
{
  slug: "project-example-slug",
  title: "My Awesome Project",
  category: "Web Development",
  date: "Spring 2024",
  shortDescription: "A brief description of this amazing project.",
  thumbnailPath: "your_project_folder_in_supabase/thumbnail.png", // Store path
  dataAiHint: "keywords for ai image generation",
  bannerPath: "your_project_folder_in_supabase/banner.png",       // Store path
  technologies: ["React", "Next.js", "Tailwind CSS", "Firestore"],
  problemStatement: "The problem this project solves.",
  solutionOverview: "How this project solves the problem.",
  keyFeatures: [
    { title: "Feature 1", description: "Description of feature 1", icon: "Briefcase" },
    { title: "Feature 2", description: "Description of feature 2", icon: "Zap" }
  ],
  galleryImagePaths: [                                           // Store paths
    "your_project_folder_in_supabase/gallery_image1.png",
    "your_project_folder_in_supabase/gallery_image2.jpg"
  ],
  liveUrl: "https://example.com/live-demo",
  repoUrl: "https://github.com/your-username/project-repo",
  longDescriptionMarkdown: "## More details..." // Optional
  // The 'likes' field for projects is managed directly in Firestore by the like functions.
}
*/

// The getSupabaseImageUrl function is available in @/lib/supabase
// import { getSupabaseImageUrl } from '@/lib/supabase';

    