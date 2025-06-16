
import { notFound } from 'next/navigation';
import { getProjectBySlugFromFirestore, getProjectLikes } from '@/lib/firebase';
import ProjectClientContent from '@/components/projects/ProjectClientContent.tsx';
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

  return {
    title: `${project.title} | Portfolio Ace`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [
        {
          url: project.bannerUrl,
          width: 1200,
          height: 630,
          alt: project.title,
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

  // Log the fetched project data on the server side
  console.log('Project Data on Server:', {
    id: project.id,
    slug: project.slug,
    title: project.title,
    galleryImagePaths_in_firestore_would_become_galleryImages: project.galleryImages, // Log the processed galleryImages
  });

  const initialLikes = await getProjectLikes(project.id);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <ProjectClientContent project={project} initialLikes={initialLikes} />
    </div>
  );
}
