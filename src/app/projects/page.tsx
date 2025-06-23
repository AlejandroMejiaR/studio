
import { getAllProjectsFromFirestore, getAllProjectLikes } from '@/lib/firebase';
import ProjectCard from '@/components/projects/ProjectCard';
import { translations } from '@/lib/translations'; 
import BackButton from '@/components/layout/BackButton';
import type { Project } from '@/types';

// Statically render this page and regenerate every hour to keep likes somewhat fresh
// This provides a good balance between performance (fast loads) and data freshness.
export const revalidate = 3600;

// This is a Server Component, so we use a server-side method to get translations
const getTranslationsForServer = (lang: 'EN' | 'ES') => translations[lang];

export default async function AllProjectsPage() {
  const fetchedProjects = await getAllProjectsFromFirestore();
  let likes: Record<string, number> = {};
  if (fetchedProjects.length > 0) {
    const projectIds = fetchedProjects.map(p => p.id);
    likes = await getAllProjectLikes(projectIds);
  }

  // Since this is a server component, we can't use the language context directly.
  // We'll pass down both language contents to the client components or make them language-agnostic.
  // For the title, we'll just use the English one as a server-default.
  // A more advanced setup might use headers or cookies to determine the language server-side.
  const allProjectsTitleText = getTranslationsForServer('EN').allProjectsPage.title;
  
  return (
    <div className="container mx-auto py-12 md:py-16 lg:py-20">
      <div className="relative mb-12 flex items-center justify-center">
        <BackButton className="absolute left-0 top-1/2 -translate-y-1/2" />
        <h1 
          className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-center"
        >
          {allProjectsTitleText}
        </h1>
      </div>

      {fetchedProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fetchedProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              initialLikes={likes[project.id] ?? 0}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">{getTranslationsForServer('EN').projectList.noProjects}</p>
      )}
    </div>
  );
}
