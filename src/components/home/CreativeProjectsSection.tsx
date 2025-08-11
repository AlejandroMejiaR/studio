
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface CreativeProjectsSectionProps {
  projects: Project[];
}

const ProjectDetailView = ({ project, onClose, translations }: { project: Project; onClose: () => void; translations: any }) => {
    const { language } = useLanguage();
    const content = project[language.toLowerCase() as 'en' | 'es'] || project.en;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full rounded-lg border bg-card text-card-foreground shadow-lg p-6 md:p-8"
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 rounded-full"
                aria-label="Close project details"
            >
                <X className="h-5 w-5" />
            </Button>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side: Details */}
                <div className="flex-grow">
                    <h3 className="font-headline text-3xl font-bold text-primary dark:text-foreground mb-2">
                        {content.title}
                    </h3>
                    <div className="mb-4 text-sm text-muted-foreground">
                        <p><strong className="font-semibold text-primary/90 dark:text-foreground/90">{translations.myRole}:</strong> {content.myRole}</p>
                        <p><strong className="font-semibold text-primary/90 dark:text-foreground/90">{translations.technologies}:</strong> {project.technologies.join(', ')}</p>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{content.summary}</p>
                </div>

                {/* Right side: Image Gallery */}
                <div className="lg:w-1/2 lg:max-w-md shrink-0">
                    <div className="grid grid-cols-2 gap-3">
                        {(project.galleryImages || [project.thumbnailUrl]).slice(0, 4).map((img, index) => (
                            <div key={index} className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                                <Image
                                    src={img}
                                    alt={`${content.title} - image ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover"
                                    data-ai-hint="project gallery image"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


const CreativeProjectsSection = ({ projects }: CreativeProjectsSectionProps) => {
  const { language, translationsForLanguage } = useLanguage();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (!projects || projects.length === 0) {
    return null;
  }

  const handleCardClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    // Optional: scroll to the section start
    const section = document.getElementById('mini-projects-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleClose = () => {
    setSelectedProjectId(null);
  };


  return (
    <div id="mini-projects-section" className="scroll-mt-20">
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left mb-12">
        {translationsForLanguage.home.creativeProjectsTitle}
      </h2>
      
      <div className="relative">
        <AnimatePresence mode="wait">
            {selectedProject ? (
                 <ProjectDetailView 
                    key={selectedProject.id}
                    project={selectedProject} 
                    onClose={handleClose} 
                    translations={translationsForLanguage.projectDetails}
                />
            ) : (
                <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {projects.map((project) => {
                    const content = project[language.toLowerCase() as 'en' | 'es'] || project.en;
                    
                    return (
                        <Card 
                            key={project.id} 
                            onClick={() => handleCardClick(project.id)}
                            className="h-full overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="p-4 text-left w-full">
                                <CardTitle className="font-headline text-xl font-semibold text-primary dark:text-foreground mb-2 truncate">
                                {content.title}
                                </CardTitle>
                                <CardDescription className="text-foreground/80 text-sm leading-relaxed min-h-[60px]">
                                {content.shortDescription}
                                </CardDescription>
                            </div>
                        </Card>
                    );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default CreativeProjectsSection;
