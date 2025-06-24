
import { getAllProjectsFromFirestore } from '@/lib/firebase';
import HomePageClient from '@/components/home/HomePageClient';

// Disable data caching for this page to ensure fresh data on each visit.
export const revalidate = 0;

export default async function HomePage() {
  const projects = await getAllProjectsFromFirestore();
  
  return <HomePageClient projects={projects} />;
}
