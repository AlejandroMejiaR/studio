
import { placeholderProjects } from '@/lib/placeholder-data';
import HomePageClient from '@/components/home/HomePageClient';
import type { Project } from '@/types';
import CaseStudySection from '@/components/home/CaseStudySection';
import CreativeProjectsSection from '@/components/home/CreativeProjectsSection';
import { SectionContainer } from '@/components/layout/SectionContainer';
import CallToAction from '@/components/home/CallToAction';

// Disable data caching for this page to ensure fresh data on each visit.
export const revalidate = 0;

export default async function HomePage() {
  // This now fetches placeholder data.
  const projects: Project[] = placeholderProjects;

  const caseStudies = projects.filter(p => p.type === 'case-study');
  const creativeProjects = projects.filter(p => p.type === 'creative');
  
  return (
    <>
      <HomePageClient projects={projects} />
      
      <SectionContainer className="pt-24 pb-16 md:pt-32 md:pb-24">
        <CaseStudySection projects={caseStudies} />
        <CallToAction />
      </SectionContainer>

      <SectionContainer className="pt-16 pb-24 md:pt-24 md:pb-32">
        <CreativeProjectsSection projects={creativeProjects} />
      </SectionContainer>
    </>
  );
}
