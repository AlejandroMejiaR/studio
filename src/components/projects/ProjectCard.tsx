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

  const technologiesToShow = 4;

  return (
    <Card className="flex flex-col h-full shadow-lg transition-all duration-300">
      {/* Image Container on top */}
      <div className="relative rounded-t-lg">
        <Link 
          href={`/projects/${project.slug}`} 
          aria-label={`View details for ${titleToDisplay}`}
          onClick={handleProjectLinkClick}
          className="block"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
              <Image
                src={project.thumbnailUrl}
                alt={titleToDisplay}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
          </div>
          <Badge variant="secondary" className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm text-accent-foreground text-sm">{project.category}</Badge>
        </Link>
      </div>

      {/* Content Container below */}
      <div className="flex flex-col justify-between flex-grow">
        <CardContent className="p-4 flex-grow space-y-2">
          <CardTitle className="font-headline text-xl mb-1 text-primary dark:text-foreground">
            <Link 
              href={`/projects/${project.slug}`}
              onClick={handleProjectLinkClick}
            >
              {titleToDisplay}
            </Link>
          </CardTitle>
          <CardDescription className="text-foreground/70 line-clamp-2 text-sm leading-tight">
            {shortDescriptionToDisplay}
          </CardDescription>
        </CardContent>

        <CardFooter className="p-4 pt-2 mt-auto flex justify-between items-center border-t">
          <LikeButton projectId={project.id} initialLikes={initialLikes} />
          <div className="flex flex-wrap justify-end gap-1.5 flex-1 ml-4">
            {project.technologies.slice(0, technologiesToShow).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
            ))}
            {project.technologies.length > technologiesToShow && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - technologiesToShow} more
              </Badge>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProjectCard;
