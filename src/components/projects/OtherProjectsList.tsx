
"use client";

import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import { getProjectLikes } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

interface OtherProjectsListProps {
  projects: Project[];
}

async function getAllProjectLikes(projectIds: string[]): Promise<Record<string, number>> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return projectIds.reduce((acc, id) => {
      acc[id] = Math.floor(Math.random() * 100);
      return acc;
    }, {} as Record<string, number>);
  }
  const results = await Promise.allSettled(
    projectIds.map(id => getProjectLikes(id).then(likes => ({ id, likes })))
  );
  return results.reduce((acc, result) => {
    if (result.status === 'fulfilled') {
      acc[result.value.id] = result.value.likes;
    }
    return acc;
  }, {} as Record<string, number>);
}

const OtherProjectsList = ({ projects }: OtherProjectsListProps) => {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  useEffect(() => {
    const fetchLikes = async () => {
      if (projects.length > 0) {
        setIsLoading(true);
        const projectIds = projects.map(p => p.id);
        try {
          const fetchedLikes = await getAllProjectLikes(projectIds);
          setLikes(fetchedLikes);
        } catch (error) {
          console.error("Failed to fetch likes for other projects:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    if (isClientReady) {
        fetchLikes();
    }
  }, [projects, isClientReady]);

  const otherProjectsTitle = isClientReady 
    ? translationsForLanguage.projectDetails.otherProjectsTitle
    : getEnglishTranslation(t => t.projectDetails.otherProjectsTitle) || "Other Projects";

  if (projects.length === 0) {
    return null;
  }
  
  return (
    <section className="mt-16 md:mt-20 lg:mt-24 pt-12 border-t">
      <h2 
        className="font-headline text-3xl md:text-4xl font-bold text-primary mb-12 dark:text-foreground text-center"
        style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
      >
        {otherProjectsTitle}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: projects.length }).map((_, i) => (
             <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="w-full aspect-[10/7] rounded-xl" />
                <div className="flex-grow p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex justify-between items-center p-4 border-t">
                    <Skeleton className="h-9 w-24" />
                    <div className="flex items-center justify-end gap-1.5 flex-1 ml-4">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              initialLikes={likes[project.id] ?? 0}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default OtherProjectsList;
