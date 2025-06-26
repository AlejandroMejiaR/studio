"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Project, ProjectTranslationDetails } from '@/types';
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <Card className="flex flex-col h-full shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 dark:hover:shadow-accent/20 group">
        <CardContent className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start gap-2">
                <CardTitle className="font-headline text-xl text-primary dark:text-foreground">
                    <Link 
                        href={`/projects/${project.slug}`}
                        className="hover:text-accent transition-colors"
                    >
                        {titleToDisplay}
                    </Link>
                </CardTitle>
                <Link 
                    href={`/projects/${project.slug}`} 
                    className={cn(
                        badgeVariants({ variant: 'default' }), // Base badge styles
                        'bg-accent text-accent-foreground hover:bg-accent/90 transition-colors shrink-0'
                    )}
                    aria-label={`View more details for ${titleToDisplay}`}
                >
                    <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                        {viewMoreText}
                    </span>
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
            
            <CardDescription className="text-foreground/70 text-base mt-2 h-24 overflow-hidden">
                {shortDescriptionToDisplay}
            </CardDescription>

            <Link 
                href={`/projects/${project.slug}`} 
                aria-label={`View details for ${titleToDisplay}`}
                className="block mt-4 flex-grow"
            >
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        src={project.thumbnailUrl}
                        alt={titleToDisplay}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            </Link>
        </CardContent>

        <CardFooter className="px-4 pt-2 pb-4 flex flex-wrap items-center justify-between gap-2 border-t">
            <div className="flex flex-wrap items-center gap-1.5">
                {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                ))}
            </div>
            {project.category && (
                <Badge variant="secondary" className="text-xs">{project.category}</Badge>
            )}
        </CardFooter>
    </Card>
  );
};

export default ProjectCard;
