
"use client";

import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
  const { translationsForLanguage, isClientReady, getInitialServerTranslation } = useLanguage();
  
  const [visibleCount, setVisibleCount] = useState(3);
  const displayedProjects = projects.slice(0, visibleCount);
  
  const featuredProjectsTitleText = isClientReady 
    ? translationsForLanguage.home.featuredProjectsTitle 
    : getInitialServerTranslation(t => t.home.featuredProjectsTitle);

  const viewMoreProjectsText = isClientReady 
    ? translationsForLanguage.home.viewMoreProjects
    : getInitialServerTranslation(t => t.home.viewMoreProjects);
  
  const noProjectsText = isClientReady 
    ? translationsForLanguage.projectList.noProjects 
    : getInitialServerTranslation(t => t.projectList.noProjects);

  const handleViewMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + 3, projects.length));
  };

  return (
    <section 
      id="projects" 
      className="pt-[50px]"
    >
      <h2 
        className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 dark:text-foreground text-center"
        style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
      >
        {featuredProjectsTitleText}
      </h2>
      {displayedProjects.length === 0 ? (
        <p 
          className="text-lg text-muted-foreground text-center"
          style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
        >
          {noProjectsText}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
              />
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            {visibleCount < projects.length && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleViewMore}
                className="group border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:border-foreground dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground text-lg px-10 py-6"
              >
                <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                  {viewMoreProjectsText}
                </span>
                <ArrowDown className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
              </Button>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ProjectList;
