
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
  const { setShouldNavbarContentBeVisible } = useNavbarVisibility();
  const aboutMeRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const navbarAnimationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSubtitleAnimationComplete, setIsSubtitleAnimationComplete] = useState(false);

  const [shouldAnimateHeroIntro, setShouldAnimateHeroIntro] = useState(false);
  const previousLanguageRef = useRef<Language | undefined>();
  const initialLoadAnimatedRef = useRef(false);


  useEffect(() => {
    if (isClientReady) {
      if (!initialLoadAnimatedRef.current) {
        setShouldAnimateHeroIntro(true);
        setIsSubtitleAnimationComplete(false);
        initialLoadAnimatedRef.current = true;
      } else if (previousLanguageRef.current !== undefined && previousLanguageRef.current !== language) {
        setShouldAnimateHeroIntro(true);
        setIsSubtitleAnimationComplete(false);
      }
      if (previousLanguageRef.current !== language) {
        previousLanguageRef.current = language;
      }
    } else {
      setShouldAnimateHeroIntro(false);
    }
  }, [isClientReady, language]);

  useEffect(() => {
    if (!isClientReady) return;

    if (navbarAnimationTimeoutRef.current) {
        clearTimeout(navbarAnimationTimeoutRef.current);
        navbarAnimationTimeoutRef.current = null;
    }

    if (pathname === '/') {
        const heroAnimationsAreDoneOrSkipped = isSubtitleAnimationComplete || !shouldAnimateHeroIntro;

        if (shouldAnimateHeroIntro && !isSubtitleAnimationComplete) {
            // Animations are actively running (or about to run) and not yet finished
            setShouldNavbarContentBeVisible(false);
        } else if (heroAnimationsAreDoneOrSkipped) {
            // Animations have finished OR they were skipped
            // Ensure Navbar content is not visible until the timeout completes
            setShouldNavbarContentBeVisible(false); 

            navbarAnimationTimeoutRef.current = setTimeout(() => {
                setShouldNavbarContentBeVisible(true); // Signal Navbar content to animate in
            }, 1000); // 1-second delay
        } else {
            // Fallback for any intermediate states during animation cycles if needed
            setShouldNavbarContentBeVisible(false);
        }
    } else {
        // Not on the homepage, Navbar context will handle making content visible
        setShouldNavbarContentBeVisible(true);
    }

    return () => {
        if (navbarAnimationTimeoutRef.current) {
            clearTimeout(navbarAnimationTimeoutRef.current);
        }
        // When navigating away from home, ensure Navbar content is visible for the next page
        // This is also handled by the NavbarVisibilityContext's own useEffect for pathname changes.
        // if (pathname === '/') {
        //   setShouldNavbarContentBeVisible(true);
        // }
    };
  }, [
      isClientReady,
      pathname,
      shouldAnimateHeroIntro,
      isSubtitleAnimationComplete,
      setShouldNavbarContentBeVisible,
      language // Re-run if language changes, as it might affect animation triggers
  ]);


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
    } else {
      if (shouldAnimateHeroIntro && !isSubtitleAnimationComplete) {
        // Wait if animations are running
      } else {
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
    if (!isClientReady) return;

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
  }, [isClientReady]);

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
    <p className="text-2xl md:text-3xl text-foreground/80 max-w-full md:max-w-3xl mb-10 min-h-[6em] whitespace-pre-line text-center">
      <TypingAnimation
        key={heroSubtitle}
        text={heroSubtitle || ""}
        speed={30}
        startDelay={subtitleTypingStartDelay}
        style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
        onComplete={() => {
          setIsSubtitleAnimationComplete(true);
          setShouldAnimateHeroIntro(false);
        }}
      />
    </p>
  ) : (
    <p className="text-2xl md:text-3xl text-foreground/80 max-w-full md:max-w-3xl mb-10 min-h-[6em] whitespace-pre-line text-center" style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
      {heroSubtitle}
    </p>
  );

  if (!isClientReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center py-16 md:py-20">
        <div className="flex flex-col items-center max-w-4xl w-full">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold mb-6 text-foreground dark:text-foreground text-center">
            {heroTitleElements}
          </h1>
          {subtitleElement}
          {(isSubtitleAnimationComplete || !shouldAnimateHeroIntro) && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-5 animate-fadeIn mt-8">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-4">
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
                className="border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:border-foreground dark:text-foreground dark:hover:bg-[hsl(270,95%,80%)] dark:hover:text-[hsl(225,30%,10%)] dark:hover:border-[hsl(270,95%,80%)] text-lg px-8 py-4"
              >
                <Link href="/#about">
                  <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                    {aboutMeButtonText}
                  </span>
                  <ArrowDown size={22} className="ml-2.5" />
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

    