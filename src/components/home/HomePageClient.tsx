
"use client";

import { useEffect, useState, useRef, Fragment, useCallback } from 'react';
import type { Project } from '@/types';
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import TypingAnimation from '@/components/effects/TypingAnimation';
import WordRevealAnimation from '@/components/effects/WordRevealAnimation';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { cn } from '@/lib/utils';
import { getSupabaseImageUrl } from '@/lib/supabase';
import { useFooter } from '@/contexts/FooterContext';


// Animation durations (ms) moved outside the component to be true constants
const subtitleEmphasisAnimationDuration = 300;

interface HomePageClientProps {
  projects: Project[];
  initialLikesMap: Record<string, number>;
}

export default function HomePageClient({ projects, initialLikesMap }: HomePageClientProps) {
  const {
    language,
    translationsForLanguage,
    isClientReady,
    getEnglishTranslation
  } = useLanguage();
  const { setShouldNavbarContentBeVisible, setShowLanguageHint } = useNavbarVisibility();
  const heroSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const { setIsFooterVisible } = useFooter();
  const pathname = usePathname();
  const navbarAnimationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [shouldAnimateHeroIntro, setShouldAnimateHeroIntro] = useState<boolean | null>(null);
  const prevLanguageRef = useRef<Language | null>(null);

  useEffect(() => {
    if (!isClientReady) return;
  
    const previousLanguage = prevLanguageRef.current;
    const languageHasChanged = previousLanguage !== null && previousLanguage !== language;
  
    // Always animate on language change.
    if (languageHasChanged) {
      setShouldAnimateHeroIntro(true);
    } else {
      // Use a session flag specific to the current language to track if the animation has played.
      const initialLoadAnimatedKey = `portfolio_ace_initial_load_animated_${language}`;
      const hasAnimatedOnInitialLoad = sessionStorage.getItem(initialLoadAnimatedKey);
  
      if (!hasAnimatedOnInitialLoad) {
        // If it's the first visit for this language in this session, animate.
        setShouldAnimateHeroIntro(true);
      } else {
        // Otherwise, don't animate (e.g., navigating back from a project).
        setShouldAnimateHeroIntro(false);
      }
    }
  
    // Update the language ref for the next render's comparison.
    prevLanguageRef.current = language;
  
  }, [isClientReady, language]);


  // Animation sequence state flags
  const [isTitleRevealComplete, setIsTitleRevealComplete] = useState(false);
  const [isTitleSlidingDown, setIsTitleSlidingDown] = useState(false);
  const [isTitleHidden, setIsTitleHidden] = useState(false);
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
    // Don't run until the decision to animate has been made.
    if (shouldAnimateHeroIntro === null || !isClientReady) {
      return;
    }
  
    clearAnimationTimeouts();
    const animatingTitle = translationsForLanguage.home.hero.animatingTitle;
  
    if (shouldAnimateHeroIntro) {
      // Scroll to top to ensure animation is visible
      window.scrollTo(0, 0);
      
      // Set the session flag as soon as we decide to animate for this language.
      const initialLoadAnimatedKey = `portfolio_ace_initial_load_animated_${language}`;
      sessionStorage.setItem(initialLoadAnimatedKey, 'true');

      // Reset all animation states at the beginning
      setIsTitleRevealComplete(false);
      setIsTitleSlidingDown(false);
      setIsTitleHidden(false);
      setIsSubtitleEmphasizing(false);
      setIsSubtitleTypingEmphasized(false);
      setIsSubtitleTypingEmphasizedComplete(false);
      setIsHeroSettled(false);
      setIsFinalContentVisible(false);
  
      // Calculate the total duration of the title word reveal animation
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
      // The total duration needs to account for the final word's color transition (0.4s) + a safety buffer.
      const titleWordRevealDuration = (calculatedMaxTitleAnimationOverallEndTime + 0.5) * 1000;
  
      const masterTimeout = setTimeout(() => {
        setIsTitleSlidingDown(true);
  
        // Wait for the slide-down animation (500ms) to finish before proceeding
        const afterFadeOutTimer = setTimeout(() => {
          setIsTitleHidden(true); // Hide title when it's faded out
          setIsSubtitleEmphasizing(true);
          const typingTimer = setTimeout(() => {
            setIsSubtitleTypingEmphasized(true);
          }, subtitleEmphasisAnimationDuration);
          animationTimersRef.current.push(typingTimer);
        }, 500); 
        animationTimersRef.current.push(afterFadeOutTimer);
      }, titleWordRevealDuration); 
  
      animationTimersRef.current.push(masterTimeout);
  
    } else { // shouldAnimateHeroIntro is false
      // Animations are skipped, go directly to the final state
      setIsTitleRevealComplete(true);
      setIsTitleSlidingDown(false); // Don't run the slide-down animation
      setIsTitleHidden(true);
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
  }, [shouldAnimateHeroIntro, isClientReady, translationsForLanguage, language]);
  
  // Effect to lock scroll and manage focus during animation
  useEffect(() => {
    const isAnimating = shouldAnimateHeroIntro === true && !isHeroSettled;

    if (isAnimating) {
      document.body.classList.add('no-scroll');
      if (heroSectionRef.current) {
        heroSectionRef.current.focus({ preventScroll: true });
      }
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup function to ensure the class is removed if the component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [shouldAnimateHeroIntro, isHeroSettled]);


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


  useEffect(() => {
    if (!isClientReady) return;

    // This effect runs when the hero section is considered "settled",
    // either after the animation completes or when it's skipped.
    const heroIsReady = isHeroSettled || shouldAnimateHeroIntro === false;

    if (heroIsReady) {
        const hintShown = sessionStorage.getItem('portfolio-ace-language-hint-shown');
        if (!hintShown) {
            setShowLanguageHint(true);
            sessionStorage.setItem('portfolio-ace-language-hint-shown', 'true');
        }
    }
  }, [isHeroSettled, shouldAnimateHeroIntro, isClientReady, setShowLanguageHint]);


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
        // Null means the decision hasn't been made yet, keep navbar hidden.
        if (shouldAnimateHeroIntro === null) {
            setNavbarVisibility(false);
            return;
        }

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update footer visibility based on whether the about section is intersecting with the viewport
        if (pathname === '/') {
          setIsFooterVisible(entry.isIntersecting);
        }
      },
      {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1, // trigger when 10% of the element is visible
      }
    );

    const currentAboutSection = aboutSectionRef.current;
    if (currentAboutSection) {
      observer.observe(currentAboutSection);
    }

    return () => {
      if (currentAboutSection) {
        observer.unobserve(currentAboutSection);
      }
    };
  }, [pathname, setIsFooterVisible]);


  const animatingTitleLines = translationsForLanguage.home.hero.animatingTitle;
  const heroSubtitle = translationsForLanguage.home.hero.subtitle;
  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getEnglishTranslation(t => t.home.buttons.viewWork) as string || "View Work";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getEnglishTranslation(t => t.home.buttons.aboutMe) as string || "About Me";
  
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
  
  const linkablePhraseConfig = {
    EN: "Let's bring your idea to the digital world!",
    ES: "¡Llevemos tu idea al mundo digital!"
  };
  const colorAnimatedWordsConfig = {
    EN: ['UX', 'AI', 'Game Design'],
    ES: ['UX', 'IA', 'Game Design']
  };
  const boldWordsConfig = {
    EN: ["Hello!", 'designing', 'developing', 'digital experiences'],
    ES: ["¡Hola!", 'diseño', 'desarrollo', 'experiencias digitales']
  };

  const phrasesToColorAnimate = colorAnimatedWordsConfig[language];
  const phrasesToBold = boldWordsConfig[language];
  const phraseToLink = linkablePhraseConfig[language];
  
  const allStyledPhrases = [...phrasesToColorAnimate, ...phrasesToBold, phraseToLink];
  const stylingRegex = new RegExp(`(${allStyledPhrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');


  const AnimatedSubtitle = ({ text }: { text: string }) => {
    const parts = text.split(stylingRegex);
    return (
      <>
        {parts.map((part, index) => {
           if (part === phraseToLink) {
            return (
              <Link key={index} href="/#about" className="font-bold text-foreground/90 hover:text-accent transition-colors duration-200">
                {part}
              </Link>
            );
          }
          if (phrasesToColorAnimate.includes(part)) {
            return (
              <span key={index} className="animate-text-pulse font-bold text-accent">
                {part}
              </span>
            );
          }
          if (phrasesToBold.includes(part)) {
            return (
              <span key={index} className="font-bold text-foreground/90">
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
  const isFinalLayout = isHeroSettled || shouldAnimateHeroIntro === false;

  const subtitleContent = () => {
    if (!isClientReady) return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
  
    if (isSubtitleTypingEmphasized) {
       const highlightedWordsForTyping = [
        ...phrasesToColorAnimate.map(word => ({ word, className: 'font-bold text-accent' })),
        ...phrasesToBold.map(word => ({ word, className: 'font-bold text-foreground/90' })),
        { word: phraseToLink, className: 'font-bold text-foreground/90' }
      ];
      return (
        <TypingAnimation
          key={`${heroSubtitle}-${language}-emphasized`}
          text={heroSubtitle || ""}
          speed={50}
          startDelay={0}
          onComplete={handleSubtitleEmphasisTypingComplete}
          punctuationChars={['.', ',', '!', '?', ';', ':', '\n']}
          highlightedWords={highlightedWordsForTyping}
        />
      );
    }
  
    if (isSubtitleTypingEmphasizedComplete) {
      const parts = heroSubtitle.split(stylingRegex).filter(Boolean);
      return (
        <>
          {parts.map((part, index) => {
            if (part === phraseToLink) {
              return (
                <Link key={index} href="/#about" className="font-bold text-foreground/90 hover:text-accent transition-colors duration-200">
                  {part}
                </Link>
              );
            }
            if (phrasesToColorAnimate.includes(part)) {
              return <span key={index} className="font-bold text-accent">{part}</span>;
            }
            if (phrasesToBold.includes(part)) {
              return <span key={index} className="font-bold text-foreground/90">{part}</span>;
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


  if (!isClientReady || shouldAnimateHeroIntro === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <section 
        ref={heroSectionRef}
        tabIndex={-1}
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center pt-10 pb-40 transition-opacity duration-300 outline-none"
      >
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
                  "relative w-64 h-80 md:w-80 md:h-96 lg:w-full lg:h-full mx-auto lg:mx-0 hidden lg:block",
                  isFinalContentVisible ? 'animate-fadeIn' : 'opacity-0'
               )}>
                  <Image
                    src={getSupabaseImageUrl('documents', 'Hero.webp')}
                    alt="Hero Image"
                    fill
                    className="rounded-2xl object-cover shadow-2xl"
                    sizes="(max-width: 768px) 16rem, (max-width: 1024px) 20rem, 50vw"
                    priority
                  />
               </div>
            ) : (
              !isTitleHidden && (
                <h1 className={cn(
                    "font-headline font-bold mb-8 text-foreground dark:text-foreground",
                    "text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-center",
                    { 'animate-slide-down-fade-out': isTitleSlidingDown }
                )}
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
              )
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

      <section id="projects" className="pt-[50px]">
        <ProjectList projects={projects} initialLikesMap={initialLikesMap} />
      </section>
      <section id="about" ref={aboutSectionRef} className="pt-[100px] pb-[80px]">
        <AboutMe />
      </section>
    </div>
  );
}
