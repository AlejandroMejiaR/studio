
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
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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

  // Default to Spanish for metadata, as it's the primary language.
  const title = project.es.title || project.en.title || 'Portfolio Project';
  const description = project.es.shortDescription || project.en.shortDescription || 'Details about this project.';
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

// Map technology names to Supabase image URLs
const getTechIconUrl = (tech: string) => {
    const lowerCaseTech = tech.toLowerCase();
    const baseUrl = "https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Logos/";

    switch (lowerCaseTech) {
        case 'next.js': return `${baseUrl}next-js.png`;
        case 'react': return `${baseUrl}React.png`;
        case 'tailwindcss': return `${baseUrl}Tailwind.png`;
        case 'firebase': return `${baseUrl}Firebase.png`;
        case 'vercel': return `${baseUrl}Vercel.png`;
        case 'unity': return `${baseUrl}UnityClaro.png`;
        case 'figma': return `${baseUrl}Figma.png`;
        case 'p5.js': return `${baseUrl}p5js.png`;
        case 'javascript': return `${baseUrl}javascript.png`;
        case 'c#': return `${baseUrl}c-sharp.png`;
        case 'blender': return `${baseUrl}Blender.png`;
        default: return null; // Fallback for unmapped tech
    }
};


export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const project = await getProjectBySlugFromFirestore(slug);

  if (!project) {
    notFound();
  }

  // Server components don't have access to the language context directly in the same way.
  // We'll render the Spanish version by default on the server, and the client will re-render with the correct language if needed.
  // This is a common pattern for optimizing initial load while maintaining client-side interactivity.
  const langContent = project.es;
  const t = {
    myRole: "Mi Rol",
    category: "Categoría",
    date: "Fecha",
    technologies: "Tecnologías",
  }

  return (
    <div className="pb-32 md:pb-40">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center text-white">
        {project.bannerUrl && (
          <Image 
            src={project.bannerUrl} 
            alt={project.es.title || ''} 
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

      {/* Main Content Wrapper */}
      <div id="project-content" className="scroll-mt-[-1px]">
        {/* ProjectClientContent now only handles client-side effects like smooth scrolling */}
        <ProjectClientContent project={project}>
          <article className="space-y-24 md:space-y-32 lg:space-y-36 pt-24 md:pt-32">
            {/* Section: Resumen y Detalles Clave */}
            <section className="!pt-0">
              <SectionContainer>
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 md:gap-12 max-w-6xl mx-auto items-start">
                  <div className="lg:col-span-6">
                    <p className="text-foreground/80 leading-relaxed text-3xl">{langContent.summary}</p>
                  </div>
                  <Card className="lg:col-span-4 bg-card p-6 md:p-8 rounded-xl shadow-lg">
                    <ul className="space-y-4 text-lg">
                      <li><strong className="font-semibold text-primary dark:text-foreground">{t.myRole}: </strong> <span className="text-foreground/80">{langContent.myRole}</span></li>
                      <li><strong className="font-semibold text-primary dark:text-foreground">{t.category}: </strong> <span className="text-foreground/80">{project.category}</span></li>
                      <li><strong className="font-semibold text-primary dark:text-foreground">{t.date}: </strong> <span className="text-foreground/80">{project.date}</span></li>
                      <li>
                        <strong className="font-semibold text-primary dark:text-foreground mb-2 block">{t.technologies}: </strong>
                        <div className="flex flex-wrap gap-3">
                            <TooltipProvider>
                                {project.technologies.map(tech => {
                                    const iconUrl = getTechIconUrl(tech);
                                    if (!iconUrl) return null;

                                    return (
                                        <Tooltip key={tech}>
                                            <TooltipTrigger asChild>
                                                <div className="p-2 rounded-md bg-muted/50 border border-border/50 h-10 w-10 flex items-center justify-center">
                                                    <Image src={iconUrl} alt={tech} width={24} height={24} className="object-contain" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{tech}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </TooltipProvider>
                        </div>
                      </li>
                    </ul>
                  </Card>
                </div>
              </SectionContainer>
            </section>
          </article>
        </ProjectClientContent>
      </div>
    </div>
  );
}
