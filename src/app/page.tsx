
import { placeholderProjects } from '@/lib/placeholder-data';
import HomePageClient from '@/components/home/HomePageClient';

// Disable data caching for this page to ensure fresh data on each visit.
export const revalidate = 0;

export default async function HomePage() {
  // This now fetches placeholder data until the new Firebase project is connected.
  const projects = placeholderProjects;
  
  return <HomePageClient projects={projects} />;
}
