import type { Project } from '@/types';
import ProjectCard from './ProjectCard';
import { getProjectLikes } from '@/lib/firebase'; // For server-side fetching of initial likes

interface ProjectListProps {
  projects: Project[];
}

// Helper function to fetch all likes, can be moved to a service file
async function getAllProjectLikes(projectIds: string[]) {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    // Return dummy data if Firebase is not configured
    return projectIds.reduce((acc, id) => {
      acc[id] = Math.floor(Math.random() * 100);
      return acc;
    }, {} as Record<string, number>);
  }
  
  const likesPromises = projectIds.map(id => getProjectLikes(id).then(likes => ({ id, likes })));
  const likesResults = await Promise.all(likesPromises);
  return likesResults.reduce((acc, { id, likes }) => {
    acc[id] = likes;
    return acc;
  }, {} as Record<string, number>);
}


const ProjectList = async ({ projects }: ProjectListProps) => {
  const projectIds = projects.map(p => p.id);
  const initialLikesMap = await getAllProjectLikes(projectIds);

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
            <ProjectCard key={project.id} project={project} initialLikes={initialLikesMap[project.id]} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectList;
