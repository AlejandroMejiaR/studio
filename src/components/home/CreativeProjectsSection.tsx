
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface CreativeProjectsSectionProps {
  projects: Project[];
}

const CreativeProjectsSection = ({ projects }: CreativeProjectsSectionProps) => {
  const { language, translationsForLanguage } = useLanguage();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left mb-12">
        {translationsForLanguage.home.creativeProjectsTitle}
      </h2>
      
      <div className="space-y-16">
        {projects.map((project, index) => {
          const content = project[language.toLowerCase() as 'en' | 'es'] || project.en;
          const isReversed = index % 2 !== 0;
          
          return (
            <div key={project.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Text Column */}
              <div className={cn("flex flex-col items-start justify-center text-left", { "md:order-2": isReversed })}>
                <h3 className="font-headline text-3xl font-bold text-primary dark:text-foreground mb-4">
                  {content.title}
                </h3>
                <p className="text-foreground/80 mb-6 text-base leading-relaxed">
                  {content.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Carousel Column */}
              <div className={cn("w-full", { "md:order-1": isReversed })}>
                {project.galleryImages && project.galleryImages.length > 0 && (
                  <Carousel
                    opts={{
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {project.galleryImages.map((imgSrc, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={imgSrc}
                              alt={`${content.title} - image ${index + 1}`}
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreativeProjectsSection;
