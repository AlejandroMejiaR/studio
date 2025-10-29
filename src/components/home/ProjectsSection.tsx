
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectDetailView from './ProjectDetailView';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const { language, translationsForLanguage } = useLanguage();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (!projects || projects.length === 0) {
    return null;
  }

  const handleCardClick = (projectId: string, projectType: 'case-study' | 'creative') => {
    // For creative projects, open the modal. For case studies, navigate.
    if (projectType === 'creative') {
        setSelectedProjectId(projectId);
        if (sectionRef.current) {
            setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    // The <Link> component will handle navigation for case studies.
  };
  
  const handleClose = () => {
    setSelectedProjectId(null);
  };

  const caseStudies = projects.filter(p => p.type === 'case-study');
  const creativeProjects = projects.filter(p => p.type === 'creative');

  return (
    <div id="projects" className="scroll-mt-16 mb-[100px]" ref={sectionRef}>
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
            {/* Case Studies Section */}
            <div className="space-y-12 mb-24">
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left">
                    {translationsForLanguage.home.caseStudiesTitle}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {caseStudies.map((project) => {
                    const currentLangKey = language.toLowerCase() as 'en' | 'es';
                    const content = project[currentLangKey] || project.en;

                    return (
                        <Link key={project.id} href={`/projects/${project.slug}`} className="block group">
                        <Card className="relative aspect-square overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-0">
                            <Image
                            src={project.thumbnailUrl}
                            alt={content.title}
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
                                {content.title}
                            </h3>
                            <p className="text-white/90 leading-relaxed text-sm flex-grow overflow-hidden max-h-12">
                                {content.shortDescription}
                            </p>
                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button size="lg" className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90 pointer-events-none">
                                    {translationsForLanguage.projectDetails.viewCaseStudy}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                            </div>
                        </Card>
                        </Link>
                    );
                    })}
                </div>
            </div>

            {/* Creative Projects Section */}
            <div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left mb-12">
                {translationsForLanguage.home.creativeProjectsTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {creativeProjects.map((project) => {
                      const content = project[language.toLowerCase() as 'en' | 'es'] || project.en;
                      return (
                          <Card 
                              key={project.id} 
                              onClick={() => handleCardClick(project.id, project.type)}
                              className="relative h-96 overflow-hidden rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg group border-0"
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
                                  <h3 className="font-headline text-xl font-semibold text-white mb-2 truncate">
                                  {content.title}
                                  </h3>
                                  <p className="text-white/90 text-sm leading-relaxed min-h-[60px]">
                                  {content.shortDescription}
                                  </p>
                              </div>
                          </Card>
                      );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsSection;
