
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      
      <Accordion type="single" collapsible className="w-full">
        {projects.map((project) => {
          const content = project[language.toLowerCase() as 'en' | 'es'] || project.en;
          
          return (
            <AccordionItem value={`item-${project.id}`} key={project.id}>
              <AccordionTrigger className="text-xl font-medium hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                  <span>{content.title}</span>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="hidden md:inline-flex">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="bg-card border-none shadow-lg mt-2">
                  <CardContent className="p-6 md:p-8">
                    <p className="text-foreground/80 mb-6 text-base leading-relaxed">
                      {content.shortDescription}
                    </p>
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
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default CreativeProjectsSection;
