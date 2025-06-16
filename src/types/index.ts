
export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  shortDescription: string;
  problemStatement?: string;
  solutionOverview?: string;
  keyFeatures?: { title: string; description: string; icon?: string }[]; // Changed React.ElementType to string
  technologies: string[];
  thumbnailUrl: string;
  bannerUrl: string;
  galleryImages?: string[];
  liveUrl?: string;
  repoUrl?: string;
  longDescriptionMarkdown?: string; // For more detailed content if needed
}
