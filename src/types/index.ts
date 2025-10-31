

export interface ProjectProcessStep {
  title: string;
  description: string;
  imageUrl: string;
}

export interface ProjectTranslationDetails {
  title: string;
  shortDescription: string;
  summary?: string;
  myRole?: string;
  problemStatement?: string;
  objectives?: string[];
  processIntro?: string;
  process?: ProjectProcessStep[];
  learnings?: string[];
}

export interface Project {
  id: string;
  slug: string;
  category: string;
  date: string;
  technologies: string[];
  thumbnailUrl: string;
  galleryImages?: string[];
  reflectionImageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  priority?: number;
  likeCount?: number;
  // Translatable content directly available
  en: ProjectTranslationDetails;
  es: ProjectTranslationDetails;
}
