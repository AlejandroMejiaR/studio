
"use client";

import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import { getProjectLikes } from '@/lib/firebase'; // For client-side fetching of initial likes
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


interface ProjectListProps {
  projects: Project[];
}

// Helper function to fetch all likes, can be moved to a service file if used elsewhere
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

  useEffect(() => {
    const fetchLikes = async () => {
      if (projects && projects.length > 0) {
        setIsLoadingLikes(true);
        const projectIds = projects.map(p => p.id);
        try {
          const likes = await getAllProjectLikes(projectIds);
          setInitialLikesMap(likes);
        } catch (error) {
          console.error("Error fetching all project likes in ProjectList component:", error);
          // Set all to 0 or handle as per your app's needs
          setInitialLikesMap(projectIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}));
        } finally {
          setIsLoadingLikes(false);
        }
      } else {
        setIsLoadingLikes(false); // No projects, no likes to load
      }
    };

    fetchLikes();
  }, [projects]);

  if (isLoadingLikes && projects.length > 0) {
    return (
      <section id="projects" className="">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 dark:text-foreground">
          My Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="">
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 dark:text-foreground">
        My Projects
      </h2>
      {projects.length === 0 ? (
        <p className="text-lg text-muted-foreground">No projects to display yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              initialLikes={initialLikesMap[project.id] ?? 0} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectList;
