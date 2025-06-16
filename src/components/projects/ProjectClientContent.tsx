
"use client";

import type { Project } from '@/types';
import LikeButton from './LikeButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

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
    <div className="space-y-12">
      {/* Project Header */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl shadow-2xl">
        <Image
          src={project.bannerUrl}
          alt={`${project.title} banner`}
          fill
          priority
          className="object-cover"
          data-ai-hint="project banner"
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
      
      {/* Combined Case Study & Gallery Section */}
      {(showCaseStudy || showGallery) && (
        <section className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Case Study Details */}
          {showCaseStudy && (
            <div className={cn(
              "w-full",
              showGallery ? "md:w-1/2" : "md:w-full" 
            )}>
              <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg h-full">
                <h2 className="font-headline text-3xl font-bold text-primary mb-8 text-center">Case Study</h2>
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                  {project.problemStatement && (
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-xl font-headline hover:text-accent data-[state=open]:text-accent">
                        <Lightbulb className="mr-3 h-6 w-6 text-accent" /> The Challenge
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/80 text-base leading-relaxed pt-4 pl-2">
                        {project.problemStatement}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {project.solutionOverview && (
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-xl font-headline hover:text-accent data-[state=open]:text-accent">
                        <Target className="mr-3 h-6 w-6 text-accent" /> Our Approach
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/80 text-base leading-relaxed pt-4 pl-2">
                        {project.solutionOverview}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {project.keyFeatures && project.keyFeatures.length > 0 && (
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-xl font-headline hover:text-accent data-[state=open]:text-accent">
                        <CheckCircle className="mr-3 h-6 w-6 text-accent" /> Key Features & Outcomes
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/80 text-base leading-relaxed pt-4 pl-2 space-y-4">
                        {project.keyFeatures.map((feature, index) => {
                          const IconComponent = feature.icon ? iconMap[feature.icon] : null;
                          return (
                            <div key={index} className="flex items-start gap-3 p-3 bg-secondary/10 rounded-md">
                              {IconComponent && <IconComponent className="h-6 w-6 text-accent mt-1 shrink-0" />}
                              <div>
                                <h4 className="font-semibold text-primary">{feature.title}</h4>
                                <p className="text-sm">{feature.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            </div>
          )}

          {/* Project Gallery with Carousel */}
          {showGallery && (
             <div className={cn(
              "w-full",
              showCaseStudy ? "md:w-1/2" : "md:w-full",
              "flex flex-col" 
            )}>
              <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg h-full flex flex-col">
                <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Project Gallery</h2>
                {project.galleryImages && project.galleryImages.length > 0 ? (
                  <Carousel
                    opts={{
                      align: "start",
                      loop: project.galleryImages.length > 1,
                    }}
                    className="w-full flex-grow" 
                  >
                    <CarouselContent className="-ml-4"> {/* Embla default margin */}
                      {project.galleryImages.map((src, index) => (
                        <CarouselItem key={index} className="pl-4 basis-full"> {/* Embla default padding, full width */}
                          {/* This div defines the aspect ratio for the image */}
                          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
                            <Image
                              src={src}
                              alt={`${project.title} gallery image ${index + 1}`}
                              fill
                              sizes="(max-width: 767px) 100vw, 50vw"
                              className="object-cover"
                              data-ai-hint="project screenshot"
                              priority={index === 0} 
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {project.galleryImages.length > 1 && ( 
                      <>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 md:left-4" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 md:right-4" />
                      </>
                    )}
                  </Carousel>
                ) : (
                  <p className="text-muted-foreground text-center flex-grow flex items-center justify-center">No gallery images available.</p>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ProjectClientContent;
