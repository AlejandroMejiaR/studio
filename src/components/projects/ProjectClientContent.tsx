
"use client";

import type { Project } from '@/types';
import LikeButton from './LikeButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Github, 
  ExternalLink, 
  CalendarDays, 
  Tag, 
  Lightbulb, 
  Target, 
  CheckCircle,
  Briefcase,
  Zap,
  BarChart3,
} from 'lucide-react';
import type { ElementType } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface ProjectClientContentProps {
  project: Project;
  initialLikes: number;
}

const iconMap: Record<string, ElementType> = {
  Briefcase,
  Zap,
  BarChart3,
  Lightbulb,
  Target,
  CheckCircle,
};

const ProjectClientContent = ({ project, initialLikes }: ProjectClientContentProps) => {

  const showCaseStudy = project.problemStatement || project.solutionOverview || (project.keyFeatures && project.keyFeatures.length > 0);
  const showGallery = project.galleryImages && project.galleryImages.length > 0;

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      {/* Project Header */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl shadow-2xl">
        <Image
          src={project.bannerUrl}
          alt={`${project.title} banner`}
          fill
          priority
          className="object-cover"
          data-ai-hint={project.dataAiHint || "project banner"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <Badge variant="secondary" className="mb-2 bg-white/20 text-white backdrop-blur-sm">{project.category}</Badge>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-white shadow-lg">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Project Overview & Actions */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-accent" />
              <span>{project.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-accent" />
              <span>{project.category}</span>
            </div>
          </div>

          <p className="text-xl text-foreground/80 leading-relaxed">
            {project.shortDescription}
          </p>
          
          <div className="flex flex-wrap gap-3 pt-4">
            {project.liveUrl && (
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={18} className="mr-2" /> Live Demo
                </Link>
              </Button>
            )}
            {project.repoUrl && (
              <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github size={18} className="mr-2" /> View Code
                </Link>
              </Button>
            )}
             <LikeButton projectId={project.id} initialLikes={initialLikes} />
          </div>
        </div>

        <div className="md:col-span-1 space-y-4 p-6 bg-secondary/20 rounded-lg shadow">
          <h3 className="font-headline text-xl font-semibold text-primary border-b pb-2">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map(tech => (
              <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary border border-primary/30">{tech}</Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Section for Case Study */}
      {showCaseStudy && (
        <section>
          <div className="w-full">
            <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg h-full flex flex-col">
              <h2 className="font-headline text-3xl font-bold text-primary mb-8 text-center">Case Study</h2>
              <div className="space-y-6 flex-grow">
                {project.problemStatement && (
                  <div>
                    <h3 className="flex items-center text-xl font-headline text-primary mb-3">
                      <Lightbulb className="mr-3 h-6 w-6 text-accent" /> The Challenge
                    </h3>
                    <p className="text-foreground/80 text-base leading-relaxed pl-2">
                      {project.problemStatement}
                    </p>
                  </div>
                )}
                {project.solutionOverview && (
                   <div>
                    <h3 className="flex items-center text-xl font-headline text-primary mb-3">
                      <Target className="mr-3 h-6 w-6 text-accent" /> Our Approach
                    </h3>
                    <p className="text-foreground/80 text-base leading-relaxed pl-2">
                      {project.solutionOverview}
                    </p>
                  </div>
                )}
                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <div>
                    <h3 className="flex items-center text-xl font-headline text-primary mb-4">
                      <CheckCircle className="mr-3 h-6 w-6 text-accent" /> Key Features & Outcomes
                    </h3>
                    <div className="space-y-4 pl-2">
                      {project.keyFeatures.map((feature, index) => {
                        const IconComponent = feature.icon ? iconMap[feature.icon] : null;
                        return (
                          <div key={index} className="flex items-start gap-3 p-3 bg-secondary/10 rounded-md">
                            {IconComponent && <IconComponent className="h-6 w-6 text-accent mt-1 shrink-0" />}
                            <div>
                              <h4 className="font-semibold text-primary">{feature.title}</h4>
                              <p className="text-sm text-foreground/80">{feature.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* New Section for Project Gallery Carousel */}
      {showGallery && (
        <section className="mt-8 md:mt-10 lg:mt-12"> {/* Reduced top margin here */}
          <h2 className="font-headline text-3xl font-bold text-primary mb-8 text-center">Project Gallery</h2>
          <Carousel 
            opts={{ align: "start", loop: project.galleryImages && project.galleryImages.length > 1 }} 
            className="w-full max-w-6xl mx-auto" 
          >
            <CarouselContent>
              {project.galleryImages?.map((src, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={src}
                      alt={`${project.title} gallery image ${index + 1}`}
                      fill
                      sizes="(max-width: 1279px) 100vw, 1152px"
                      className="object-cover"
                      data-ai-hint={project.dataAiHint || "project screenshot"}
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {project.galleryImages && project.galleryImages.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-[-20px] sm:left-[-30px] md:left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card text-foreground border-border shadow-md" />
                <CarouselNext className="absolute right-[-20px] sm:right-[-30px] md:right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card text-foreground border-border shadow-md" />
              </>
            )}
          </Carousel>
        </section>
      )}
    </div>
  );
};

export default ProjectClientContent;
