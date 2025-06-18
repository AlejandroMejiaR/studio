
"use client";

import { useEffect, useState, useRef } from 'react';
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
import { useFooter } from '@/contexts/FooterContext';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';


export default function HomePage() {
  const { language, translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();
  const { setIsFooterVisible } = useFooter();
  const aboutMeRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSubtitleAnimationComplete, setIsSubtitleAnimationComplete] = useState(false);
  const [shouldAnimateInitialLoadOrLanguageChange, setShouldAnimateInitialLoadOrLanguageChange] = useState(true);

  useEffect(() => {
    // Animations should always run on homepage load or language change.
    setShouldAnimateInitialLoadOrLanguageChange(true);
    setIsSubtitleAnimationComplete(false); // Reset for animations
  }, [isClientReady, language]);


  useEffect(() => {
    const aboutSection = aboutMeRef.current;

    if (!isClientReady || !aboutSection) {
      if (pathname === '/') {
        setIsFooterVisible(false);
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(aboutSection);

    if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        const isInitiallyVisible =
            rect.top < window.innerHeight && rect.bottom >= 0;
        setIsFooterVisible(isInitiallyVisible);
    }

    return () => {
      observer.disconnect();
    };
  }, [isClientReady, setIsFooterVisible, aboutMeRef, pathname]);


  useEffect(() => {
    if (!isClientReady) return;

    const hash = window.location.hash;
    if (!hash) return; // No hash, nothing to scroll to

    const id = hash.substring(1);
    let scrollTimer: NodeJS.Timeout;

    if (id === 'projects') {
      // Specific handling for #projects
      if (!isLoadingProjects) { // Only attempt if projects are loaded
        scrollTimer = setTimeout(() => {
          const element = document.getElementById('projects');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300); // Delay for DOM readiness
      }
      // If projects are loading, do nothing yet for #projects;
      // this effect will re-run when isLoadingProjects changes (due to dependency array).
    } else {
      // General handling for other hashes (e.g., #about)
      if (shouldAnimateInitialLoadOrLanguageChange && !isSubtitleAnimationComplete) {
        // If animating and animations not done, wait for animations to complete.
        // This effect will re-run when isSubtitleAnimationComplete changes.
        return;
      }
      scrollTimer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Delay for DOM readiness / animation completion
    }

    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [
    isClientReady,
    pathname, // Re-evaluate when path/hash changes
    isLoadingProjects, // Crucial for #projects
    isSubtitleAnimationComplete, // For #about and other general hashes
    shouldAnimateInitialLoadOrLanguageChange, // For #about and other general hashes
    language // If content affecting layout/ids changes due to language
  ]);


  useEffect(() => {
    if (shouldAnimateInitialLoadOrLanguageChange) {
        setIsSubtitleAnimationComplete(false);
    }
  }, [translationsForLanguage.home.hero.subtitle, shouldAnimateInitialLoadOrLanguageChange]);


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

  if (shouldAnimateInitialLoadOrLanguageChange) {
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
  }
  const subtitleTypingStartDelay = shouldAnimateInitialLoadOrLanguageChange ? maxTitleAnimationOverallEndTime + 0.5 : 0;


  const heroTitleElements = shouldAnimateInitialLoadOrLanguageChange ? (
    heroFullTitleLines.map((lineText, lineIndex) => {
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
    })
  ) : (
    heroFullTitleLines.map((lineText, lineIndex) => (
      <span key={`static-line-${lineIndex}`} className="block" style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
        {lineText}
      </span>
    ))
  );

  const subtitleElement = shouldAnimateInitialLoadOrLanguageChange ? (
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
  ) : (
    <p className="text-xl md:text-2xl text-foreground/80 max-w-full md:max-w-xl mb-10 min-h-[5em] whitespace-pre-line" style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
      {heroSubtitle}
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
            {(isSubtitleAnimationComplete || !shouldAnimateInitialLoadOrLanguageChange) && (
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
      {/* Assign ref to AboutMe section wrapper */}
      <section ref={aboutMeRef} id="about">
        <AboutMe />
      </section>
    </div>
  );
}
