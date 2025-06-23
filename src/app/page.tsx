
import { getAllProjectsFromFirestore, getAllProjectLikes } from '@/lib/firebase';
import HomePageClient from '@/components/home/HomePageClient';

// Disable data caching for this page to ensure fresh data on each visit.
export const revalidate = 0;

export default async function HomePage() {
  const projects = await getAllProjectsFromFirestore();
  const projectIds = projects.map(p => p.id);
  const likes = projectIds.length > 0 ? await getAllProjectLikes(projectIds) : {};

  return <HomePageClient projects={projects} initialLikesMap={likes} />;
}
