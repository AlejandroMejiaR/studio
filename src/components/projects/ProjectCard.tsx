
"use client";

import Image from 'next/image';
import type { Project } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  viewMoreText: string;
}

const ProjectCard = ({ project, onClick, viewMoreText }: ProjectCardProps) => {
  const { language, isClientReady } = useLanguage();

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent = project[currentLangKey] || project.en;

  const titleToDisplay = isClientReady ? langContent.title : project.es.title;
  const shortDescriptionToDisplay = isClientReady ? langContent.shortDescription : project.es.shortDescription;

  return (
    <div className="block h-full no-underline text-inherit group cursor-pointer" onClick={onClick}>
      <Card className="relative aspect-square overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0 h-full">
        <Image
          src={project.thumbnailUrl}
          alt={titleToDisplay}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-in-out"
          data-ai-hint="portfolio project"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <Badge variant="secondary" className="mb-3 w-fit bg-white/20 text-white border-0">
            {project.category}
          </Badge>
          <h3 className="font-headline text-2xl font-bold mb-2">
            {titleToDisplay}
          </h3>
          <p className="text-white/90 leading-relaxed text-sm flex-grow overflow-hidden max-h-12">
            {shortDescriptionToDisplay}
          </p>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="lg" className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90 pointer-events-none">
              {viewMoreText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectCard;
