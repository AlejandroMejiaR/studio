
import { notFound } from 'next/navigation';
import { getProjectBySlugFromFirestore } from '@/lib/firebase';
import ProjectClientContent from '@/components/projects/ProjectClientContent';
import type { Metadata } from 'next';
import type { Project } from '@/types';
import BackButton from '@/components/layout/BackButton';
import { SectionContainer } from '@/components/layout/SectionContainer';

// Disable data caching for this page.
export const revalidate = 0;

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const slug = params.slug;
  const project: Project | undefined = await getProjectBySlugFromFirestore(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = (project.en.title && project.en.title !== 'English Title Missing'
                 ? project.en.title
                 : project.es.title) || 'Portfolio Project';
  const description = (project.en.shortDescription && project.en.shortDescription !== 'English short description missing.'
                      ? project.en.shortDescription
                      : project.es.shortDescription) || 'Details about this project.';

  const imageUrl = project.bannerUrl;


  return {
    title: `${title} | Portfolio Ace`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}


export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const project = await getProjectBySlugFromFirestore(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="pb-32 md:pb-40">
      <SectionContainer className="pt-12">
        <div className="flex items-center gap-4">
          <BackButton />
        </div>
      </SectionContainer>
      <ProjectClientContent 
        project={project} 
      />
    </div>
  );
}
