
"use client";

import type { Project, ProjectTranslationDetails, ProjectProcessStep } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, Search, FileText, Lightbulb, DraftingCompass, CheckCircle2, X } from 'lucide-react';
import { useLanguage, type AppTranslations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { SectionContainer } from '@/components/layout/SectionContainer';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';


const ImageDialog = ({ imageUrl, altText, children }: { imageUrl: string, altText: string, children: React.ReactNode }) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-0 shadow-none flex items-center justify-center">
            <div className="relative aspect-[16/9] w-full">
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    className="object-contain"
                    sizes="90vw"
                />
            </div>
            <DialogClose asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute -top-2 -right-2 md:-top-3 md:-right-3 h-10 w-10 rounded-full z-20 border-2 border-accent bg-background/80 backdrop-blur-sm hover:bg-accent group flex items-center justify-center transition-colors duration-200"
                    aria-label="Close image viewer"
                >
                    <X className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
                </Button>
            </DialogClose>
        </DialogContent>
    </Dialog>
);


const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary dark:text-foreground mb-10 md:mb-12 text-center">
    {children}
  </h2>
);

const processIcons = [Search, FileText, Lightbulb, DraftingCompass, CheckCircle2];

// Map technology names to Supabase image URLs
const getTechIconUrl = (tech: string) => {
    const lowerCaseTech = tech.toLowerCase();
    const baseUrl = "https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Logos/";

    switch (lowerCaseTech) {
        case 'next.js': return `${baseUrl}next-js.png`;
        case 'react': return `${baseUrl}React.png`;
        case 'tailwindcss': return `${baseUrl}Tailwind.png`;
        case 'firebase': return `${baseUrl}Firebase.png`;
        case 'vercel': return `${baseUrl}Vercel.png`;
        case 'unity': return `${baseUrl}UnityClaro.png`;
        case 'figma': return `${baseUrl}Figma.png`;
        case 'p5.js': return `${baseUrl}p5js.png`;
        case 'javascript': return `${baseUrl}javascript.png`;
        case 'c#': return `${baseUrl}c-sharp.png`;
        case 'blender': return `${baseUrl}Blender.png`;
        default: return null; // Fallback for unmapped tech
    }
};


const ProjectClientContent = ({ project }: { project: Project }) => {
  const { language, translationsForLanguage, isClientReady, getInitialServerTranslation } = useLanguage();

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent: ProjectTranslationDetails = project[currentLangKey] || project.en;

  const t = (key: keyof AppTranslations['projectDetails']) => isClientReady
    ? translationsForLanguage.projectDetails[key]
    : getInitialServerTranslation(trans => trans.projectDetails[key]);

  const titleToDisplay = isClientReady ? langContent.title : (project.es.title || "...");

  const handleSmoothScroll = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    const scrollButton = document.getElementById('scroll-down-button');
    if (scrollButton) {
      scrollButton.addEventListener('click', handleSmoothScroll as EventListener);
    }
    return () => {
      if (scrollButton) {
        scrollButton.removeEventListener('click', handleSmoothScroll as EventListener);
      }
    };
  }, []);


  return (
    <article className="space-y-24 md:space-y-32 lg:space-y-36 pt-24 md:pt-32">
      {/* Section 2: Resumen y Detalles Clave */}
      <section className="!pt-0">
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 md:gap-12 max-w-6xl mx-auto items-start">
            <div className="lg:col-span-6">
              <p className="text-foreground/80 leading-relaxed text-3xl">{langContent.summary}</p>
            </div>
            <Card className="lg:col-span-4 bg-card p-6 md:p-8 rounded-xl shadow-lg">
              <ul className="space-y-4 text-lg">
                <li><strong className="font-semibold text-primary dark:text-foreground">{t('myRole')}: </strong> <span className="text-foreground/80">{langContent.myRole}</span></li>
                <li><strong className="font-semibold text-primary dark:text-foreground">{t('category')}: </strong> <span className="text-foreground/80">{project.category}</span></li>
                <li><strong className="font-semibold text-primary dark:text-foreground">{t('date')}: </strong> <span className="text-foreground/80">{project.date}</span></li>
                <li>
                  <strong className="font-semibold text-primary dark:text-foreground mb-2 block">{t('technologies')}: </strong>
                  <div className="flex flex-wrap gap-3">
                      <TooltipProvider>
                          {project.technologies.map(tech => {
                              const iconUrl = getTechIconUrl(tech);
                              if (!iconUrl) return null;

                              return (
                                  <Tooltip key={tech}>
                                      <TooltipTrigger asChild>
                                          <div className="p-2 rounded-md bg-muted/50 border border-border/50 h-10 w-10 flex items-center justify-center">
                                              <Image src={iconUrl} alt={tech} width={24} height={24} className="object-contain" />
                                          </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>{tech}</p>
                                      </TooltipContent>
                                  </Tooltip>
                              );
                          })}
                      </TooltipProvider>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </SectionContainer>
      </section>
    </article>
  );
};

export default ProjectClientContent;
