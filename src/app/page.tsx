
import { getAllProjectsFromFirestore } from '@/lib/firebase';
import type { Project } from '@/types';
import ProjectsSection from '@/components/home/ProjectsSection';
import HeroSection from '@/components/home/HeroSection';
import { SectionContainer } from '@/components/layout/SectionContainer';

// Disable data caching for this page to ensure fresh data on each visit.
export const revalidate = 0;

export default async function HomePage() {
  const projects: Project[] = await getAllProjectsFromFirestore();
  
  return (
    <>
      <HeroSection />
      
      <SectionContainer className="pt-24 pb-16 md:pt-32 md:pb-24">
        <ProjectsSection projects={projects} />
      </SectionContainer>
    </>
  );
}
