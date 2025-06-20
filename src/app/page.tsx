
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
  const subtitleReturnAnimationDuration = 300; // Same as emphasis

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

    // If language changes, we always want to re-animate for the new language.
    // We set the session flag to 'false' to allow the animation for the new language.
    if (previousLanguageRef.current !== undefined && previousLanguageRef.current !== language) {
      sessionStorage.setItem('portfolioAceHeroAnimatedThisSession', 'false');
      setShouldAnimateHeroIntro(true);
    } else if (!hasAnimatedThisSession) {
      // If language hasn't changed, and it hasn't animated this session yet.
      setShouldAnimateHeroIntro(true);
    } else {
      // Language hasn't changed, AND it has already animated this session.
      setShouldAnimateHeroIntro(false);
    }

    // Update previous language for the next render cycle.
    if (previousLanguageRef.current !== language) {
      previousLanguageRef.current = language;
    }
  }, [isClientReady, language]);


  // Master orchestrator for hero animations
  useEffect(() => {
    clearAnimationTimeouts();

    if (shouldAnimateHeroIntro && isClientReady) {
      // Reset all animation phase states
      setIsTitleRevealComplete(false);
      setIsTitleSlidingDown(false);
      setIsSubtitleEmphasizing(false);
      setIsSubtitleTypingEmphasized(false);
      setIsSubtitleTypingEmphasizedComplete(false);
      setIsSubtitleReturning(false);
      setIsTitleSlidingUp(false);
      setIsHeroSettled(false);

      // Calculate WordRevealAnimation total time
      const heroFullTitleLinesForCalc = translationsForLanguage.home.hero.fullTitle;
      let calculatedMaxTitleAnimationOverallEndTime = 0;
      let cumulativeDelay = 0;
      heroFullTitleLinesForCalc.forEach((lineText) => {
        const words = lineText.split(' ').filter(w => w.length > 0);
        let lineDuration = 0;
        if (words.length > 0) {
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            lineDuration += (word.length > 0 ? (word.length - 1) * 0.04 : 0) + 0.5; // letterStagger + letterDuration
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
      const titleWordRevealDuration = (calculatedMaxTitleAnimationOverallEndTime + 0.1) * 1000; // Added small buffer

      // 1. After title WordRevealAnimation completes
      const timer1 = setTimeout(() => {
        setIsTitleRevealComplete(true);
        setIsTitleSlidingDown(true);
      }, titleWordRevealDuration);
      animationTimersRef.current.push(timer1);

      // 2. After title slides down
      const timer2 = setTimeout(() => {
        setIsSubtitleEmphasizing(true);
      }, titleWordRevealDuration + titleSlideDownAnimationDuration);
      animationTimersRef.current.push(timer2);

      // 3. After subtitle emphasizes (transition), start typing
      const timer3 = setTimeout(() => {
        setIsSubtitleTypingEmphasized(true);
      }, titleWordRevealDuration + titleSlideDownAnimationDuration + subtitleEmphasisAnimationDuration);
      animationTimersRef.current.push(timer3);

    } else if (!shouldAnimateHeroIntro && isClientReady) {
      // If animations are explicitly skipped or already finished, set to settled state
      setIsTitleRevealComplete(true);
      setIsTitleSlidingDown(false);
      setIsSubtitleEmphasizing(false);
      setIsSubtitleTypingEmphasized(false);
      setIsSubtitleTypingEmphasizedComplete(true); // Assume typing is done if skipped
      setIsSubtitleReturning(false);
      setIsTitleSlidingUp(false);
      setIsHeroSettled(true);
    }

    return clearAnimationTimeouts;
  }, [shouldAnimateHeroIntro, isClientReady, language, translationsForLanguage.home.hero.fullTitle]);


  const handleSubtitleEmphasisTypingComplete = () => {
    if (!shouldAnimateHeroIntro && !isHeroSettled) return; // Prevent updates if animation was reset/skipped or already settled by skip logic

    setIsSubtitleTypingEmphasizedComplete(true);
    setIsSubtitleReturning(true);
    setIsTitleSlidingUp(true);
    setIsTitleSlidingDown(false); // Ensure it's visually "gone" before sliding up

    const settleDelay = Math.max(titleSlideUpAnimationDuration, subtitleReturnAnimationDuration);
    const timer = setTimeout(() => {
      setIsHeroSettled(true);
      setShouldAnimateHeroIntro(false); // Animation sequence complete
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
            // Navbar content should become visible after a delay if hero is settled or animation is skipped
            setShouldNavbarContentBeVisible(false); // Initially hide
            navbarAnimationTimeoutRef.current = setTimeout(() => {
                setShouldNavbarContentBeVisible(true);
            }, 1000); // Delay for navbar content to appear
        } else {
             // Default to hidden if conditions not met (e.g., initial state before decisions)
            setShouldNavbarContentBeVisible(false);
        }
    } else {
        // For all other pages, navbar content is immediately visible
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
      language // Re-evaluate if language changes, as this might reset shouldAnimateHeroIntro
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
      // For other sections (like #about), scroll after hero animations are done or skipped
      if (shouldAnimateHeroIntro && !isHeroSettled) {
        // Wait if animations are running for #about or other non-project sections
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
    pathname, // Added pathname to re-evaluate if on a different page but hash remains
    isLoadingProjects,
    isHeroSettled,
    shouldAnimateHeroIntro,
    language // Re-evaluate on language change as content might shift
  ]);


  const heroFullTitleLines = isClientReady ? translationsForLanguage.home.hero.fullTitle : (getEnglishTranslation(t => t.home.hero.fullTitle) as string[] || ["Loading Title..."]);
  const heroSubtitle = isClientReady ? translationsForLanguage.home.hero.subtitle : getEnglishTranslation(t => t.home.hero.subtitle) as string || "Loading subtitle...";
  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getEnglishTranslation(t => t.home.buttons.viewWork) as string || "View Work";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getEnglishTranslation(t => t.home.buttons.aboutMe) as string || "About Me";
  const projectsSectionTitleText = isClientReady ? translationsForLanguage.home.projectsSectionTitle : getEnglishTranslation(t => t.home.projectsSectionTitle) as string || "My Projects";

  // WordRevealAnimation props
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
    // Minimal content for server render or before client hydration, helps prevent layout shifts
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {/* You can put a very simple static loader here if needed, but often just empty is fine */}
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
              // Styles for emphasized state (moved up, larger, bolder, fully opaque)
              (isSubtitleEmphasizing || isSubtitleTypingEmphasized || (isSubtitleTypingEmphasizedComplete && !isSubtitleReturning)) && shouldAnimateHeroIntro
                ? "text-3xl md:text-4xl font-bold opacity-100 -translate-y-44"
                // Styles for normal state (original position, smaller, normal weight, slightly transparent)
                : "text-xl md:text-2xl font-normal opacity-80 translate-y-0",
              {
                // Explicitly ensure it returns to translate-y-0 when returning
                'translate-y-0': isSubtitleReturning && shouldAnimateHeroIntro,
                // Hide subtitle unless it's in an active visible phase of its animation, or hero is settled
                'opacity-0': shouldAnimateHeroIntro &&
                             !isHeroSettled && // If hero is settled, always show (unless its the placeholder below)
                             !isSubtitleEmphasizing &&
                             !isSubtitleTypingEmphasized &&
                             !(isSubtitleTypingEmphasizedComplete && !isSubtitleReturning) && // When complete but not yet returning
                             !isSubtitleReturning,
              }
            )}
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          >
            { (shouldAnimateHeroIntro && isSubtitleEmphasizing && !isSubtitleTypingEmphasized) ?
                <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} /> // Placeholder during emphasis transition before typing
              : (shouldAnimateHeroIntro && isSubtitleTypingEmphasized) ?
                  <TypingAnimation
                    key={`${heroSubtitle}-${language}-emphasized`}
                    text={heroSubtitle || ""}
                    speed={50}
                    startDelay={0}
                    onComplete={handleSubtitleEmphasisTypingComplete}
                    punctuationChars={['.', ',', '!', '?', ';', ':', '\n']}
                    punctuationPauseFactor={7}
                  />
                : heroSubtitle // Static text for all other cases (settled, no animation, returning phase etc.)
            }
          </p>

          {(isHeroSettled || !shouldAnimateHeroIntro) && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fadeIn mt-8">
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

