"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Project, ProjectTranslationDetails } from '@/types';
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LikeButton from './LikeButton';
import { useLoading } from '@/contexts/LoadingContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectCardProps {
  project: Project;
  initialLikes?: number;
}

const ProjectCard = ({ project, initialLikes }: ProjectCardProps) => {
  const { showLoading } = useLoading();
  const { language, translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const loadingProjectText = isClientReady 
    ? translationsForLanguage.loadingScreen.loadingProject 
    : getEnglishTranslation(t => t.loadingScreen.loadingProject) || "Loading Project...";

  const handleProjectLinkClick = () => {
    showLoading(loadingProjectText);
  };

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent: ProjectTranslationDetails = project[currentLangKey] || project.en;

  const titleToDisplay = isClientReady ? langContent.title : project.en.title;
  const shortDescriptionToDisplay = isClientReady ? langContent.shortDescription : project.en.shortDescription;

  // Logic to dynamically show badges to prevent wrapping
  const maxBadgesInContainer = 4;
  
  // If we have a category, it takes up one badge slot.
  const techSlotsAvailable = project.category ? maxBadgesInContainer - 1 : maxBadgesInContainer;

  const numTechs = project.technologies.length;
  let techBadgesToShow = project.technologies;
  let remainingTechsCount = 0;

  // If the number of technologies exceeds the available space, we need a "+N" badge.
  if (numTechs > techSlotsAvailable) {
    // The "+N" badge itself takes up one spot.
    const numTechsToDisplay = techSlotsAvailable - 1;
    techBadgesToShow = project.technologies.slice(0, numTechsToDisplay);
    remainingTechsCount = numTechs - numTechsToDisplay;
  }
  
  return (
    <Card className="flex flex-col h-full shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 dark:hover:shadow-accent/20">
      <Link 
        href={`/projects/${project.slug}`} 
        aria-label={`View details for ${titleToDisplay}`}
        onClick={handleProjectLinkClick}
        className="block"
      >
        <div className="relative w-full aspect-square">
            <Image
              src={project.thumbnailUrl}
              alt={titleToDisplay}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
        </div>
      </Link>

      <div className="flex flex-col justify-between flex-grow">
        <CardContent className="p-4 space-y-2 flex-grow">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="font-headline text-lg text-primary dark:text-foreground">
              <Link 
                href={`/projects/${project.slug}`}
                onClick={handleProjectLinkClick}
                className="hover:text-accent transition-colors"
              >
                {titleToDisplay}
              </Link>
            </CardTitle>
            {project.category && (
              <Badge className="text-xs bg-accent text-accent-foreground shrink-0">{project.category}</Badge>
            )}
          </div>
          
          <CardDescription className="text-foreground/70 line-clamp-2 text-sm">
            {shortDescriptionToDisplay}
          </CardDescription>
        </CardContent>

        <CardFooter className="p-4 flex justify-between items-center border-t">
          <LikeButton projectId={project.id} initialLikes={initialLikes} />
          <div className="flex flex-wrap items-center justify-end gap-1.5 flex-1 ml-4">
            {techBadgesToShow.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
            ))}
            {remainingTechsCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remainingTechsCount}
              </Badge>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProjectCard;
