
"use client";

import type { Project } from '@/types';
import LikeButton from './LikeButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import LetterRevealAnimation from '@/components/effects/LetterRevealAnimation';
import {
  Github,
  ExternalLink,
  CalendarDays,
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
    <div className="space-y-8 md:space-y-10 lg:space-y-12">
      {/* Project Header Section */}
      <div className="pt-0">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary dark:text-foreground mb-3">
          <LetterRevealAnimation text={project.title} />
        </h1>
      </div>

      {/* Combined Section for Case Study and Project Gallery */}
      {(showCaseStudy || showGallery) && (
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 pb-8 md:pb-10 lg:pb-12 pt-0">
          {/* Case Study Content (Left - approx 30%) */}
          {showCaseStudy && (
            <div className="w-full lg:flex-[0_0_30%]">
              <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg h-full flex flex-col">
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
                
                {/* Action Buttons Moved Here - to the bottom */}
                <div className="flex gap-3 pt-6 mt-auto">
                    {project.liveUrl && (
                      <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={18} className="mr-2" /> Live Demo
                        </Link>
                      </Button>
                    )}
                    {project.repoUrl && (
                      <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github size={18} className="mr-2" /> View Code
                        </Link>
                      </Button>
                    )}
                    <LikeButton projectId={project.id} initialLikes={initialLikes} />
                </div>
              </div>
            </div>
          )}

          {/* Project Gallery Content (Right - approx 70% or full if no case study) */}
          {showGallery && (
            <div className={`w-full ${showCaseStudy ? 'lg:flex-[0_0_70%]' : 'lg:flex-[1_1_100%]'}`}>
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
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {project.galleryImages && project.galleryImages.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card text-foreground border-border shadow-md" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card text-foreground border-border shadow-md" />
                  </>
                )}
              </Carousel>
              {/* Badge, Date, and Tech Stack Row - MOVED HERE */}
              <div className="flex items-center gap-x-4 gap-y-2 flex-wrap mt-6">
                  <Badge variant="secondary" className="bg-accent/80 text-accent-foreground text-sm px-3 py-1">
                    {project.category}
                  </Badge>
                  <div className="flex items-center text-base text-muted-foreground">
                    <CalendarDays size={18} className="mr-2 text-accent" />
                    <span>{project.date}</span>
                  </div>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-base text-muted-foreground ml-1 mr-1">-</span>
                      {project.technologies.map(tech => (
                        <Badge key={tech} variant="outline" className="text-sm px-3 py-1 border-primary/50 text-primary/90">{tech}</Badge>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Project Overview Section */}
      <div className="grid md:grid-cols-1 gap-8 pt-8 md:pt-12"> 
        {project.longDescriptionMarkdown && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h3 className="font-headline text-2xl font-semibold text-primary mb-4">Project Details</h3>
            <p className="whitespace-pre-line">{project.longDescriptionMarkdown}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectClientContent;
    
