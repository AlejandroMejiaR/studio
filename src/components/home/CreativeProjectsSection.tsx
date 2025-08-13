
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectDetailView from './ProjectDetailView';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CreativeProjectsSectionProps {
  projects: Project[];
}

const CreativeProjectsSection = ({ projects }: CreativeProjectsSectionProps) => {
  const { language, translationsForLanguage } = useLanguage();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (!projects || projects.length === 0) {
    return null;
  }

  const handleCardClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    // Scroll to the top of the section when a project is selected
    if (sectionRef.current) {
        // Use a timeout to allow the DOM to update before scrolling
        setTimeout(() => {
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // A small delay is often sufficient
    }
  };

  const handleClose = () => {
    setSelectedProjectId(null);
  };


  return (
    <div id="mini-projects" className="scroll-mt-16 mb-[200px]" ref={sectionRef}>
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left mb-12">
        {translationsForLanguage.home.creativeProjectsTitle}
      </h2>
      
      <motion.div layout className="relative">
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
                            className="relative h-full overflow-hidden rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg group border-0"
                        >
                            <Image
                                src={project.thumbnailUrl}
                                alt={content.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                data-ai-hint="portfolio project"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />

                            <div className="relative z-10 p-4 text-left w-full h-full flex flex-col justify-end text-white bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                <CardTitle className="font-headline text-xl font-semibold text-white mb-2 truncate">
                                {content.title}
                                </CardTitle>
                                <CardDescription className="text-white/90 text-sm leading-relaxed min-h-[60px]">
                                {content.shortDescription}
                                </CardDescription>
                            </div>
                        </Card>
                    );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
};

export default CreativeProjectsSection;
