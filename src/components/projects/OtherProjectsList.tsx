
"use client";

import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

interface OtherProjectsListProps {
  projects: Project[];
  likes: Record<string, number>;
}

const OtherProjectsList = ({ projects, likes }: OtherProjectsListProps) => {
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const otherProjectsTitle = isClientReady 
    ? translationsForLanguage.projectDetails.otherProjectsTitle
    : getEnglishTranslation(t => t.projectDetails.otherProjectsTitle) || "Other Projects";

  if (projects.length === 0) {
    return null;
  }
  
  // Use a simple loading check based on whether the likes map is populated for the projects.
  const isLoading = Object.keys(likes).length === 0 && projects.length > 0;

  return (
    <section>
      <h2 
        className="font-headline text-3xl md:text-4xl font-bold text-primary mb-12 dark:text-foreground text-center"
        style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
      >
        {otherProjectsTitle}
      </h2>

      {isLoading && isClientReady ? (
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
