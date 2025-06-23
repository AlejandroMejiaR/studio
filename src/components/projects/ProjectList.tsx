
"use client";

import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLoading } from '@/contexts/LoadingContext';


interface ProjectListProps {
  projects: Project[];
  initialLikesMap: Record<string, number>;
}

const ProjectList = ({ projects, initialLikesMap }: ProjectListProps) => {
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();
  const { showLoading } = useLoading();
  
  const [visibleCount, setVisibleCount] = useState(3);
  const [showAllProjectsButton, setShowAllProjectsButton] = useState(false);
  const displayedProjects = projects.slice(0, visibleCount);
  
  const featuredProjectsTitleText = isClientReady 
    ? translationsForLanguage.home.featuredProjectsTitle 
    : getEnglishTranslation(t => t.home.featuredProjectsTitle);

  const viewMoreProjectsText = isClientReady 
    ? translationsForLanguage.home.viewMoreProjects
    : getEnglishTranslation(t => t.home.viewMoreProjects);
  
  const viewAllProjectsText = isClientReady
    ? translationsForLanguage.home.buttons.viewAllProjects
    : getEnglishTranslation(t => t.home.buttons.viewAllProjects);

  const loadingAllProjectsText = isClientReady
    ? translationsForLanguage.loadingScreen.loadingAllProjects
    : getEnglishTranslation(t => t.loadingScreen.loadingAllProjects) || ["Loading All Projects..."];

  const noProjectsText = isClientReady 
    ? translationsForLanguage.projectList.noProjects 
    : getEnglishTranslation(t => t.projectList.noProjects);

  const handleViewMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + 3, projects.length));
    if (!showAllProjectsButton) {
      setShowAllProjectsButton(true);
    }
  };

  const handleViewAllProjectsClick = () => {
    showLoading(loadingAllProjectsText);
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
                initialLikes={initialLikesMap[project.id] ?? 0} 
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

            {showAllProjectsButton && (
                <Button
                    size="lg"
                    asChild
                    className="group bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6"
                >
                    <Link href="/projects" onClick={handleViewAllProjectsClick}>
                        <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                            {viewAllProjectsText}
                        </span>
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ProjectList;
