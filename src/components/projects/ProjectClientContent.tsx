"use client";

import type { Project, ProjectTranslationDetails } from '@/types';
import LikeButton from './LikeButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import {
  Github,
  ExternalLink,
  CalendarDays,
  Lightbulb,
  Target,
  Cpu,
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import WordRevealAnimation from '@/components/effects/WordRevealAnimation';
import { cn } from '@/lib/utils';
import React from 'react';
import BackButton from '../layout/BackButton';
import { translations } from '@/lib/translations';

interface ProjectClientContentProps {
  project: Project;
  initialLikes: number;
}

const ProjectClientContent = ({ project, initialLikes }: ProjectClientContentProps) => {
  const { language, translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent: ProjectTranslationDetails = project[currentLangKey] || project.en;

  const titleToDisplay = isClientReady ? langContent.title : (project.en.title || "Title Loading...");
  const problemStatementToDisplay = isClientReady ? langContent.problemStatement : project.en.problemStatement;
  const solutionOverviewToDisplay = isClientReady ? langContent.solutionOverview : project.en.solutionOverview;

  const theChallengeText = isClientReady ? translationsForLanguage.projectDetails.theChallenge : getEnglishTranslation(t => t.projectDetails.theChallenge);
  const theApproachText = isClientReady ? translationsForLanguage.projectDetails.theApproach : getEnglishTranslation(t => t.projectDetails.theApproach);
  const technologiesText = isClientReady ? translationsForLanguage.projectDetails.technologiesTitle : getEnglishTranslation(t => t.projectDetails.technologiesTitle);
  const liveDemoButtonText = isClientReady ? translationsForLanguage.projectDetails.liveDemoButton : getEnglishTranslation(t => t.projectDetails.liveDemoButton);
  const viewCodeButtonText = isClientReady ? translationsForLanguage.projectDetails.viewCodeButton : getEnglishTranslation(t => t.projectDetails.viewCodeButton);
  
  const showCaseStudy = problemStatementToDisplay || solutionOverviewToDisplay;
  const showGallery = project.galleryImages && project.galleryImages.length > 0;
  
  const titleLetterStaggerConst = 0.04;
  const titleLetterAnimationDurationConst = 0.5;
  const titleDelayBetweenWordsConst = 0.1;
  const titleBaseDelay = 0.2;

  return (
    <>
      <div className="space-y-8 md:space-y-10 lg:space-y-12 mb-8 md:mb-12">
        <div className="flex items-center gap-2">
          <BackButton className="bg-accent text-accent-foreground hover:bg-accent/90" />
          <h1
            className={cn(
              "font-headline font-bold text-left",
              "text-4xl sm:text-5xl md:text-6xl"
            )}
          >
            {isClientReady ? (
              <WordRevealAnimation
                key={`title-${titleToDisplay}-${language}`}
                text={titleToDisplay || ""}
                lineBaseDelay={titleBaseDelay}
                delayBetweenWords={titleDelayBetweenWordsConst}
                letterStaggerDelay={titleLetterStaggerConst}
                letterAnimationDuration={titleLetterAnimationDurationConst}
                className="inline-block"
              />
            ) : (
              <span style={{ visibility: "hidden" }}>
                {project.en.title || "Loading..."}
              </span>
            )}
          </h1>
          <LikeButton
            projectId={project.id}
            initialLikes={initialLikes}
            size="icon"
            iconClassName="h-10 w-10"
          />
        </div>


        {(showGallery || showCaseStudy) && (
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 pt-0">
            {/* Left Column: Carousel Section */}
            <div className={`w-full ${showCaseStudy ? 'lg:flex-[0_0_calc(70%-1.5rem)]' : 'lg:flex-[1_1_100%]'}`}>
              {showGallery && (
                <>
                  <Carousel
                    opts={{ align: "start", loop: project.galleryImages && project.galleryImages.length > 1 }}
                    className="w-full max-w-6xl mx-auto"
                  >
                    <CarouselContent>
                      {project.galleryImages?.map((src, index) => (
                        <CarouselItem key={index} className="basis-full">
                           <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-lg shadow-md">
                            <Image
                              src={src}
                              alt={`${titleToDisplay} gallery image ${index + 1}`}
                              fill
                              sizes="(max-width: 1279px) 100vw, 1152px"
                              className="object-cover"
                              priority={index === 0}
                              loading={index === 0 ? 'eager' : 'lazy'}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {project.galleryImages && project.galleryImages.length > 1 && (
                      <>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-accent hover:bg-accent/90 text-accent-foreground border-transparent shadow-md" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-accent hover:bg-accent/90 text-accent-foreground border-transparent shadow-md" />
                      </>
                    )}
                  </Carousel>
                </>
              )}
            </div>

            {/* Right Column: Case Study Section */}
            <div className="w-full lg:flex-[0_0_calc(30%-1.5rem)] flex">
              {showCaseStudy && (
                <Card className="bg-card p-6 md:p-8 rounded-xl shadow-lg flex flex-col h-full w-full">
                  <div className="space-y-6 flex-grow">
                    {problemStatementToDisplay && (
                      <div>
                        <h3 className="flex items-center text-xl font-headline text-primary dark:text-foreground mb-3">
                          <Lightbulb className="mr-3 h-6 w-6 text-accent shrink-0" />
                          <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                            {theChallengeText}
                          </span>
                        </h3>
                        <p className="text-foreground/80 text-base leading-relaxed pl-2">
                          {problemStatementToDisplay}
                        </p>
                      </div>
                    )}
                    {solutionOverviewToDisplay && (
                        <div>
                        <h3 className="flex items-center text-xl font-headline text-primary dark:text-foreground mb-3">
                          <Target className="mr-3 h-6 w-6 text-accent shrink-0" />
                          <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                            {theApproachText}
                          </span>
                        </h3>
                        <p className="text-foreground/80 text-base leading-relaxed pl-2">
                          {solutionOverviewToDisplay}
                        </p>
                      </div>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div>
                        <h3 className="flex items-center text-xl font-headline text-primary dark:text-foreground mb-3">
                          <Cpu className="mr-3 h-6 w-6 text-accent shrink-0" />
                          <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                            {technologiesText}
                          </span>
                        </h3>
                        <div className="flex flex-wrap gap-2 pl-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="px-3 py-1 text-sm">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-4 pt-6 mt-auto">
                      {/* Left group: Action Buttons */}
                      <div className="flex flex-wrap justify-start items-center gap-3">
                        {project.liveUrl && project.liveUrl !== 'none' && (
                          <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                              <ExternalLink size={18} className="mr-2" />
                              <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                                {liveDemoButtonText}
                              </span>
                            </Link>
                          </Button>
                        )}
                        {project.repoUrl && project.repoUrl !== 'none' && (
                          <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground dark:border-foreground dark:text-foreground dark:hover:bg-foreground dark:hover:text-background">
                            <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                              <Github size={18} className="mr-2" />
                              <span className="inline md:hidden" style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                                {viewCodeButtonText}
                              </span>
                            </Link>
                          </Button>
                        )}
                      </div>
                      
                      {/* Right group: Category & Date */}
                      <div className="flex shrink-0 items-center gap-4 text-base text-muted-foreground ml-auto">
                        {project.category && (
                          <Badge variant="secondary" className="bg-accent/80 text-accent-foreground text-sm px-3 py-1">
                            {project.category}
                          </Badge>
                        )}
                        <div className="flex items-center">
                          <CalendarDays size={18} className="mr-2 text-accent" />
                          <span>{project.date}</span>
                        </div>
                      </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectClientContent;
