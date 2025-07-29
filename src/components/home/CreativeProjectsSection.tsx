
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreativeProjectsSectionProps {
  projects: Project[];
}

const CreativeProjectsSection = ({ projects }: CreativeProjectsSectionProps) => {
  const { language, translationsForLanguage } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    // If clicking the same project, deselect it. Otherwise, select the new one.
    setSelectedProject(current => (current?.id === project.id ? null : project));
    
    // Smooth scroll to the detail view only when a project is newly selected.
    if (!selectedProject || selectedProject.id !== project.id) {
        setTimeout(() => {
          document.getElementById('project-detail-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  };

  const handleClose = () => {
    setSelectedProject(null);
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  const projectContent = selectedProject ? selectedProject[language.toLowerCase() as 'en' | 'es'] || selectedProject.en : null;

  return (
    <div>
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left mb-12">
        {translationsForLanguage.home.creativeProjectsTitle}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project) => {
          const content = project[language.toLowerCase() as 'en' | 'es'] || project.en;
          const isSelected = selectedProject?.id === project.id;
          const isAnyProjectSelected = !!selectedProject;

          return (
            <div 
              key={project.id} 
              className={cn(
                "group block cursor-pointer transition-all duration-300 ease-in-out",
                isAnyProjectSelected && !isSelected && "opacity-40 hover:opacity-100"
              )}
              onClick={() => handleProjectClick(project)}
            >
              <Card className={cn(
                  "h-full overflow-hidden transition-all duration-300 ease-in-out",
                  isSelected ? "bg-accent/10 -translate-y-1 shadow-lg" : "group-hover:shadow-lg group-hover:-translate-y-1"
              )}>
                <div className={cn(
                  "relative aspect-square w-full overflow-hidden bg-muted transition-all duration-300",
                  isSelected && "hidden" // Hide image when selected
                )}>
                  <Image
                    src={project.thumbnailUrl}
                    alt={content.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    data-ai-hint="creative project screenshot"
                  />
                </div>
                <CardContent className="p-4">
                  <CardTitle className="font-headline text-xl font-semibold text-primary dark:text-foreground mb-2 truncate">
                    {content.title}
                  </CardTitle>
                  <CardDescription className="text-foreground/80 text-sm leading-relaxed">
                    {content.shortDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {selectedProject && projectContent && (
        <div id="project-detail-view" className="relative mt-16 pt-8 border-t scroll-mt-24">
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-4 right-4 h-12 w-12 rounded-full border-accent text-accent hover:bg-accent/10 z-10" 
              onClick={handleClose}
              aria-label="Close project details"
            >
                <X className="h-6 w-6" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column: Details */}
                <div className="flex flex-col">
                    <h3 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-4">{projectContent.title}</h3>
                    <div className="mb-4">
                        <p><strong className="font-semibold">{translationsForLanguage.projectDetails.myRole}:</strong> {projectContent.myRole}</p>
                        <p><strong className="font-semibold">{translationsForLanguage.projectDetails.technologies}:</strong> {selectedProject.technologies.join(', ')}</p>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{projectContent.summary}</p>
                </div>

                {/* Right Column: Image Gallery */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {(selectedProject.galleryImages || [selectedProject.thumbnailUrl]).slice(0, 6).map((img, index) => (
                        <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                            <Image
                                src={img}
                                alt={`${projectContent.title} - image ${index + 1}`}
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
      )}
    </div>
  );
};

export default CreativeProjectsSection;
