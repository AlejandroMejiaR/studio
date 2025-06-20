
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
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useFooter } from '@/contexts/FooterContext';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';


export default function HomePage() {
  const { 
    language, 
    translationsForLanguage, 
    isClientReady, 
    getEnglishTranslation
  } = useLanguage();
  const { setIsFooterVisible } = useFooter();
  const { setIsNavbarVisible } = useNavbarVisibility();
  const aboutMeRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSubtitleAnimationComplete, setIsSubtitleAnimationComplete] = useState(false);
  
  // This flag determines if the full hero intro animation plays.
  // It should play on initial load and on language change.
  const [shouldAnimateHeroIntro, setShouldAnimateHeroIntro] = useState(false);
  const previousLanguageRef = useRef<Language | undefined>();
  const initialLoadAnimatedRef = useRef(false); // Tracks if initial load animation has been triggered


  useEffect(() => {
    if (isClientReady) {
      if (!initialLoadAnimatedRef.current) {
        // First meaningful render after client is ready
        setShouldAnimateHeroIntro(true);
        setIsSubtitleAnimationComplete(false); // Ensure subtitle also re-animates or resets
        initialLoadAnimatedRef.current = true;
      } else if (previousLanguageRef.current !== undefined && previousLanguageRef.current !== language) {
        // Language has changed (and it's not the very first load animation cycle)
        setShouldAnimateHeroIntro(true);
        setIsSubtitleAnimationComplete(false); // Ensure subtitle also re-animates or resets
      }
      // Only update previousLanguageRef if language actually changed or on initial setup
      if (previousLanguageRef.current !== language) {
        previousLanguageRef.current = language;
      }
    } else {
      // Client not ready, ensure animations are off.
      setShouldAnimateHeroIntro(false);
    }
  }, [isClientReady, language]);
  
  useEffect(() => {
    if (!isClientReady) return;

    if (pathname === '/') {
      if (shouldAnimateHeroIntro) {
        setIsNavbarVisible(false); // Hide Navbar if animations are about to play
      } else if (!isSubtitleAnimationComplete && initialLoadAnimatedRef.current) {
        // This handles the state where animations *were* triggered (initialLoadAnimatedRef is true),
        // are currently playing (shouldAnimateHeroIntro might be false if animation completed quickly or after one cycle),
        // but the subtitle isn't done yet. Navbar should remain hidden.
        setIsNavbarVisible(false);
      } else {
        // Animations are not set to trigger, or they are complete.
        setIsNavbarVisible(true);
      }
    } else {
      // On other pages, Navbar should be visible
      setIsNavbarVisible(true);
    }
  }, [isClientReady, pathname, shouldAnimateHeroIntro, isSubtitleAnimationComplete, setIsNavbarVisible, language]);


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
    const rect = aboutSection.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    setIsFooterVisible(isInitiallyVisible);
    
    return () => {
      observer.disconnect();
    };
  }, [isClientReady, setIsFooterVisible, aboutMeRef, pathname]);


  useEffect(() => {
    if (!isClientReady) return;

    const hash = window.location.hash;
    if (!hash) return; 

    const id = hash.substring(1);
    let scrollTimer: NodeJS.Timeout;

    const attemptScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    if (id === 'projects') {
      if (!isLoadingProjects) { 
        scrollTimer = setTimeout(attemptScroll, 300); 
      }
    } else { // For #about or other sections
      if (shouldAnimateHeroIntro && !isSubtitleAnimationComplete) {
        // If animations are running and subtitle isn't done, wait.
        // This ensures scrolling happens after the intro is mostly settled.
        // A more robust way might be to listen for a specific animation end event.
        // For now, we rely on isSubtitleAnimationComplete.
      } else {
        // Animations are not playing, or subtitle is complete
        scrollTimer = setTimeout(attemptScroll, 300);
      }
    }

    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [
    isClientReady,
    pathname, 
    isLoadingProjects, 
    isSubtitleAnimationComplete, 
    shouldAnimateHeroIntro, 
    language 
  ]);


  useEffect(() => {
    // This effect ensures that if shouldAnimateHeroIntro is true (meaning animations are intended),
    // isSubtitleAnimationComplete is reset. This is crucial for re-triggering typing animation on language change.
    if (shouldAnimateHeroIntro) {
        setIsSubtitleAnimationComplete(false);
    }
  }, [shouldAnimateHeroIntro]);


  const heroFullTitleLines = isClientReady ? translationsForLanguage.home.hero.fullTitle : (getEnglishTranslation(t => t.home.hero.fullTitle) as string[] || ["Loading Title..."]);
  const heroSubtitle = isClientReady ? translationsForLanguage.home.hero.subtitle : getEnglishTranslation(t => t.home.hero.subtitle) as string || "Loading subtitle...";
  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getEnglishTranslation(t => t.home.buttons.viewWork) as string || "View Work";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getEnglishTranslation(t => t.home.buttons.aboutMe) as string || "About Me";
  const projectsSectionTitleText = isClientReady ? translationsForLanguage.home.projectsSectionTitle : getEnglishTranslation(t => t.home.projectsSectionTitle) as string || "My Projects";


  useEffect(() => {
    if (!isClientReady) return; // Wait for client (and language) to be ready

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
  }, [isClientReady]); // Fetch projects once client is ready

  const lineAnimationProps: { lineBaseDelay: number; text: string }[] = [];
  let currentCumulativeLineBaseDelay = 0;
  let maxTitleAnimationOverallEndTime = 0;

  const letterStaggerConst = 0.04;
  const letterAnimationDurationConst = 0.5;
  const delayBetweenWordsConst = 0.15;

  if (shouldAnimateHeroIntro) {
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
  const subtitleTypingStartDelay = shouldAnimateHeroIntro ? maxTitleAnimationOverallEndTime + 0.5 : 0;


  const heroTitleElements = shouldAnimateHeroIntro ? (
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

  const subtitleElement = shouldAnimateHeroIntro ? (
    <p className="text-4xl md:text-5xl text-foreground/80 max-w-full md:max-w-3xl mb-12 min-h-[7em] whitespace-pre-line">
      <TypingAnimation
        key={heroSubtitle} // Key change will re-trigger animation
        text={heroSubtitle || ""}
        speed={30}
        startDelay={subtitleTypingStartDelay}
        style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
        onComplete={() => {
          setIsSubtitleAnimationComplete(true);
          if (pathname === '/') setIsNavbarVisible(true); 
          setShouldAnimateHeroIntro(false); // Turn off animation trigger after completion
        }}
      />
    </p>
  ) : (
    <p className="text-4xl md:text-5xl text-foreground/80 max-w-full md:max-w-3xl mb-12 min-h-[7em] whitespace-pre-line" style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
      {heroSubtitle}
    </p>
  );

  if (!isClientReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         {/* Minimal loading state, or a skeleton if preferred */}
      </div>
    );
  }

  return (
    <div className="container mx-auto"> 
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center py-12">
        <div className="flex flex-col items-center max-w-3xl w-full">
          <h1 className="font-headline text-7xl sm:text-8xl md:text-9xl lg:text-[7.5rem] font-bold mb-8 text-foreground dark:text-foreground">
            {heroTitleElements}
          </h1>
          {subtitleElement}
          {(isSubtitleAnimationComplete || !shouldAnimateHeroIntro) && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fadeIn mt-10">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground text-2xl px-10 py-5">
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
                className="border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:border-foreground dark:text-foreground dark:hover:bg-[hsl(270,95%,80%)] dark:hover:text-[hsl(225,30%,10%)] dark:hover:border-[hsl(270,95%,80%)] text-2xl px-10 py-5"
              >
                <Link href="/#about">
                  <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                    {aboutMeButtonText}
                  </span>
                  <ArrowDown size={32} className="ml-2.5" />
                </Link>
              </Button>
            </div>
          )}
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
      <section ref={aboutMeRef} id="about">
        <AboutMe />
      </section>
    </div>
  );
}
