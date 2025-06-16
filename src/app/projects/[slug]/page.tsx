
import { notFound } from 'next/navigation';
import { getProjectBySlugFromFirestore, getProjectLikes } from '@/lib/firebase'; // Updated import
import ProjectClientContent from '@/components/projects/ProjectClientContent';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Project } from '@/types';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project: Project | undefined = await getProjectBySlugFromFirestore(params.slug); // Updated call

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
          url: project.bannerUrl, // Ensure bannerUrl is a full URL
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}


export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlugFromFirestore(params.slug); // Updated call

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
//   const projects = await getAllProjectsFromFirestore(); // Updated call if used
//   return projects.map((project) => ({
//     slug: project.slug,
//   }));
// }

    