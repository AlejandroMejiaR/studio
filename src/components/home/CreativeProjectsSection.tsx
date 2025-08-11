
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectDetailView from './ProjectDetailView';

interface CreativeProjectsSectionProps {
  projects: Project[];
}

const CreativeProjectsSection = ({ projects }: CreativeProjectsSectionProps) => {
  const { language, translationsForLanguage } = useLanguage();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // This effect runs after a project is selected and the component re-renders.
  useEffect(() => {
    if (selectedProjectId) {
      const section = document.getElementById('mini-projects-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedProjectId]);

  if (!projects || projects.length === 0) {
    return null;
  }

  const handleCardClick = (projectId: string) => {
    setSelectedProjectId(projectId);
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
