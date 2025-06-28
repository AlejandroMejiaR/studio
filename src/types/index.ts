
export interface ProjectProcessStep {
  title: string;
  description: string;
  imagePath: string; // The raw path from Firestore
  imageUrl: string; // The full public URL
}

export interface ProjectTranslationDetails {
  title: string;
  shortDescription: string; // Keep for project card
  summary?: string; // Section 2
  myRole?: string; // Section 2
  problemStatement?: string; // Section 4
  objectives?: string[]; // Section 4
  processIntro?: string; // Section 5
  process?: ProjectProcessStep[]; // Section 5
  learnings?: string[]; // Section 7
}

export interface Project {
  id: string;
  slug: string;
  category: string;
  date: string;
  technologies: string[];
  thumbnailUrl: string;
  bannerUrl: string; // This can be the hero image in section 3
  galleryImages?: string[]; // These can be the collage in section 6
  reflectionImagePath?: string; // The raw path from Firestore
  reflectionImageUrl?: string; // The full public URL for section 7
  liveUrl?: string;
  repoUrl?: string;
  priority?: number;

  // Translatable content directly available
  en: ProjectTranslationDetails;
  es: ProjectTranslationDetails;
}
