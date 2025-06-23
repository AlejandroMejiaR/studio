
import { notFound } from 'next/navigation';
import { getProjectBySlugFromFirestore, getProjectLikes, getAllProjectsFromFirestore, getAllProjectLikes } from '@/lib/firebase';
import ProjectClientContent from '@/components/projects/ProjectClientContent';
import type { Metadata } from 'next';
import type { Project } from '@/types';

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

  // Default to English for metadata, fallback to Spanish if English title is missing/defaulted
  const title = (project.en.title && project.en.title !== 'English Title Missing'
                 ? project.en.title
                 : project.es.title) || 'Portfolio Project';
  const description = (project.en.shortDescription && project.en.shortDescription !== 'English short description missing.'
                      ? project.en.shortDescription
                      : project.es.shortDescription) || 'Details about this project.';


  return {
    title: `${title} | Portfolio Ace`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: project.bannerUrl, // bannerUrl is not language-specific
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

  const [project, allProjects] = await Promise.all([
    getProjectBySlugFromFirestore(slug),
    getAllProjectsFromFirestore()
  ]);

  if (!project) {
    notFound();
  }

  // Fetch all likes in parallel for efficiency
  const allProjectIds = allProjects.map(p => p.id);
  const [initialLikes, allLikesMap] = await Promise.all([
    getProjectLikes(project.id),
    getAllProjectLikes(allProjectIds)
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <ProjectClientContent 
        project={project} 
        initialLikes={initialLikes}
        allProjects={allProjects}
        allLikesMap={allLikesMap}
      />
    </div>
  );
}
