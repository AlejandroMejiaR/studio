
"use client";

import type { Project, ProjectTranslationDetails, ProjectProcessStep } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, Search, FileText, Lightbulb, DraftingCompass, CheckCircle2 } from 'lucide-react';
import { useLanguage, type AppTranslations } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import React from 'react';
import ImageModal from './ImageModal';
import { SectionContainer } from '@/components/layout/SectionContainer';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary dark:text-foreground mb-10 md:mb-12 text-center">
    {children}
  </h2>
);

const processIcons = [Search, FileText, Lightbulb, DraftingCompass, CheckCircle2];

const ProjectClientContent = ({ project }: { project: Project }) => {
  const { language, translationsForLanguage, isClientReady, getInitialServerTranslation } = useLanguage();

  const currentLangKey = language.toLowerCase() as 'en' | 'es';
  const langContent: ProjectTranslationDetails = project[currentLangKey] || project.en;

  const t = (key: keyof AppTranslations['projectDetails']) => isClientReady
    ? translationsForLanguage.projectDetails[key]
    : getInitialServerTranslation(trans => trans.projectDetails[key]);

  const titleToDisplay = isClientReady ? langContent.title : (project.es.title || "...");


  return (
    <article className="space-y-24 md:space-y-32 lg:space-y-36">
      {/* Section 1: Hero Section */}
      <section>
        <SectionContainer>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <h1 className="font-headline font-bold text-left text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
              {titleToDisplay}
            </h1>
          </div>
        </SectionContainer>
      </section>

      {/* Section 2: Resumen y Detalles Clave */}
      <section className="!mt-0 pt-0">
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 md:gap-12 max-w-6xl mx-auto items-start">
            <div className="lg:col-span-6">
              <p className="text-foreground/80 leading-relaxed text-3xl">{langContent.summary}</p>
            </div>
            <Card className="lg:col-span-4 bg-card p-6 md:p-8 rounded-xl shadow-lg">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
                <li><strong className="font-semibold text-primary dark:text-foreground">{t('myRole')}: </strong> <span className="text-foreground/80">{langContent.myRole}</span></li>
                <li><strong className="font-semibold text-primary dark:text-foreground">{t('technologies')}: </strong> <span className="text-foreground/80">{project.technologies.join(', ')}</span></li>
                <li><strong className="font-semibold text-primary dark:text-foreground">{t('category')}: </strong> <span className="text-foreground/80">{project.category}</span></li>
                <li><strong className="font-semibold text-primary dark:text-foreground">{t('date')}: </strong> <span className="text-foreground/80">{project.date}</span></li>
              </ul>
            </Card>
          </div>
        </SectionContainer>
      </section>

      {/* Section 3: Full-Width Hero Image */}
      {project.bannerUrl && (
        <section className="relative w-full h-auto aspect-[16/9] md:aspect-[21/9] bg-muted">
          <Image src={project.bannerUrl} alt={titleToDisplay} fill className="object-cover" priority data-ai-hint="product mockup" sizes="100vw" />
        </section>
      )}

      {/* Section 4: Problem and Objectives */}
      <section>
        <SectionContainer>
          <SectionTitle>{t('mainChallengeTitle')}</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-6">
              <h3 className="font-headline text-xl font-semibold text-primary dark:text-foreground mb-3">{t('problemDescription')}</h3>
              <p className="text-foreground/80 leading-relaxed text-lg">{langContent.problemStatement}</p>
            </div>
            <div className="lg:col-span-4">
              <h3 className="font-headline text-xl font-semibold text-primary dark:text-foreground mb-3">{t('projectObjectives')}</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground/80 marker:text-accent text-lg">
                {langContent.objectives?.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Section 5: The Process */}
      {langContent.process && langContent.process.length > 0 && (
         <section>
          <SectionContainer>
            <SectionTitle>{t('processTitle')}</SectionTitle>
            {langContent.processIntro && <p className="max-w-3xl mx-auto text-center text-foreground/80 mb-16 -mt-4 text-lg">{langContent.processIntro}</p>}
            <div className="space-y-16">
              {langContent.process.map((step, index) => {
                const Icon = processIcons[index] || Lightbulb;
                const isReversed = index % 2 !== 0;
                return (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className={cn("md:order-1", { "md:order-2": isReversed })}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-shrink-0 grid place-content-center h-12 w-12 rounded-full bg-accent text-accent-foreground">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-headline text-2xl font-bold text-primary dark:text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-foreground/80 leading-relaxed text-lg">{step.description}</p>
                    </div>
                    <div className={cn("relative aspect-video rounded-lg overflow-hidden bg-muted md:order-2", { "md:order-1": isReversed })}>
                       <Image src={step.imageUrl} alt={step.title} fill className="object-cover" data-ai-hint="design process" sizes="(max-width: 768px) 100vw, 50vw"/>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionContainer>
        </section>
      )}

      {/* Section 6: Final Product */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <section>
          <SectionContainer>
            <SectionTitle>{t('finalSolutionTitle')}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
              {project.galleryImages.slice(0, 4).map((src, index) => (
                <ImageModal key={index} imageUrl={src} altText={`${titleToDisplay} - final design ${index + 1}`}>
                  <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-muted">
                    <Image src={src} alt={`${titleToDisplay} - final design ${index + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="app screenshot" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                </ImageModal>
              ))}
            </div>
             <div className="flex flex-wrap justify-center items-center gap-4 mt-12">
              {project.liveUrl && project.liveUrl !== 'none' && (
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={20} className="mr-2" /> {t('exploreLiveDemo')}
                  </Link>
                </Button>
              )}
              {project.repoUrl && project.repoUrl !== 'none' && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github size={20} className="mr-2" /> {t('viewCodeButton')}
                  </Link>
                </Button>
              )}
            </div>
          </SectionContainer>
        </section>
      )}

      {/* Section 7: Learnings & Reflections */}
      <section>
        <SectionContainer>
          <SectionTitle>{t('learningsAndReflections')}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-5xl mx-auto">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
               <Image src={project.reflectionImageUrl || ''} alt={t('learningsAndReflections') || ''} fill className="object-cover" data-ai-hint="abstract growth" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <Card className="bg-card p-6 md:p-8 rounded-xl shadow-lg">
               <h3 className="font-headline text-xl font-semibold text-primary dark:text-foreground mb-4">{t('myLearnings')}</h3>
               <ul className="list-disc list-inside space-y-2 text-foreground/80 marker:text-accent text-lg">
                {langContent.learnings?.map((learning, i) => <li key={i}>{learning}</li>)}
              </ul>
            </Card>
          </div>
        </SectionContainer>
      </section>

    </article>
  );
};

export default ProjectClientContent;
