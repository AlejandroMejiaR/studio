"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Project, ProjectTranslationDetails } from '@/types';
import { Card, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { language, translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent: ProjectTranslationDetails = project[currentLangKey] || project.en;

  const titleToDisplay = isClientReady ? langContent.title : project.en.title;
  const shortDescriptionToDisplay = isClientReady ? langContent.shortDescription : project.en.shortDescription;
  const viewMoreText = isClientReady ? translationsForLanguage.projectCard.viewMore : (getEnglishTranslation(t => t.projectCard.viewMore) || "View More");

  return (
    <Card className="flex flex-col h-full shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 dark:hover:shadow-accent/20 group">
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="font-headline text-2xl text-primary dark:text-foreground">
            <Link 
              href={`/projects/${project.slug}`}
              className="hover:text-accent transition-colors"
            >
              {titleToDisplay}
            </Link>
          </CardTitle>
          <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 z-10">
            <Link href={`/projects/${project.slug}`} aria-label={`View more details for ${titleToDisplay}`}>
              <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                {viewMoreText}
              </span>
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <CardDescription className="text-foreground/70 text-base mt-2 h-24 overflow-hidden">
          {shortDescriptionToDisplay}
        </CardDescription>
      </div>

      <div className="mt-auto w-full">
        <Link 
          href={`/projects/${project.slug}`} 
          aria-label={`View details for ${titleToDisplay}`}
          className="block"
          tabIndex={-1}
        >
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={project.thumbnailUrl}
              alt={titleToDisplay}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </Link>
        
        <CardFooter className="p-4 pt-3 flex flex-wrap items-center justify-between gap-2 border-t">
          {/* Category on the left */}
          {project.category && (
              <Badge variant="secondary" className="text-xs">{project.category}</Badge>
          )}
          {/* Technologies on the right */}
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
              {project.technologies.slice(0, 2).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
              ))}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProjectCard;
