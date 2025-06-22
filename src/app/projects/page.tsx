
"use client";

import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import { getAllProjectsFromFirestore, getProjectLikes } from '@/lib/firebase';
import ProjectCard from '@/components/projects/ProjectCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import BackButton from '@/components/layout/BackButton';

// Reusable function to fetch all likes, similar to ProjectList
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


export default function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  useEffect(() => {
    const fetchProjectsAndLikes = async () => {
      setIsLoading(true);
      try {
        const fetchedProjects = await getAllProjectsFromFirestore();
        setProjects(fetchedProjects);
        if (fetchedProjects.length > 0) {
          const projectIds = fetchedProjects.map(p => p.id);
          const fetchedLikes = await getAllProjectLikes(projectIds);
          setLikes(fetchedLikes);
        }
      } catch (error) {
        console.error("Failed to fetch projects and likes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectsAndLikes();
  }, []);

  const allProjectsTitleText = isClientReady 
    ? translationsForLanguage.allProjectsPage.title
    : getEnglishTranslation(t => t.allProjectsPage.title) || "All Projects";


  return (
    <div className="container mx-auto py-12 md:py-16 lg:py-20">
       <div className="relative mb-12 flex items-center justify-center">
        <BackButton className="absolute left-0 top-1/2 -translate-y-1/2" />
        <h1 
          className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-center"
          style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
        >
          {allProjectsTitleText}
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="w-full aspect-square rounded-xl" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex justify-between items-center p-4 border-t">
                <Skeleton className="h-9 w-24" /> 
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-10" /> 
                    <Skeleton className="h-5 w-10" /> 
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
    </div>
  );
}
