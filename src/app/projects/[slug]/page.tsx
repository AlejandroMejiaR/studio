import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/data/projects';
import ProjectClientContent from '@/components/projects/ProjectClientContent';
import { getProjectLikes } from '@/lib/firebase';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

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
  const project = getProjectBySlug(params.slug);

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
//   const projects = getAllProjects();
//   return projects.map((project) => ({
//     slug: project.slug,
//   }));
// }
