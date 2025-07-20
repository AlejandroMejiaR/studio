
"use client";

import type { Project } from '@/types';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface CreativeProjectsSectionProps {
  projects: Project[];
}

const CreativeProjectsSection = ({ projects }: CreativeProjectsSectionProps) => {
  const { language, translationsForLanguage } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    projects?.[0] || null
  );

  if (!projects || projects.length === 0) {
    return null;
  }

  const selectedProjectContent = selectedProject
    ? selectedProject[language.toLowerCase() as 'en' | 'es'] || selectedProject.en
    : null;

  return (
    <div>
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-center mb-12">
        {translationsForLanguage.home.creativeProjectsTitle}
      </h2>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left Column (30%) - Project List */}
        <div className="w-full md:w-[30%] flex-shrink-0">
          <ul className="space-y-2">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  onClick={() => setSelectedProject(project)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg transition-colors duration-200 font-medium text-lg",
                    selectedProject?.id === project.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-background hover:bg-muted"
                  )}
                >
                  {(project[language.toLowerCase() as 'en' | 'es'] || project.en).title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column (70%) - Project Details */}
        <div className="w-full md:w-[70%]">
          {selectedProject && selectedProjectContent && (
            <Card className="bg-card border-none shadow-lg">
              <CardContent className="p-6 md:p-8">
                <p className="text-foreground/80 mb-6 text-base leading-relaxed">
                  {selectedProjectContent.shortDescription}
                </p>
                {selectedProject.galleryImages && selectedProject.galleryImages.length > 0 && (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {selectedProject.galleryImages.map((imgSrc, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={imgSrc}
                              alt={`${selectedProjectContent.title} - image ${index + 1}`}
                              fill
                              className="object-cover"
                              data-ai-hint="creative project screenshot"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeProjectsSection;
