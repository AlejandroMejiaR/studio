
import { notFound } from 'next/navigation';
import { getProjectBySlugFromFirestore, getProjectLikes } from '@/lib/firebase';
import ProjectClientContent from '@/components/projects/ProjectClientContent';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Project } from '@/types';

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug; // Explicitly extract slug
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
  const slug = params.slug; // Explicitly extract slug
  const project = await getProjectBySlugFromFirestore(slug);

  if (!project) {
    notFound();
  }

  const initialLikes = await getProjectLikes(project.id);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <ProjectClientContent project={project} initialLikes={initialLikes} />
    </div>
  );
}

// Optional: Generate static paths if you have a fixed number of projects
// export async function generateStaticParams() {
//   const projects = await getAllProjectsFromFirestore();
//   return projects.map((project) => ({
//     slug: project.slug,
//   }));
// }
