
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Project, ProjectTranslationDetails } from '@/types';
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LikeButton from './LikeButton';
import { ArrowRight } from 'lucide-react';
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

  const viewMoreText = isClientReady ? translationsForLanguage.projectCard.viewMore : getEnglishTranslation(t => t.projectCard.viewMore) || "View More";
  const technologiesLabelText = isClientReady ? translationsForLanguage.projectCard.technologiesLabel : getEnglishTranslation(t => t.projectCard.technologiesLabel) || "Technologies:";

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent: ProjectTranslationDetails = project[currentLangKey] || project.en;

  const titleToDisplay = isClientReady ? langContent.title : project.en.title;
  const shortDescriptionToDisplay = isClientReady ? langContent.shortDescription : project.en.shortDescription;

  const technologiesToShow = 4;

  return (
    <Card className="group grid grid-cols-1 md:grid-cols-5 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      {/* Image Container */}
      <div className="md:col-span-2 relative min-h-[250px] md:h-full">
        <Link 
          href={`/projects/${project.slug}`} 
          aria-label={`View details for ${titleToDisplay}`}
          onClick={handleProjectLinkClick}
          className="block w-full h-full"
        >
          <div className="relative w-full h-full overflow-hidden">
              <Image
                src={project.thumbnailUrl}
                alt={titleToDisplay}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
          </div>
          <Badge variant="secondary" className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm text-accent-foreground text-sm">{project.category}</Badge>
        </Link>
      </div>

      {/* Content Container */}
      <div className="md:col-span-3 flex flex-col justify-between">
        <CardContent className="p-6 flex-grow">
          <CardTitle className="font-headline text-3xl mb-2 text-primary dark:text-foreground group-hover:text-accent dark:group-hover:text-accent transition-colors">
            <Link 
              href={`/projects/${project.slug}`}
              onClick={handleProjectLinkClick}
            >
              {titleToDisplay}
            </Link>
          </CardTitle>
          <CardDescription className="text-foreground/70 line-clamp-3 text-base mb-6">
            {shortDescriptionToDisplay}
          </CardDescription>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                {technologiesLabelText}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, technologiesToShow).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm">{tech}</Badge>
              ))}
              {project.technologies.length > technologiesToShow && (
                <Badge variant="outline" className="text-sm">
                  +{project.technologies.length - technologiesToShow} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 mt-auto flex justify-between items-center border-t">
          <LikeButton projectId={project.id} initialLikes={initialLikes} />
          <Button asChild variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10 text-base">
            <Link 
              href={`/projects/${project.slug}`}
              onClick={handleProjectLinkClick}
            >
              <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                {viewMoreText}
              </span>
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProjectCard;
