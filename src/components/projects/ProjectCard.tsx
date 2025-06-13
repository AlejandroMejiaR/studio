import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LikeButton from './LikeButton';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  initialLikes?: number; // Pass initial likes to LikeButton if fetched server-side
}

const ProjectCard = ({ project, initialLikes }: ProjectCardProps) => {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0">
        <Link href={`/projects/${project.slug}`} aria-label={`View details for ${project.title}`}>
          <div className="aspect-[3/2] relative overflow-hidden">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={project.dataAiHint || "project image"}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Badge variant="secondary" className="mb-2 bg-accent text-accent-foreground">{project.category}</Badge>
        <CardTitle className="font-headline text-2xl mb-2 text-primary group-hover:text-accent transition-colors">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-foreground/70 line-clamp-3">
          {project.shortDescription}
        </CardDescription>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1">Technologies:</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
            ))}
            {project.technologies.length > 3 && <Badge variant="outline" className="text-xs">...</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 flex justify-between items-center border-t">
        <LikeButton projectId={project.id} initialLikes={initialLikes} />
        <Button asChild variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
          <Link href={`/projects/${project.slug}`}>
            View More <ArrowRight size={16} className="ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
