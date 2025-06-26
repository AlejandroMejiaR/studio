"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Project, ProjectTranslationDetails } from '@/types';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { language, translationsForLanguage, isClientReady } = useLanguage();

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent: ProjectTranslationDetails = project[currentLangKey] || project.en;

  const titleToDisplay = isClientReady ? langContent.title : project.en.title;
  const shortDescriptionToDisplay = isClientReady ? langContent.shortDescription : project.en.shortDescription;

  return (
    // Wrap the card in a Link to make it all clickable by default
    <Link href={`/projects/${project.slug}`} className="block h-full no-underline text-inherit group">
      <Card className="flex flex-col h-full shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent/30 dark:group-hover:shadow-accent/20 group-hover:scale-105">
        
        <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={project.thumbnailUrl}
            alt={titleToDisplay}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="p-4 flex flex-wrap items-center justify-between gap-2 border-b">
          {project.category && (
            <Badge variant="outline" className="px-3 py-1 text-sm border-[#00000021] dark:border-[#fafafa26]">{project.category}</Badge>
          )}
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {project.technologies.slice(0, 2).map((tech) => (
              <Badge key={tech} variant="outline" className="px-3 py-1 text-sm border-[#00000021] dark:border-[#fafafa26]">{tech}</Badge>
            ))}
          </div>
        </div>

        <div className="p-4 flex-grow">
          <CardTitle className="font-headline text-2xl text-primary dark:text-foreground">
            {titleToDisplay}
          </CardTitle>
          <CardDescription className="text-foreground/70 text-base mt-2">
            {shortDescriptionToDisplay}
          </CardDescription>
        </div>
        
      </Card>
    </Link>
  );
};

export default ProjectCard;
