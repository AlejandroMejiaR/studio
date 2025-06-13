
"use client";

import { useState } from 'react'; // Added useState
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
  X as CloseIcon // Added X for close button if needed, though Dialog often has one
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ElementType } from 'react';

// Carousel Imports
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// Dialog Imports
import {
  Dialog,
  DialogContent,
  // DialogClose, // DialogClose might not be needed if default close is sufficient
  // DialogTrigger, // We will trigger programmatically
} from "@/components/ui/dialog";


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
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsLightboxOpen(true);
  };

  // const closeLightbox = () => {
  //   setIsLightboxOpen(false);
  //   setSelectedImageUrl(null);
  // };

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
      
      {/* Case Study Details */}
       {(project.problemStatement || project.solutionOverview || project.keyFeatures) && (
        <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg">
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
      )}

      {/* Image Gallery */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <div> {/* Container for Carousel and Title */}
            <h2 className="font-headline text-3xl font-bold text-primary mb-6 text-center">Project Gallery</h2>
            <div className="relative px-0 sm:px-10 md:px-12"> {/* Relative container for positioning carousel controls and padding */}
              <Carousel
                opts={{
                  align: "start",
                  loop: project.galleryImages.length > 1, // Loop only if more than one image
                }}
                className="w-full max-w-5xl mx-auto" // max-w to control overall width
              >
                <CarouselContent className="-ml-2 sm:-ml-4">
                  {project.galleryImages.map((src, index) => (
                    <CarouselItem key={index} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <div className="aspect-video relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group">
                        <Image
                          src={src}
                          alt={`${project.title} gallery image ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint="project screenshot"
                          onClick={() => openLightbox(src)}
                          priority={index < 3} // Prioritize loading for first few images
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {project.galleryImages.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 text-foreground disabled:opacity-30" />
                    <CarouselNext className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 text-foreground disabled:opacity-30" />
                  </>
                )}
              </Carousel>
            </div>
          </div>

          {selectedImageUrl && (
            <DialogContent className="max-w-4xl w-full p-2 sm:p-4 bg-background/95 dark:bg-background/90 backdrop-blur-md shadow-2xl rounded-lg">
              <div className="relative aspect-video w-full h-auto">
                <Image
                  src={selectedImageUrl}
                  alt="Enlarged project image"
                  fill
                  className="object-contain rounded-md"
                />
                {/* The ShadCN Dialog component includes a default close button (X) */}
              </div>
            </DialogContent>
          )}
        </Dialog>
      )}
    </div>
  );
};

export default ProjectClientContent;
