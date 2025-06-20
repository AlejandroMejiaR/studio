
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
import { cn } from '@/lib/utils';


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

  const [shouldAnimateHeroIntro, setShouldAnimateHeroIntro] = useState(false);
  const previousLanguageRef = useRef<Language | undefined>();

  // Animation sequence state flags
  const [isTitleRevealComplete, setIsTitleRevealComplete] = useState(false);
  const [isTitleSlidingDown, setIsTitleSlidingDown] = useState(false);
  const [isSubtitleEmphasizing, setIsSubtitleEmphasizing] = useState(false);
  const [isSubtitleTypingEmphasized, setIsSubtitleTypingEmphasized] = useState(false);
  const [isSubtitleTypingEmphasizedComplete, setIsSubtitleTypingEmphasizedComplete] = useState(false);
  const [isSubtitleReturning, setIsSubtitleReturning] = useState(false);
  const [isTitleSlidingUp, setIsTitleSlidingUp] = useState(false);
  const [isHeroSettled, setIsHeroSettled] = useState(false);

  // Animation durations (ms)
  const titleSlideDownAnimationDuration = 500;
  const subtitleEmphasisAnimationDuration = 300; // For font size/weight/transform transition
  const titleSlideUpAnimationDuration = 500;
  const subtitleReturnAnimationDuration = 300; // Same as emphasis. This duration covers the fade-out & resize. The fade-in will take another 300ms.

  const animationTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAnimationTimeouts = () => {
    animationTimersRef.current.forEach(clearTimeout);
    animationTimersRef.current = [];
  };


  // This useEffect determines if the main hero intro animation should run.
  useEffect(() => {
    if (!isClientReady) {
      setShouldAnimateHeroIntro(false);
      return;
    }

    const hasAnimatedThisSession = sessionStorage.getItem('portfolioAceHeroAnimatedThisSession') === 'true';

    if (previousLanguageRef.current !== undefined && previousLanguageRef.current !== language) {
      sessionStorage.setItem('portfolioAceHeroAnimatedThisSession', 'false');
      setShouldAnimateHeroIntro(true);
    } else if (!hasAnimatedThisSession) {
      setShouldAnimateHeroIntro(true);
    } else {
      setShouldAnimateHeroIntro(false);
    }

    if (previousLanguageRef.current !== language) {
      previousLanguageRef.current = language;
    }
  }, [isClientReady, language]);


  // Master orchestrator for hero animations
  useEffect(() => {
    clearAnimationTimeouts();

    if (shouldAnimateHeroIntro && isClientReady) {
      setIsTitleRevealComplete(false);
      setIsTitleSlidingDown(false);
      setIsSubtitleEmphasizing(false);
      setIsSubtitleTypingEmphasized(false);
      setIsSubtitleTypingEmphasizedComplete(false);
      setIsSubtitleReturning(false);
      setIsTitleSlidingUp(false);
      setIsHeroSettled(false);

      const heroFullTitleLinesForCalc = translationsForLanguage.home.hero.fullTitle;
      let calculatedMaxTitleAnimationOverallEndTime = 0;
      let cumulativeDelay = 0;
      heroFullTitleLinesForCalc.forEach((lineText) => {
        const words = lineText.split(' ').filter(w => w.length > 0);
        let lineDuration = 0;
        if (words.length > 0) {
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            lineDuration += (word.length > 0 ? (word.length - 1) * 0.04 : 0) + 0.5;
            if (i < words.length - 1) {
              let actualInterWordDelay = 0.15;
              if ((words[i] === "Ideas" && words[i+1] === "Into") || (words[i] === "Ideas" && words[i+1] === "En")) {
                actualInterWordDelay = 0;
              }
              lineDuration += actualInterWordDelay;
            }
          }
        }
        const lineEndTime = cumulativeDelay + lineDuration;
        if (lineEndTime > calculatedMaxTitleAnimationOverallEndTime) {
          calculatedMaxTitleAnimationOverallEndTime = lineEndTime;
        }
        cumulativeDelay += (words.length > 0 ? lineDuration * 0.5 : 0) + 0.3;
      });
      const titleWordRevealDuration = (calculatedMaxTitleAnimationOverallEndTime + 0.1) * 1000;

      const timer1 = setTimeout(() => {
        setIsTitleRevealComplete(true);
        setIsTitleSlidingDown(true);
      }, titleWordRevealDuration);
      animationTimersRef.current.push(timer1);

      const timer2 = setTimeout(() => {
        setIsSubtitleEmphasizing(true);
      }, titleWordRevealDuration + titleSlideDownAnimationDuration);
      animationTimersRef.current.push(timer2);

      const timer3 = setTimeout(() => {
        setIsSubtitleTypingEmphasized(true);
      }, titleWordRevealDuration + titleSlideDownAnimationDuration + subtitleEmphasisAnimationDuration);
      animationTimersRef.current.push(timer3);

    } else if (!shouldAnimateHeroIntro && isClientReady) {
      setIsTitleRevealComplete(true);
      setIsTitleSlidingDown(false);
      setIsSubtitleEmphasizing(false);
      setIsSubtitleTypingEmphasized(false);
      setIsSubtitleTypingEmphasizedComplete(true);
      setIsSubtitleReturning(false);
      setIsTitleSlidingUp(false);
      setIsHeroSettled(true);
    }

    return clearAnimationTimeouts;
  }, [shouldAnimateHeroIntro, isClientReady, language, translationsForLanguage.home.hero.fullTitle]);


  const handleSubtitleEmphasisTypingComplete = () => {
    if (!shouldAnimateHeroIntro && !isHeroSettled && !isClientReady) return;

    setIsSubtitleTypingEmphasized(false); // Ensure TypingAnimation stops rendering
    setIsSubtitleTypingEmphasizedComplete(true);
    setIsSubtitleReturning(true); // This triggers resize + fade-out to opacity-0
    setIsTitleSlidingUp(true);
    setIsTitleSlidingDown(false);

    // This delay is for the subtitle to resize and fade OUT, and title to slide up.
    // After this, isHeroSettled will become true, triggering subtitle to fade IN.
    const settleDelay = Math.max(titleSlideUpAnimationDuration, subtitleReturnAnimationDuration);
    const timer = setTimeout(() => {
      setIsHeroSettled(true); // This will trigger the subtitle to fade IN to opacity-80
      setShouldAnimateHeroIntro(false);
      if (isClientReady) {
        sessionStorage.setItem('portfolioAceHeroAnimatedThisSession', 'true');
      }
    }, settleDelay);
    animationTimersRef.current.push(timer);
  };


  useEffect(() => {
    if (!isClientReady) return;

    if (navbarAnimationTimeoutRef.current) {
        clearTimeout(navbarAnimationTimeoutRef.current);
        navbarAnimationTimeoutRef.current = null;
    }

    if (pathname === '/') {
        const heroAnimationsDoneOrSkipped = isHeroSettled || !shouldAnimateHeroIntro;

        if (shouldAnimateHeroIntro && !isHeroSettled) {
            setShouldNavbarContentBeVisible(false);
        } else if (heroAnimationsDoneOrSkipped) {
            setShouldNavbarContentBeVisible(false);
            navbarAnimationTimeoutRef.current = setTimeout(() => {
                setShouldNavbarContentBeVisible(true);
            }, 1000);
        } else {
            setShouldNavbarContentBeVisible(false);
        }
    } else {
        setShouldNavbarContentBeVisible(true);
    }

    return () => {
        if (navbarAnimationTimeoutRef.current) {
            clearTimeout(navbarAnimationTimeoutRef.current);
        }
    };
  }, [
      isClientReady,
      pathname,
      shouldAnimateHeroIntro,
      isHeroSettled,
      setShouldNavbarContentBeVisible,
      language
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
      if (shouldAnimateHeroIntro && !isHeroSettled) {
        // Wait if animations are running
      } else {
        scrollTimer = setTimeout(attemptScroll, 300);
      }
    }
    if(scrollTimer) animationTimersRef.current.push(scrollTimer);


    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [
    isClientReady,
    pathname,
    isLoadingProjects,
    isHeroSettled,
    shouldAnimateHeroIntro,
    language
  ]);


  const heroFullTitleLines = isClientReady ? translationsForLanguage.home.hero.fullTitle : (getEnglishTranslation(t => t.home.hero.fullTitle) as string[] || ["Loading Title..."]);
  const heroSubtitle = isClientReady ? translationsForLanguage.home.hero.subtitle : getEnglishTranslation(t => t.home.hero.subtitle) as string || "Loading subtitle...";
  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getEnglishTranslation(t => t.home.buttons.viewWork) as string || "View Work";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getEnglishTranslation(t => t.home.buttons.aboutMe) as string || "About Me";
  const projectsSectionTitleText = isClientReady ? translationsForLanguage.home.projectsSectionTitle : getEnglishTranslation(t => t.home.projectsSectionTitle) as string || "My Projects";

  const lineAnimationProps: { lineBaseDelay: number; text: string }[] = [];
  if (shouldAnimateHeroIntro && !isTitleRevealComplete) {
    let currentCumulativeLineBaseDelay = 0;
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
            internalDurationOfThisLine += (word.length > 0 ? (word.length - 1) * letterStaggerConst : 0) + letterAnimationDurationConst;
            if (i < words.length - 1) {
              let actualInterWordDelay = delayBetweenWordsConst;
              if ((words[i] === "Ideas" && words[i+1] === "Into") || (words[i] === "Ideas" && words[i+1] === "En")) {
                  actualInterWordDelay = 0;
              }
              internalDurationOfThisLine += actualInterWordDelay;
            }
          }
        }
        if (words.length > 0) {
            currentCumulativeLineBaseDelay += internalDurationOfThisLine * 0.5 + 0.3;
        } else {
            currentCumulativeLineBaseDelay += 0.3;
        }
    });
  }

  let heroTitleContent;
  if (shouldAnimateHeroIntro && !isTitleRevealComplete && !isTitleSlidingDown && !isTitleSlidingUp && !isHeroSettled) {
    heroTitleContent = heroFullTitleLines.map((lineText, lineIndex) => {
      const currentLineAnimProps = lineAnimationProps[lineIndex];
      if (!currentLineAnimProps) return null;
      return (
        <WordRevealAnimation
          key={`${language}-line-${lineIndex}-${lineText}`}
          text={lineText || ""}
          lineBaseDelay={currentLineAnimProps.lineBaseDelay}
          delayBetweenWords={0.15}
          letterStaggerDelay={0.04}
          letterAnimationDuration={0.5}
          style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          className="block"
        />
      );
    });
  } else {
    heroTitleContent = heroFullTitleLines.map((lineText, lineIndex) => (
      <span key={`static-line-${lineIndex}-${language}`} className="block" style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
        {lineText}
      </span>
    ));
  }

  const getSubtitleOpacityClass = () => {
    if (!isClientReady) return 'opacity-0'; // Hidden during SSR or before client ready
    if (!shouldAnimateHeroIntro) return 'opacity-80'; // Not animating, normal visibility
    if (isHeroSettled) return 'opacity-80'; // Animation done, normal visibility

    if (isSubtitleEmphasizing || isSubtitleTypingEmphasized) return 'opacity-100'; // Emphasized and typing, full opacity
    if (isSubtitleReturning) return 'opacity-0'; // Fading out during return (will transition from 100 to 0)
    
    // Default to hidden if in an intermediate animation phase before emphasis or after return but before settled
    return 'opacity-0';
  };

  const subtitleContent = () => {
    if (shouldAnimateHeroIntro && isClientReady) {
      if (isSubtitleEmphasizing && !isSubtitleTypingEmphasized) {
        return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />; // Placeholder during emphasis before typing
      }
      if (isSubtitleTypingEmphasized) { // isSubtitleTypingEmphasized will be set to false onComplete by handleSubtitleEmphasisTypingComplete
        return (
          <TypingAnimation
            key={`${heroSubtitle}-${language}-emphasized`}
            text={heroSubtitle || ""}
            speed={50}
            startDelay={0}
            onComplete={handleSubtitleEmphasisTypingComplete}
            punctuationChars={['.', ',', '!', '?', ';', ':', '\n']}
            punctuationPauseFactor={7}
          />
        );
      }
    }
    return heroSubtitle; // Default to static text
  };


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


  if (!isClientReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center pt-10 pb-16 md:pb-20">
        <div className="flex flex-col items-center max-w-4xl w-full">
          <h1 className={cn(
            "font-headline text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8rem] font-bold mb-8 text-foreground dark:text-foreground text-center",
            { 'animate-slide-down-fade-out': isTitleSlidingDown && shouldAnimateHeroIntro },
            { 'opacity-0': ((isSubtitleEmphasizing || isSubtitleTypingEmphasized || isSubtitleTypingEmphasizedComplete) && !isTitleSlidingUp && !isHeroSettled) && shouldAnimateHeroIntro },
            { 'animate-slide-up-fade-in': isTitleSlidingUp && shouldAnimateHeroIntro }
          )}
          style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          >
            {heroTitleContent}
          </h1>

          <p className={cn(
              "max-w-full md:max-w-3xl mb-10 min-h-[6em] whitespace-pre-line text-center text-foreground/80 subtitle-emphasis-transition",
              // Size, position, weight based on states
              (isSubtitleEmphasizing || isSubtitleTypingEmphasized || (isSubtitleTypingEmphasizedComplete && !isSubtitleReturning && !isHeroSettled)) && shouldAnimateHeroIntro
                ? "text-3xl md:text-4xl font-bold -translate-y-44" // Emphasized state
                : "text-xl md:text-2xl font-normal translate-y-0", // Normal state (target for returning and settled)
              getSubtitleOpacityClass() // Opacity controlled by helper function
            )}
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          >
            {subtitleContent()}
          </p>

          {(isHeroSettled || !shouldAnimateHeroIntro) && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fadeIn">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6">
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
                className="border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:border-foreground dark:text-foreground dark:hover:bg-[hsl(270,95%,80%)] dark:hover:text-[hsl(225,30%,10%)] dark:hover:border-[hsl(270,95%,80%)] text-lg px-10 py-6"
              >
                <Link href="/#about">
                  <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                    {aboutMeButtonText}
                  </span>
                  <ArrowDown size={24} className="ml-3" />
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

