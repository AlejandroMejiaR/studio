"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { language, translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent: ProjectTranslationDetails = project[currentLangKey] || project.en;

  const titleToDisplay = isClientReady ? langContent.title : project.en.title;
  const shortDescriptionToDisplay = isClientReady ? langContent.shortDescription : project.en.shortDescription;
  const viewMoreText = isClientReady ? translationsForLanguage.projectCard.viewMore : (getEnglishTranslation(t => t.projectCard.viewMore) || "View More");

  // This handler will be for the button inside the link
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/projects/${project.slug}`);
  };

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
            <Badge variant="outline" className="px-3 py-1 text-sm bg-transparent text-accent border-[#00000021] dark:border-[#fafafa26]">{project.category}</Badge>
          )}
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {project.technologies.slice(0, 2).map((tech) => (
              <Badge key={tech} variant="outline" className="px-3 py-1 text-sm border-[#00000021] dark:border-[#fafafa26]">{tech}</Badge>
            ))}
          </div>
        </div>

        {/* This div stops clicks from propagating to the parent Link */}
        <div 
          className="p-4 flex-grow"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <CardTitle className="font-headline text-2xl text-primary dark:text-foreground">
            {titleToDisplay}
          </CardTitle>
          <CardDescription className="text-foreground/70 text-base mt-2">
            {shortDescriptionToDisplay}
          </CardDescription>
        </div>
        
        <CardFooter className="p-4 pt-0 flex justify-center mt-auto">
          {/* This button is inside the link, but its click is handled separately */}
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleButtonClick}
            aria-label={`View more details for ${titleToDisplay}`}
          >
            <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
              {viewMoreText}
            </span>
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
