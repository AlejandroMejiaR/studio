
import { notFound } from 'next/navigation';
import { getAllProjectsFromFirestore, getProjectBySlugFromFirestore } from '@/lib/firebase';
import ProjectClientContent from '@/components/projects/ProjectClientContent';
import type { Metadata } from 'next';
import type { Project } from '@/types';
import { SectionContainer } from '@/components/layout/SectionContainer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

// Disable data caching for this page.
export const revalidate = 0;

// This function generates the static paths for all projects.
export async function generateStaticParams() {
  const projects = await getAllProjectsFromFirestore();
 
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

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

  const title = project.en.title || project.es.title || 'Portfolio Project';
  const description = project.en.shortDescription || project.es.shortDescription || 'Details about this project.';
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
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center text-white">
        {project.bannerUrl && (
          <Image 
            src={project.bannerUrl} 
            alt={project.en.title || ''} 
            fill 
            className="object-cover" 
            priority 
            data-ai-hint="project banner"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        

        <div className="relative z-10 text-center px-4 flex flex-col items-center">
            <h1 className="font-headline font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-md">
              {project.es.title || project.en.title}
            </h1>
            <div className="mt-16">
                 <Button
                    size="icon"
                    asChild
                    className="h-20 w-20 rounded-full border-2 border-accent bg-transparent text-accent animate-bounce-subtle hover:bg-accent hover:text-accent-foreground [&_svg]:size-8"
                    aria-label={"View project details"}
                  >
                    <Link href="#project-content" id="scroll-down-button">
                      <ArrowDown />
                    </Link>
                  </Button>
            </div>
        </div>
      </section>

      {/* Main Content */}
      <div id="project-content" className="scroll-mt-[-1px]">
        <ProjectClientContent 
          project={project} 
        />
      </div>
    </div>
  );
}
