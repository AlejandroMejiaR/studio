
"use client";

import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import { getProjectLikes } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';


interface ProjectListProps {
  projects: Project[];
}

async function getAllProjectLikes(projectIds: string[]): Promise<Record<string, number>> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Likes will be mocked.");
    return projectIds.reduce((acc, id) => {
      acc[id] = Math.floor(Math.random() * 100);
      return acc;
    }, {} as Record<string, number>);
  }

  const results = await Promise.allSettled(
    projectIds.map(async (id) => {
      try {
        const likes = await getProjectLikes(id);
        return { id, likes };
      } catch (error) {
        console.error(`Failed to get likes for project ${id}:`, error);
        return { id, likes: 0, error: true };
      }
    })
  );

  return results.reduce((acc, result) => {
    if (result.status === 'fulfilled') {
      acc[result.value.id] = result.value.likes;
    }
    return acc;
  }, {} as Record<string, number>);
}


const ProjectList = ({ projects }: ProjectListProps) => {
  const [initialLikesMap, setInitialLikesMap] = useState<Record<string, number>>({});
  const [isLoadingLikes, setIsLoadingLikes] = useState(true);
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();
  
  const [visibleCount, setVisibleCount] = useState(3);
  const displayedProjects = projects.slice(0, visibleCount);

  useEffect(() => {
    const fetchAllLikes = async () => {
      if (projects && projects.length > 0) {
        setIsLoadingLikes(true);
        const projectIds = projects.map(p => p.id);
        try {
          const likes = await getAllProjectLikes(projectIds);
          setInitialLikesMap(likes);
        } catch (error) {
          console.error("Error fetching all project likes in ProjectList component:", error);
          const emptyLikesMap = projectIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
          setInitialLikesMap(emptyLikesMap);
        } finally {
          setIsLoadingLikes(false);
        }
      } else {
        setIsLoadingLikes(false);
      }
    };

    fetchAllLikes();
  }, [projects]);
  
  const featuredProjectsTitleText = isClientReady 
    ? translationsForLanguage.home.featuredProjectsTitle 
    : getEnglishTranslation(t => t.home.featuredProjectsTitle);

  const viewMoreProjectsText = isClientReady 
    ? translationsForLanguage.home.viewMoreProjects
    : getEnglishTranslation(t => t.home.viewMoreProjects);

  const noProjectsText = isClientReady 
    ? translationsForLanguage.projectList.noProjects 
    : getEnglishTranslation(t => t.projectList.noProjects);

  const handleViewMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + 3, projects.length));
  };

  const isInitialLoading = isLoadingLikes && visibleCount === 3;

  if (isInitialLoading && projects.length > 0) {
    return (
      <section 
        id="projects" 
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16 lg:py-20"
      >
        <h2 
            className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 dark:text-foreground text-center"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
        >
          {featuredProjectsTitleText}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="w-full aspect-square rounded-xl" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex justify-between items-center p-4 pt-0">
                <Skeleton className="h-9 w-24" /> 
                <Skeleton className="h-5 w-20" /> 
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section 
      id="projects" 
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16 lg:py-20"
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

          {visibleCount < projects.length && (
            <div className="mt-12 text-center">
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
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProjectList;
