
import { getAllProjectsFromFirestore } from '@/lib/firebase';
import HomePageClient from '@/components/home/HomePageClient';
import type { Project } from '@/types';
import ProjectsSection from '@/components/home/ProjectsSection';
import { SectionContainer } from '@/components/layout/SectionContainer';

// Disable data caching for this page to ensure fresh data on each visit.
export const revalidate = 0;

export default async function HomePage() {
  const projects: Project[] = await getAllProjectsFromFirestore();
  
  return (
    <>
      <HomePageClient projects={projects} />
      
      <SectionContainer className="pt-24 pb-16 md:pt-32 md:pb-24">
        <ProjectsSection projects={projects} />
      </SectionContainer>
    </>
  );
}
