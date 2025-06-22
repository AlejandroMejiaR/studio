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

  const technologiesToShow = 3;

  return (
    <Card className="flex flex-col h-full shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-accent/30 dark:hover:shadow-accent/20">
      <Link 
        href={`/projects/${project.slug}`} 
        aria-label={`View details for ${titleToDisplay}`}
        onClick={handleProjectLinkClick}
        className="block"
      >
        <div className="relative rounded-t-lg">
            <div className="relative h-36 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={project.thumbnailUrl}
                  alt={titleToDisplay}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
            </div>
        </div>
      </Link>

      <div className="flex flex-col justify-between flex-grow">
        <CardContent className="p-3 flex-grow space-y-1">
          <CardTitle className="font-headline text-md mb-1 text-primary dark:text-foreground">
            <Link 
              href={`/projects/${project.slug}`}
              onClick={handleProjectLinkClick}
            >
              {titleToDisplay}
            </Link>
          </CardTitle>
          <CardDescription className="text-foreground/70 line-clamp-2 text-xs leading-tight">
            {shortDescriptionToDisplay}
          </CardDescription>
        </CardContent>

        <CardFooter className="p-3 pt-1 mt-auto flex justify-between items-center border-t">
          <LikeButton projectId={project.id} initialLikes={initialLikes} />
          <div className="flex flex-wrap items-center justify-end gap-1.5 flex-1 ml-4">
            {project.category && (
              <Badge variant="secondary" className="text-xs">{project.category}</Badge>
            )}
            {project.category && project.technologies && project.technologies.length > 0 && (
                <span className="text-muted-foreground mx-1">-</span>
            )}
            {project.technologies.slice(0, technologiesToShow).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
            ))}
            {project.technologies.length > technologiesToShow && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - technologiesToShow}
              </Badge>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProjectCard;
