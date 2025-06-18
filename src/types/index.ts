
export interface ProjectTranslationDetails {
  title: string;
  shortDescription: string;
  problemStatement?: string;
  solutionOverview?: string;
  keyFeatures?: { title: string; description: string; icon?: string }[];
  longDescriptionMarkdown?: string;
}

export interface Project {
  id: string;
  slug: string;
  category: string;
  date: string;
  technologies: string[];
  thumbnailUrl: string;
  bannerUrl: string;
  galleryImages?: string[];
  liveUrl?: string;
  repoUrl?: string;

  // Translatable content directly available
  en: ProjectTranslationDetails;
  es: ProjectTranslationDetails;
}
