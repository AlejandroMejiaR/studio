
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
      
      <Accordion type="single" collapsible className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        {projects.map((project) => {
          const content = project[language.toLowerCase() as 'en' | 'es'] || project.en;
          
          return (
            <AccordionItem key={project.id} value={project.id} className="border-b-0">
                <Card className={cn("h-full overflow-hidden transition-all duration-300 ease-in-out")}>
                    <AccordionTrigger className="p-0 hover:no-underline w-full">
                      <div className="p-4 text-left w-full">
                        <CardTitle className="font-headline text-xl font-semibold text-primary dark:text-foreground mb-2 truncate">
                          {content.title}
                        </CardTitle>
                        <CardDescription className="text-foreground/80 text-sm leading-relaxed">
                          {content.shortDescription}
                        </CardDescription>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <div id="project-detail-view" className="relative mt-4 border-t pt-4">
                          <div className="flex flex-col gap-4">
                              {/* Details */}
                              <div className="flex flex-col">
                                  <div className="mb-4">
                                      <p><strong className="font-semibold">{translationsForLanguage.projectDetails.myRole}:</strong> {content.myRole}</p>
                                      <p><strong className="font-semibold">{translationsForLanguage.projectDetails.technologies}:</strong> {project.technologies.join(', ')}</p>
                                  </div>
                                  <p className="text-foreground/80 leading-relaxed text-sm">{content.summary}</p>
                              </div>

                              {/* Image Gallery */}
                              <div className="grid grid-cols-2 gap-2">
                                  {(project.galleryImages || [project.thumbnailUrl]).slice(0, 4).map((img, index) => (
                                      <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                                          <Image
                                              src={img}
                                              alt={`${content.title} - image ${index + 1}`}
                                              fill
                                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 15vw"
                                              className="object-cover"
                                              data-ai-hint="project gallery image"
                                          />
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default CreativeProjectsSection;
