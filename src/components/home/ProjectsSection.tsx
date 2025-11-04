
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectDetailView from './ProjectDetailView';
import ProjectCard from '../projects/ProjectCard';

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const { translationsForLanguage } = useLanguage();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (!projects || projects.length === 0) {
    return null;
  }

  const handleCardClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    if (sectionRef.current) {
        setTimeout(() => {
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  };
  
  const handleClose = () => {
    setSelectedProjectId(null);
  };

  return (
    <div id="projects" className="scroll-mt-20 mb-[100px]" ref={sectionRef}>
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left mb-12">
            {translationsForLanguage.home.projectsTitle}
        </h2>
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
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={() => handleCardClick(project.id)}
                    viewMoreText={translationsForLanguage.projectCard.viewMore}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsSection;
