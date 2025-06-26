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
      
      {/* 1. Image at the top with rounded corners */}
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
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* 2. Category & Technologies with larger badges */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-2 border-b">
        {project.category && (
          <Badge variant="outline" className="px-3 py-1 text-sm bg-transparent text-accent border-[#00000021] dark:border-[#fafafa26]">{project.category}</Badge>
        )}
        <div className="flex flex-wrap items-center gap-1.5 justify-end">
          {project.technologies.slice(0, 2).map((tech) => (
            <Badge key={tech} variant="outline" className="px-3 py-1 text-sm">{tech}</Badge>
          ))}
        </div>
      </div>

      {/* 3. Title & Description */}
      <div className="p-4 flex-grow">
        <CardTitle className="font-headline text-2xl text-primary dark:text-foreground">
          {titleToDisplay}
        </CardTitle>
        <CardDescription className="text-foreground/70 text-base mt-2 h-20 overflow-hidden">
          {shortDescriptionToDisplay}
        </CardDescription>
      </div>
      
      {/* 4. Centered "View More" button */}
      <CardFooter className="p-4 pt-0 mt-auto flex justify-center">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/projects/${project.slug}`} aria-label={`View more details for ${titleToDisplay}`}>
            <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
              {viewMoreText}
            </span>
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
