
import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import { getProjectLikes } from '@/lib/firebase'; // For server-side fetching of initial likes

interface ProjectListProps {
  projects: Project[];
}

// Helper function to fetch all likes, can be moved to a service file
async function getAllProjectLikes(projectIds: string[]): Promise<Record<string, number>> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("Firebase projectId is not configured. Likes will be mocked.");
    return projectIds.reduce((acc, id) => {
      acc[id] = Math.floor(Math.random() * 100);
      return acc;
    }, {} as Record<string, number>);
  }

  // Use Promise.allSettled to handle individual promise rejections
  const results = await Promise.allSettled(
    projectIds.map(async (id) => {
      try {
        const likes = await getProjectLikes(id);
        return { id, likes };
      } catch (error) {
        // Log the specific error for this project ID but don't let it break everything
        console.error(`Failed to get likes for project ${id}:`, error);
        return { id, likes: 0, error: true }; // Return 0 likes and mark as error
      }
    })
  );

  return results.reduce((acc, result) => {
    if (result.status === 'fulfilled') {
      acc[result.value.id] = result.value.likes;
    } else {
      // This case should ideally not be hit if the catch inside map works,
      // but as a fallback for Promise.allSettled structure.
      // The actual error handling and default value is done within the map's catch block.
      // If result.status is 'rejected', result.reason is the error.
      // We need a way to get the ID if the promise itself rejected before our catch.
      // However, our `map` function's `catch` block ensures we always return an object.
      // This path is less likely with the current structure.
    }
    return acc;
  }, {} as Record<string, number>);
}


const ProjectList = async ({ projects }: ProjectListProps) => {
  const projectIds = projects.map(p => p.id);
  let initialLikesMap: Record<string, number> = {};

  try {
    initialLikesMap = await getAllProjectLikes(projectIds);
  } catch (error) {
    // This top-level catch might not be strictly necessary anymore with Promise.allSettled
    // and individual catches, but kept for safety.
    console.error("Error fetching all project likes, defaulting to 0 for all:", error);
    initialLikesMap = projectIds.reduce((acc, id) => {
      acc[id] = 0;
      return acc;
    }, {} as Record<string, number>);
  }


  return (
    <section id="projects" className="container mx-auto px-4">
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
        My Projects
      </h2>
      {projects.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground">No projects to display yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} initialLikes={initialLikesMap[project.id] ?? 0} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectList;
