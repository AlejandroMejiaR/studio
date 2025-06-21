
"use client";

import { useEffect, useState, useRef, Fragment, useCallback } from 'react';
import type { Project } from '@/types';
import { getAllProjectsFromFirestore } from '@/lib/firebase';
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import TypingAnimation from '@/components/effects/TypingAnimation';
import WordRevealAnimation from '@/components/effects/WordRevealAnimation';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useFooter } from '@/contexts/FooterContext';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { cn } from '@/lib/utils';


// Animation durations (ms) moved outside the component to be true constants
const titleSlideDownAnimationDuration = 500;
const subtitleEmphasisAnimationDuration = 300;


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

  // Default to false. The effect will decide if it should be true.
  const [shouldAnimateHeroIntro, setShouldAnimateHeroIntro] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!isClientReady) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;

      const navigationEntries = performance.getEntriesByType("navigation");
      const navigationType = navigationEntries.length > 0 ? (navigationEntries[0] as PerformanceNavigationTiming).type : '';
      const hasAnimatedInSession = sessionStorage.getItem(`hasAnimatedInSession_${language}`);

      if (navigationType === 'reload' || !hasAnimatedInSession) {
        setShouldAnimateHeroIntro(true);
        sessionStorage.setItem(`hasAnimatedInSession_${language}`, 'true');
      } else {
        setShouldAnimateHeroIntro(false);
      }
    } else {
      setShouldAnimateHeroIntro(true);
    }
  }, [isClientReady, language]);


  // Animation sequence state flags
  const [isTitleRevealComplete, setIsTitleRevealComplete] = useState(false);
  const [isTitleSlidingDown, setIsTitleSlidingDown] = useState(false);
  const [isTitleHiddenAfterAnimation, setIsTitleHiddenAfterAnimation] = useState(false);
  const [isSubtitleEmphasizing, setIsSubtitleEmphasizing] = useState(false);
  const [isSubtitleTypingEmphasized, setIsSubtitleTypingEmphasized] = useState(false);
  const [isSubtitleTypingEmphasizedComplete, setIsSubtitleTypingEmphasizedComplete] = useState(false);
  const [isHeroSettled, setIsHeroSettled] = useState(false);
  const [isFinalContentVisible, setIsFinalContentVisible] = useState(false);


  const animationTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAnimationTimeouts = () => {
    animationTimersRef.current.forEach(clearTimeout);
    animationTimersRef.current = [];
  };

  
  // Master orchestrator for hero animations
  useEffect(() => {
    clearAnimationTimeouts();
    const animatingTitle = translationsForLanguage.home.hero.animatingTitle;

    if (shouldAnimateHeroIntro && isClientReady) {
      setIsTitleRevealComplete(false);
      setIsTitleSlidingDown(false);
      setIsTitleHiddenAfterAnimation(false);
      setIsSubtitleEmphasizing(false);
      setIsSubtitleTypingEmphasized(false);
      setIsSubtitleTypingEmphasizedComplete(false);
      setIsHeroSettled(false);
      setIsFinalContentVisible(false);

      let calculatedMaxTitleAnimationOverallEndTime = 0;
      let cumulativeDelay = 0;
      animatingTitle.forEach((lineText) => {
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
      
      const textSwitchTime = titleWordRevealDuration + titleSlideDownAnimationDuration + 50;
      const timer2 = setTimeout(() => {
        setIsSubtitleEmphasizing(true);
      }, textSwitchTime);
      animationTimersRef.current.push(timer2);

      const timer3 = setTimeout(() => {
        setIsSubtitleTypingEmphasized(true);
      }, textSwitchTime + subtitleEmphasisAnimationDuration);
      animationTimersRef.current.push(timer3);

    } else if (!shouldAnimateHeroIntro && isClientReady) {
      // Animations are skipped
      setIsTitleRevealComplete(true);
      setIsTitleSlidingDown(false);
      setIsSubtitleEmphasizing(false);
      setIsSubtitleTypingEmphasized(false);
      setIsSubtitleTypingEmphasizedComplete(true);
      setIsHeroSettled(true);

      const fadeInTimer = setTimeout(() => {
        setIsFinalContentVisible(true);
      }, 500);
      animationTimersRef.current.push(fadeInTimer);
    }

    return clearAnimationTimeouts;
  }, [shouldAnimateHeroIntro, isClientReady, translationsForLanguage]);


  const handleSubtitleEmphasisTypingComplete = useCallback(() => {
    if (!isClientReady) return;

    setIsSubtitleTypingEmphasized(false);
    setIsSubtitleTypingEmphasizedComplete(true); // Keep the large subtitle visible for the pause

    const pauseTimer = setTimeout(() => {
        // After pause, hide the large subtitle and switch layout
        setIsSubtitleEmphasizing(false);
        setIsSubtitleTypingEmphasizedComplete(false);
        setIsHeroSettled(true);

        // After a brief moment for the DOM to update, fade in the final content
        const finalFadeInTimer = setTimeout(() => {
            setIsFinalContentVisible(true);
        }, 100);
        animationTimersRef.current.push(finalFadeInTimer);

    }, 1000); // 1-second pause

    animationTimersRef.current.push(pauseTimer);
}, [isClientReady]);


  const handleTitleAnimationEnd = (e: React.AnimationEvent<HTMLHeadingElement>) => {
      // The keyframe name is defined in globals.css
      if (e.animationName === 'slideDownFadeOut') {
          setIsTitleHiddenAfterAnimation(true);
      }
  };


  useEffect(() => {
    if (!isClientReady) return;

    if (navbarAnimationTimeoutRef.current) {
        clearTimeout(navbarAnimationTimeoutRef.current);
        navbarAnimationTimeoutRef.current = null;
    }

    const setNavbarVisibility = (isVisible: boolean) => {
        setShouldNavbarContentBeVisible(isVisible);
    };

    if (pathname === '/') {
        const heroAnimationsDoneOrSkipped = isHeroSettled || !shouldAnimateHeroIntro;

        if (shouldAnimateHeroIntro && !isHeroSettled) {
            setNavbarVisibility(false);
        } else if (heroAnimationsDoneOrSkipped) {
            setNavbarVisibility(false); 
            navbarAnimationTimeoutRef.current = setTimeout(() => {
                setNavbarVisibility(true);
            }, 1000);
        } else {
            setNavbarVisibility(false);
        }
    } else {
        setNavbarVisibility(true);
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
      setShouldNavbarContentBeVisible
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
      if (!isLoadingProjects && (isHeroSettled || !shouldAnimateHeroIntro)) {
        scrollTimer = setTimeout(attemptScroll, 300);
      }
    } else {
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
    pathname, 
    isLoadingProjects, 
    isHeroSettled, 
    shouldAnimateHeroIntro, 
    language
  ]);


  const animatingTitleLines = translationsForLanguage.home.hero.animatingTitle;
  const heroSubtitle = translationsForLanguage.home.hero.subtitle;
  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getEnglishTranslation(t => t.home.buttons.viewWork) as string || "View Work";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getEnglishTranslation(t => t.home.buttons.aboutMe) as string || "About Me";
  const projectsSectionTitleText = isClientReady ? translationsForLanguage.home.projectsSectionTitle : getEnglishTranslation(t => t.home.projectsSectionTitle) as string || "My Projects";

  const lineAnimationProps: { lineBaseDelay: number; text: string }[] = [];
  if (shouldAnimateHeroIntro && !isTitleRevealComplete) {
    let currentCumulativeLineBaseDelay = 0;
    const letterStaggerConst = 0.04;
    const letterAnimationDurationConst = 0.5;
    const delayBetweenWordsConst = 0.15;

    animatingTitleLines.forEach((lineText) => {
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
  
  const AnimatedSubtitle = ({ text }: { text: string }) => {
    const parts = text.split(/(UX|AI|IA|Game Design)/g);
  
    return (
      <>
        {parts.map((part, index) => {
          if (part === 'UX' || part === 'AI' || part === 'IA' || part === 'Game Design') {
            return (
              <span key={index} className="animate-text-pulse font-bold text-accent">
                {part}
              </span>
            );
          }
          return <Fragment key={index}>{part}</Fragment>;
        })}
      </>
    );
  };

  // Derived state for animation phase clarity
  const isSubtitlePhase = (isSubtitleEmphasizing || isSubtitleTypingEmphasized || isSubtitleTypingEmphasizedComplete) && !isHeroSettled;
  const isFinalLayout = isHeroSettled || !shouldAnimateHeroIntro;

  const subtitleContent = () => {
    if (!isClientReady) return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
  
    if (isSubtitleTypingEmphasized) {
      return (
        <TypingAnimation
          key={`${heroSubtitle}-${language}-emphasized`}
          text={heroSubtitle || ""}
          speed={50}
          startDelay={0}
          onComplete={handleSubtitleEmphasisTypingComplete}
          punctuationChars={['.', ',', '!', '?', ';', ':', '\n']}
          highlightedWords={[
            { word: 'UX', className: 'font-bold text-accent' },
            { word: 'IA', className: 'font-bold text-accent' },
            { word: 'AI', className: 'font-bold text-accent' },
            { word: 'Game Design', className: 'font-bold text-accent' },
          ]}
        />
      );
    }
  
    if (isSubtitleTypingEmphasizedComplete) {
      const parts = heroSubtitle.split(/(UX|AI|IA|Game Design)/g).filter(Boolean);
      return (
        <>
          {parts.map((part, index) => {
            const isHighlight = ['UX', 'AI', 'IA', 'Game Design'].includes(part);
            if (isHighlight) {
              return <span key={index} className="font-bold text-accent">{part}</span>;
            }
            return <Fragment key={index}>{part}</Fragment>;
          })}
        </>
      );
    }
  
    // For final state or skipped animation, render the styled subtitle
    if (isFinalLayout) {
      return <AnimatedSubtitle text={heroSubtitle} />;
    }
  
    return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
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
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center pt-10 pb-16 md:pb-20 transition-opacity duration-300">
        <div className={cn(
          "w-full max-w-5xl flex",
          isFinalLayout
              ? "flex-col lg:flex-row items-stretch gap-8 lg:gap-12"
              : "flex-col items-center"
        )}>
          {/* --- LEFT COLUMN (Title or Image) --- */}
          <div className={cn(
              "transition-all duration-300 flex justify-center",
              isFinalLayout 
                ? "lg:w-1/2"
                : "w-full"
          )}>
            {isFinalLayout ? (
               <div className={cn(
                  "relative w-64 h-80 md:w-80 md:h-96 lg:w-full lg:h-full mx-auto lg:mx-0",
                  isFinalContentVisible ? 'animate-fadeIn' : 'opacity-0'
               )}>
                  <Image
                    src="https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents//WhatsApp%20Image%202025-01-24%20at%207.15.31%20PM.jpeg"
                    alt="A photo of Alejandro Mejia Rojas"
                    fill
                    className="rounded-2xl object-cover shadow-2xl"
                    sizes="(max-width: 768px) 16rem, (max-width: 1024px) 20rem, 50vw"
                    priority
                  />
               </div>
            ) : (
              <h1 className={cn(
                  "font-headline font-bold mb-8 text-foreground dark:text-foreground",
                  "text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-center",
                  {
                    'animate-slide-down-fade-out': isTitleSlidingDown && shouldAnimateHeroIntro,
                    'invisible': isTitleHiddenAfterAnimation,
                  }
              )}
              onAnimationEnd={handleTitleAnimationEnd}
              style={{ visibility: isClientReady ? 'visible' : 'hidden' }} 
              >
                {
                  animatingTitleLines.map((lineText, lineIndex) => {
                      const currentLineAnimProps = lineAnimationProps[lineIndex];
                      if (!currentLineAnimProps) return null; 
                      return (
                        <WordRevealAnimation
                          key={`${language}-animating-line-${lineIndex}-${lineText}`} 
                          text={lineText || ""}
                          lineBaseDelay={currentLineAnimProps.lineBaseDelay}
                          delayBetweenWords={0.15} 
                          letterStaggerDelay={0.04}
                          letterAnimationDuration={0.5}
                          style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                          className="block" 
                        />
                      );
                    })
                }
              </h1>
            )}
          </div>

          {/* --- RIGHT COLUMN (Subtitle & Buttons) --- */}
          <div className={cn(
              "transition-all duration-300 flex flex-col justify-center",
              isFinalLayout 
                  ? "lg:w-1/2 items-center lg:items-start"
                  : "w-full items-center"
          )}>
            <p className={cn(
                "mb-10 whitespace-pre-line text-foreground/80 subtitle-emphasis-transition", 
                isFinalLayout
                  ? "text-center lg:text-left text-2xl md:text-3xl"
                  : "text-center",
                isSubtitlePhase && shouldAnimateHeroIntro
                  ? "text-3xl md:text-4xl font-bold max-w-full lg:max-w-2xl"
                  : "font-normal translate-y-0 max-w-full md:max-w-3xl",
                
                // Visibility Logic
                isSubtitlePhase && shouldAnimateHeroIntro ? 'opacity-100' : 'opacity-0',
                isFinalContentVisible && 'animate-fadeIn opacity-80'
              )}
              style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
            >
              {subtitleContent()}
            </p>

            {isFinalLayout && (
              <div className={cn(
                  "flex flex-col sm:flex-row gap-6",
                  "justify-center lg:justify-start",
                   isFinalContentVisible ? 'animate-fadeIn' : 'opacity-0'
              )}>
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

    

    

    

    

    