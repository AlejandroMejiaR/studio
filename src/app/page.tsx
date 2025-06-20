
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
      // Language changed, force animation and reset session flag
      sessionStorage.setItem('portfolioAceHeroAnimatedThisSession', 'false');
      setShouldAnimateHeroIntro(true);
    } else if (!hasAnimatedThisSession) {
      // Language is the same, but hasn't animated this session yet
      setShouldAnimateHeroIntro(true);
    } else {
      // Language is the same, and has already animated this session
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
    if (!isClientReady) return; // Ensure client is ready before proceeding
    if (!shouldAnimateHeroIntro && !isHeroSettled) return; // Guard against premature calls if animations were skipped

    setIsSubtitleTypingEmphasized(false); // Ensure TypingAnimation stops rendering
    setIsSubtitleTypingEmphasizedComplete(true);
    setIsSubtitleReturning(true); // This triggers resize + fade-out to opacity-0
    setIsTitleSlidingUp(true);
    setIsTitleSlidingDown(false);

    const settleDelay = Math.max(titleSlideUpAnimationDuration, subtitleReturnAnimationDuration);
    const timer = setTimeout(() => {
      setIsHeroSettled(true); 
      // Set shouldAnimateHeroIntro to false only AFTER hero is settled and session flag can be set
      setShouldAnimateHeroIntro(false); 
      if (isClientReady) { // Double check client readiness before sessionStorage access
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
            // Start with navbar hidden, then fade it in after a delay
            setShouldNavbarContentBeVisible(false); 
            navbarAnimationTimeoutRef.current = setTimeout(() => {
                setShouldNavbarContentBeVisible(true);
            }, 1000); // Delay before Navbar content fades in
        } else {
             // Default to hidden if conditions not met (e.g. initial load before decisions)
            setShouldNavbarContentBeVisible(false);
        }
    } else {
        // For all other pages, navbar content should be visible immediately
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
      language // Re-evaluate if language changes, as it might reset shouldAnimateHeroIntro
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
        threshold: 0.1, // Footer becomes visible when 10% of AboutMe is in view
      }
    );

    observer.observe(aboutSection);
    // Check initial visibility without waiting for scroll
    const rect = aboutSection.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    setIsFooterVisible(isInitiallyVisible);


    return () => {
      observer.disconnect();
    };
  }, [isClientReady, setIsFooterVisible, aboutMeRef, pathname]); // Added aboutMeRef and pathname


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
      // If scrolling to projects, wait for projects to load AND hero animations to settle (if they ran)
      if (!isLoadingProjects && (isHeroSettled || !shouldAnimateHeroIntro)) {
        scrollTimer = setTimeout(attemptScroll, 300); // Delay for layout to stabilize
      }
    } else {
      // For other sections (like 'about'), wait for hero animations to settle (if they ran)
      if (isHeroSettled || !shouldAnimateHeroIntro) {
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
    pathname, // React to pathname changes
    isLoadingProjects, 
    isHeroSettled, 
    shouldAnimateHeroIntro, 
    language // Also re-evaluate on language change for robustness
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
              // Special case for "Ideas Into" or "Ideas En" to have zero delay
              if ((words[i] === "Ideas" && words[i+1] === "Into") || (words[i] === "Ideas" && words[i+1] === "En")) {
                  actualInterWordDelay = 0; 
              }
              internalDurationOfThisLine += actualInterWordDelay;
            }
          }
        }
        // Adjust cumulative delay based on line content and animation
        if (words.length > 0) {
            currentCumulativeLineBaseDelay += internalDurationOfThisLine * 0.5 + 0.3; // Example staggering logic for lines
        } else {
            currentCumulativeLineBaseDelay += 0.3; // Shorter delay for empty lines if any
        }
    });
  }

  let heroTitleContent;
  if (shouldAnimateHeroIntro && !isTitleRevealComplete && !isTitleSlidingDown && !isTitleSlidingUp && !isHeroSettled) {
    // Only render WordRevealAnimation if it's the initial reveal part of the animation
    heroTitleContent = heroFullTitleLines.map((lineText, lineIndex) => {
      const currentLineAnimProps = lineAnimationProps[lineIndex];
      if (!currentLineAnimProps) return null; // Should not happen if logic is correct
      return (
        <WordRevealAnimation
          key={`${language}-line-${lineIndex}-${lineText}`} // Ensure key changes with language and text
          text={lineText || ""}
          lineBaseDelay={currentLineAnimProps.lineBaseDelay}
          delayBetweenWords={0.15} // Standard delay between words
          letterStaggerDelay={0.04}
          letterAnimationDuration={0.5}
          style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          className="block" // Ensure each line is a block for proper layout
        />
      );
    });
  } else {
    // Render static text for title if not in initial reveal or if animations are skipped/completed
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

    // During emphasis or typing emphasized, it should be fully visible
    if (isSubtitleEmphasizing || isSubtitleTypingEmphasized) return 'opacity-100';
    
    // When returning, it fades out (targets opacity-0)
    if (isSubtitleReturning) return 'opacity-0'; 
    
    // Default to hidden if in an intermediate animation phase before emphasis or after return but before settled
    return 'opacity-0';
  };

  const subtitleContent = () => {
    if (shouldAnimateHeroIntro && isClientReady) {
      // Placeholder during emphasis before typing to prevent text flash
      if (isSubtitleEmphasizing && !isSubtitleTypingEmphasized) {
        return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
      }
      // Typing animation for emphasized subtitle
      if (isSubtitleTypingEmphasized) { // isSubtitleTypingEmphasized will be set to false onComplete by handleSubtitleEmphasisTypingComplete
        return (
          <TypingAnimation
            key={`${heroSubtitle}-${language}-emphasized`} // Key changes with text and language
            text={heroSubtitle || ""}
            speed={50} // Slower speed
            startDelay={0} // Start immediately when this state is true
            onComplete={handleSubtitleEmphasisTypingComplete}
            punctuationChars={['.', ',', '!', '?', ';', ':', '\n']} // Default punctuation
            punctuationPauseFactor={7} // Default pause factor
          />
        );
      }
    }
    // Default to static text if not animating or if typing is complete
    return heroSubtitle;
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
        // Optionally set projects to an empty array or handle error state
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [isClientReady]); // Depend on isClientReady to fetch only on client


  if (!isClientReady) {
    // Render a minimal loading state or nothing until the client is ready
    // This helps prevent hydration mismatches and ensures animations behave as expected.
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {/* Optionally, a very simple global loading spinner could go here if desired,
            but LoadingSpinnerOverlay is handled in RootLayout based on LoadingContext */}
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center pt-10 pb-16 md:pb-20">
        <div className="flex flex-col items-center max-w-4xl w-full">
          {/* Hero Title */}
          <h1 className={cn(
            "font-headline text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8rem] font-bold mb-8 text-foreground dark:text-foreground text-center",
            // Conditional animation classes
            { 'animate-slide-down-fade-out': isTitleSlidingDown && shouldAnimateHeroIntro },
            // Keep title hidden if subtitle is emphasized and title is not yet sliding up (unless hero is settled)
            { 'opacity-0': ((isSubtitleEmphasizing || isSubtitleTypingEmphasized || isSubtitleTypingEmphasizedComplete) && !isTitleSlidingUp && !isHeroSettled) && shouldAnimateHeroIntro },
            { 'animate-slide-up-fade-in': isTitleSlidingUp && shouldAnimateHeroIntro }
          )}
          style={{ visibility: isClientReady ? 'visible' : 'hidden' }} // Base visibility
          >
            {heroTitleContent}
          </h1>

          {/* Hero Subtitle */}
          <p className={cn(
              "max-w-full md:max-w-3xl mb-10 whitespace-pre-line text-center text-foreground/80 subtitle-emphasis-transition", // Removed min-h-[6em]
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

          {/* Hero Buttons - Appear when hero is settled or if intro animation is skipped */}
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

      {/* Projects Section - Conditional rendering based on loading state */}
      {isLoadingProjects ? (
         <section id="projects-loading" className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16 lg:py-20">
           <h2 
            className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 dark:text-foreground"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
           >
             {projectsSectionTitleText}
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map((i) => ( // Placeholder for 3 cards
               <div key={i} className="flex flex-col space-y-3">
                 <Skeleton className="h-[200px] w-full rounded-xl" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                 </div>
                 <div className="flex justify-between items-center pt-2">
                   <Skeleton className="h-8 w-20" /> {/* For LikeButton */}
                   <Skeleton className="h-8 w-24" /> {/* For View More Button */}
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

