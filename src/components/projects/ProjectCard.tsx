
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const loadingProjectText = isClientReady 
    ? translationsForLanguage.loadingScreen.loadingProject 
    : getEnglishTranslation(t => t.loadingScreen.loadingProject) || "Loading Project...";

  const handleProjectLinkClick = () => {
    showLoading(loadingProjectText);
  };

  const viewMoreText = isClientReady ? translationsForLanguage.projectCard.viewMore : getEnglishTranslation(t => t.projectCard.viewMore) || "View More";
  const technologiesLabelText = isClientReady ? translationsForLanguage.projectCard.technologiesLabel : getEnglishTranslation(t => t.projectCard.technologiesLabel) || "Technologies:";

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full group">
      <CardHeader className="p-0">
        <Link 
          href={`/projects/${project.slug}`} 
          aria-label={`View details for ${project.title}`}
          onClick={handleProjectLinkClick}
        >
          <div className="aspect-[3/2] relative overflow-hidden">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Badge variant="secondary" className="mb-2 bg-accent text-accent-foreground">{project.category}</Badge>
        <CardTitle className="font-headline text-2xl mb-2 text-primary dark:text-foreground group-hover:text-accent dark:group-hover:text-accent transition-colors">
          <Link 
            href={`/projects/${project.slug}`}
            onClick={handleProjectLinkClick}
          >
            {project.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-foreground/70 line-clamp-3">
          {project.shortDescription}
        </CardDescription>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1">
            <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
              {technologiesLabelText}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
            ))}
            {project.technologies.length > 3 && <Badge variant="outline" className="text-xs">...</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 flex justify-between items-center border-t">
        <LikeButton projectId={project.id} initialLikes={initialLikes} />
        <Button asChild variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
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
    </Card>
  );
};

export default ProjectCard;
