"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { language, isClientReady } = useLanguage();

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent = project[currentLangKey] || project.en;

  const titleToDisplay = isClientReady ? langContent.title : project.es.title;
  const shortDescriptionToDisplay = isClientReady ? langContent.shortDescription : project.es.shortDescription;

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full no-underline text-inherit group">
      <Card className="flex flex-col h-full shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent/30 dark:group-hover:shadow-accent/20 group-hover:scale-105">
        
        <div className="p-4 flex-grow flex flex-col">
            <CardTitle className="font-headline text-2xl text-accent">
                {titleToDisplay}
            </CardTitle>
            <CardDescription className="text-foreground/70 text-base mt-2 flex-grow">
                {shortDescriptionToDisplay}
            </CardDescription>
        </div>
        
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={project.thumbnailUrl}
            alt={titleToDisplay}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-in-out"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-wrap items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent">
            {project.category && (
              <Badge variant="outline" className="px-3 py-1 text-sm border-[#00000021] dark:border-[#fafafa26] bg-secondary dark:bg-[#ffa600cc] text-[#151a28]">
                {project.category}
              </Badge>
            )}
            <div className="flex flex-wrap items-center gap-1.5 justify-end">
              {project.technologies.slice(0, 2).map((tech) => (
                <Badge key={tech} variant="outline" className="px-3 py-1 text-sm border-transparent bg-black/30 text-white backdrop-blur-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProjectCard;
