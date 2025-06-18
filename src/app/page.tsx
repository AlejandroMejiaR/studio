
"use client"; 

import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import { getAllProjectsFromFirestore } from '@/lib/firebase';
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import TypingAnimation from '@/components/effects/TypingAnimation';
import WordRevealAnimation from '@/components/effects/WordRevealAnimation';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { language, translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  
  const [isSubtitleAnimationComplete, setIsSubtitleAnimationComplete] = useState(false);

  useEffect(() => {
    // Reset subtitle animation complete flag when subtitle text changes (e.g., language switch)
    // This ensures buttons re-appear after the new subtitle animates.
    setIsSubtitleAnimationComplete(false);
  }, [translationsForLanguage.home.hero.subtitle]);


  useEffect(() => {
    // Condition 1: Client must be ready, and subtitle animation must be considered complete.
    if (!isClientReady || !isSubtitleAnimationComplete) return;

    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1); // e.g., "projects" or "about"

      // Condition 2: If targeting "projects", projects must not be in a loading state.
      // For "about" or other hashes, this condition is bypassed.
      if (id === 'projects' && isLoadingProjects) {
        return; // Defer scrolling for #projects if projects are still loading.
      }

      const scrollTimer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to allow DOM to settle.

      return () => clearTimeout(scrollTimer);
    }
  }, [isClientReady, isSubtitleAnimationComplete, language, isLoadingProjects]); 


  const heroFullTitleLines = isClientReady ? translationsForLanguage.home.hero.fullTitle : (getEnglishTranslation(t => t.home.hero.fullTitle) as string[] || ["Loading Title..."]);
  const heroSubtitle = isClientReady ? translationsForLanguage.home.hero.subtitle : getEnglishTranslation(t => t.home.hero.subtitle) as string || "Loading subtitle...";
  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getEnglishTranslation(t => t.home.buttons.viewWork) as string || "View Work";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getEnglishTranslation(t => t.home.buttons.aboutMe) as string || "About Me";
  const projectsSectionTitleText = isClientReady ? translationsForLanguage.home.projectsSectionTitle : getEnglishTranslation(t => t.home.projectsSectionTitle) as string || "My Projects";


  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const fetchedProjects = await getAllProjectsFromFirestore();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const lineAnimationProps: { lineBaseDelay: number; text: string }[] = [];
  let currentCumulativeLineBaseDelay = 0; 
  let maxTitleAnimationOverallEndTime = 0;

  const letterStaggerConst = 0.04;
  const letterAnimationDurationConst = 0.5;
  const delayBetweenWordsConst = 0.15;

  heroFullTitleLines.forEach((lineText) => {
    const currentLineStartOffset = currentCumulativeLineBaseDelay;
    lineAnimationProps.push({ lineBaseDelay: currentLineStartOffset, text: lineText });

    const words = lineText.split(' ').filter(w => w.length > 0);
    let internalDurationOfThisLine = 0;
    if (words.length > 0) {
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordAnimTime = (word.length > 0 ? (word.length - 1) * letterStaggerConst : 0) + letterAnimationDurationConst;
        internalDurationOfThisLine += wordAnimTime;

        if (i < words.length - 1) {
          let actualInterWordDelay = delayBetweenWordsConst;
          if ((words[i] === "Ideas" && words[i+1] === "Into") || (words[i] === "Ideas" && words[i+1] === "En")) {
            actualInterWordDelay = 0;
          }
          internalDurationOfThisLine += actualInterWordDelay;
        }
      }
    }

    const thisLineEndsAt = currentLineStartOffset + internalDurationOfThisLine;
    if (thisLineEndsAt > maxTitleAnimationOverallEndTime) {
      maxTitleAnimationOverallEndTime = thisLineEndsAt;
    }
    
    if (words.length > 0) {
        currentCumulativeLineBaseDelay += internalDurationOfThisLine * 0.5 + 0.3; 
    } else {
        currentCumulativeLineBaseDelay += 0.3; 
    }
  });
  
  const subtitleTypingStartDelay = maxTitleAnimationOverallEndTime + 0.5; 

  const heroTitleElements = heroFullTitleLines.map((lineText, lineIndex) => {
    const currentLineAnimProps = lineAnimationProps[lineIndex];
    if (!currentLineAnimProps) return null; 

    return (
      <WordRevealAnimation
        key={`${language}-line-${lineIndex}-${lineText}`} 
        text={lineText || ""}
        lineBaseDelay={currentLineAnimProps.lineBaseDelay}
        delayBetweenWords={delayBetweenWordsConst}
        letterStaggerDelay={letterStaggerConst}
        letterAnimationDuration={letterAnimationDurationConst}
        style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
        className="block"
      />
    );
  });

  const subtitleElement = (
    <p className="text-xl md:text-2xl text-foreground/80 max-w-full md:max-w-xl mb-10 min-h-[5em] whitespace-pre-line">
      <TypingAnimation
        key={heroSubtitle} 
        text={heroSubtitle || ""}
        speed={30}
        startDelay={subtitleTypingStartDelay}
        style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
        onComplete={() => setIsSubtitleAnimationComplete(true)}
      />
    </p>
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:justify-between">
          {/* Left Column: Title, Subtitle, Buttons */}
          <div className="md:w-1/2 flex flex-col text-left">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground dark:text-foreground text-left">
              {heroTitleElements}
            </h1>
            {subtitleElement}
            {isSubtitleAnimationComplete && (
              <div className="flex flex-col sm:flex-row justify-start items-center gap-4 animate-fadeIn">
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/#projects">
                    <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                      {viewWorkButtonText}
                    </span>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:border-foreground dark:text-foreground dark:hover:bg-[hsl(270,95%,80%)] dark:hover:text-[hsl(225,30%,10%)] dark:hover:border-[hsl(270,95%,80%)]"
                >
                  <Link href="/#about">
                    <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                      {aboutMeButtonText}
                    </span>
                    <ArrowDown size={20} className="ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end items-center md:ml-[150px]">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 aspect-square relative rounded-lg overflow-hidden shadow-lg bg-muted/30 mx-auto md:mx-0">
              <Image
                src="https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/projects//ChatGPT%20Image%20Jun%2015,%202025,%2010_43_19%20PM.png"
                alt="Digital Experiences Placeholder"
                fill
                className="object-contain"
                sizes="(max-width: 767px) 256px, (max-width: 1023px) 320px, 384px"
                data-ai-hint="robot laptop"
              />
            </div>
          </div>
        </div>
      </section>

      {isLoadingProjects ? (
         <section id="projects-loading" className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16 lg:py-20">
           <h2 
            className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 dark:text-foreground"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
           >
             {projectsSectionTitleText}
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex flex-col space-y-3">
                 <Skeleton className="h-[200px] w-full rounded-xl" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                 </div>
                 <div className="flex justify-between items-center pt-2">
                   <Skeleton className="h-8 w-20" />
                   <Skeleton className="h-8 w-24" />
                 </div>
               </div>
             ))}
           </div>
         </section>
      ) : (
        <ProjectList projects={projects} />
      )}
      <AboutMe />
    </div>
  );
}
