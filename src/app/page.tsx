
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useFooter } from '@/contexts/FooterContext';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext'; // Added


export default function HomePage() {
  const { 
    language, 
    setLanguage, 
    translationsForLanguage, 
    isClientReady, 
    getEnglishTranslation,
    initialLanguageSelectedByUser,
    markInitialLanguageSelected
  } = useLanguage();
  const { setIsFooterVisible } = useFooter();
  const { setIsNavbarVisible } = useNavbarVisibility(); // Added
  const aboutMeRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSubtitleAnimationComplete, setIsSubtitleAnimationComplete] = useState(false);
  const [shouldAnimateInitialLoadOrLanguageChange, setShouldAnimateInitialLoadOrLanguageChange] = useState(false);


  useEffect(() => {
    if (initialLanguageSelectedByUser) {
      setShouldAnimateInitialLoadOrLanguageChange(true);
      setIsSubtitleAnimationComplete(false); 
    } else {
      setShouldAnimateInitialLoadOrLanguageChange(false);
    }
  }, [initialLanguageSelectedByUser, language]);


  const handleInitialLanguageSelect = (selectedLang: 'EN' | 'ES') => {
    setLanguage(selectedLang);
    markInitialLanguageSelected();
  };
  
  // Effect to control Navbar visibility
  useEffect(() => {
    if (!isClientReady || !initialLanguageSelectedByUser) {
      // If client isn't ready or language not selected (i.e., selection screen is up),
      // Navbar should be visible.
      setIsNavbarVisible(true);
      return;
    }

    if (pathname === '/') {
      if (shouldAnimateInitialLoadOrLanguageChange) {
        setIsNavbarVisible(false); // Hide Navbar if animations are about to play on home
      } else {
        setIsNavbarVisible(true); // Show Navbar if no animations on home (e.g. already completed)
      }
    } else {
      setIsNavbarVisible(true); // Always show Navbar on other pages
    }
  }, [
    isClientReady, 
    initialLanguageSelectedByUser, 
    pathname, 
    shouldAnimateInitialLoadOrLanguageChange, 
    setIsNavbarVisible,
    language // Added language as a dependency to re-evaluate if it changes
  ]);


  useEffect(() => {
    if (!initialLanguageSelectedByUser) {
      setIsFooterVisible(false); 
      return; 
    }

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
  }, [isClientReady, initialLanguageSelectedByUser, setIsFooterVisible, aboutMeRef, pathname]);


  useEffect(() => {
    if (!isClientReady || !initialLanguageSelectedByUser) return;

    const hash = window.location.hash;
    if (!hash) return; 

    const id = hash.substring(1);
    let scrollTimer: NodeJS.Timeout;

    if (id === 'projects') {
      if (!isLoadingProjects) { 
        scrollTimer = setTimeout(() => {
          const element = document.getElementById('projects');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300); 
      }
    } else {
      if (shouldAnimateInitialLoadOrLanguageChange && !isSubtitleAnimationComplete) {
        // Wait for animations if they are active and not complete for non-project hash links
        return;
      }
      scrollTimer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); 
    }

    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [
    isClientReady,
    initialLanguageSelectedByUser,
    pathname, 
    isLoadingProjects, 
    isSubtitleAnimationComplete, 
    shouldAnimateInitialLoadOrLanguageChange, 
    language 
  ]);


  useEffect(() => {
    if (initialLanguageSelectedByUser && shouldAnimateInitialLoadOrLanguageChange) {
        setIsSubtitleAnimationComplete(false);
    }
  }, [translationsForLanguage.home.hero.subtitle, shouldAnimateInitialLoadOrLanguageChange, initialLanguageSelectedByUser]);


  const heroFullTitleLines = isClientReady ? translationsForLanguage.home.hero.fullTitle : (getEnglishTranslation(t => t.home.hero.fullTitle) as string[] || ["Loading Title..."]);
  const heroSubtitle = isClientReady ? translationsForLanguage.home.hero.subtitle : getEnglishTranslation(t => t.home.hero.subtitle) as string || "Loading subtitle...";
  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getEnglishTranslation(t => t.home.buttons.viewWork) as string || "View Work";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getEnglishTranslation(t => t.home.buttons.aboutMe) as string || "About Me";
  const projectsSectionTitleText = isClientReady ? translationsForLanguage.home.projectsSectionTitle : getEnglishTranslation(t => t.home.projectsSectionTitle) as string || "My Projects";


  useEffect(() => {
    // Projects are only fetched if language has been selected.
    if (!initialLanguageSelectedByUser) return;

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
  }, [initialLanguageSelectedByUser]);

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
    <p className="text-4xl md:text-5xl text-foreground/80 max-w-full md:max-w-3xl mb-12 min-h-[7em] whitespace-pre-line">
      <TypingAnimation
        key={heroSubtitle}
        text={heroSubtitle || ""}
        speed={30}
        startDelay={subtitleTypingStartDelay}
        style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
        onComplete={() => {
          setIsSubtitleAnimationComplete(true);
          if (pathname === '/') setIsNavbarVisible(true); // Show Navbar when subtitle (last animation) completes
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
        {/* Basic placeholder while client readiness is being determined by LanguageProvider */}
      </div>
    );
  }

  if (!initialLanguageSelectedByUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-primary dark:text-foreground mb-4">
            Welcome / Bienvenido
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Please select your language / Por favor, selecciona tu idioma
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            size="lg"
            className="px-10 py-6 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={() => handleInitialLanguageSelect('ES')}
          >
            Español
          </Button>
          <Button
            size="lg"
            className="px-10 py-6 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => handleInitialLanguageSelect('EN')}
          >
            English
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto"> 
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center py-12">
        <div className="flex flex-col items-center max-w-3xl w-full">
          <h1 className="font-headline text-7xl sm:text-8xl md:text-9xl lg:text-[7.5rem] font-bold mb-8 text-foreground dark:text-foreground">
            {heroTitleElements}
          </h1>
          {subtitleElement}
          {(isSubtitleAnimationComplete || !shouldAnimateInitialLoadOrLanguageChange) && (
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
