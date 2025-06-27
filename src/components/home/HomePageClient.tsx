
"use client";

import { useEffect, useState, useRef, Fragment, useMemo, useCallback } from 'react';
import type { Project } from '@/types';
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { cn } from '@/lib/utils';
import { useFooter } from '@/contexts/FooterContext';
import StaggeredTextAnimation from '@/components/effects/StaggeredTextAnimation';
import React from 'react';

interface HomePageClientProps {
  projects: Project[];
}

export default function HomePageClient({ projects }: HomePageClientProps) {
  const {
    language,
    translationsForLanguage,
    isClientReady,
    getInitialServerTranslation
  } = useLanguage();
  const { setShouldNavbarContentBeVisible, setShowLanguageHint } = useNavbarVisibility();
  const aboutSectionRef = useRef<HTMLElement>(null);
  const { setIsFooterVisible } = useFooter();
  const pathname = usePathname();

  const [shouldAnimateHeroIntro, setShouldAnimateHeroIntro] = useState<boolean | null>(null);

  const [isContentVisible, setIsContentVisible] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(false);

  useEffect(() => {
    if (!isClientReady) return;

    const scrollTimer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    }, 150);

    return () => clearTimeout(scrollTimer);
  }, [isClientReady, pathname]);

  useEffect(() => {
    if (!isClientReady) return;
  
    // The key in sessionStorage is now language-specific.
    const initialLoadAnimatedKey = `portfolio_ace_initial_load_animated_${language}`;
    const hasAnimatedForThisLanguage = sessionStorage.getItem(initialLoadAnimatedKey);
  
    if (!hasAnimatedForThisLanguage) {
      // If we haven't animated for the current language in this session, do it now.
      setShouldAnimateHeroIntro(true);
      // And mark it as done for this session.
      sessionStorage.setItem(initialLoadAnimatedKey, 'true');
      // Scroll to top to show the animation
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      // Otherwise, don't animate.
      setShouldAnimateHeroIntro(false);
    }
  
  }, [isClientReady, language]);

  useEffect(() => {
    if (shouldAnimateHeroIntro === null || !isClientReady) {
      return;
    }

    if (shouldAnimateHeroIntro) {
      setIsContentVisible(false);
      setAreControlsVisible(false); // Hide buttons/header for animation
      setShouldNavbarContentBeVisible(false);
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsContentVisible(true);
      setAreControlsVisible(true); // Show buttons/header immediately
      setShouldNavbarContentBeVisible(true);
    }
    
  }, [shouldAnimateHeroIntro, isClientReady, setShouldNavbarContentBeVisible, language]);
  
  useEffect(() => {
    if (!isClientReady || shouldAnimateHeroIntro === null) return;

    const hintShown = sessionStorage.getItem('portfolio-ace-language-hint-shown');
    if (!hintShown) {
        setShowLanguageHint(true);
        sessionStorage.setItem('portfolio-ace-language-hint-shown', 'true');
    }
  }, [isClientReady, shouldAnimateHeroIntro, setShowLanguageHint]);

  useEffect(() => {
    if (pathname !== '/') {
        return;
    }
    
    if (shouldAnimateHeroIntro === null) {
      return;
    }

    const observer = new IntersectionObserver(
        ([entry]) => {
            setIsFooterVisible(entry.isIntersecting);
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
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
  }, [pathname, setIsFooterVisible, shouldAnimateHeroIntro]);

  useEffect(() => {
    if (shouldAnimateHeroIntro) {
      if (!areControlsVisible) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    }
    // Cleanup function to ensure scroll is always re-enabled
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [areControlsVisible, shouldAnimateHeroIntro]);

  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getInitialServerTranslation(t => t.home.buttons.viewWork) as string || "Ver Mi Trabajo";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getInitialServerTranslation(t => t.home.buttons.aboutMe) as string || "Sobre Mí";
  
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.substring(2);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };
  
  const renderStyledText = (text: string | undefined, language: Language) => {
    if (!text) return null;

    const colorAnimatedWordsConfig = {
      EN: ['UX', 'AI', 'Game Design'],
      ES: ['UX', 'IA', 'Game Design']
    };
    const boldWordsConfig = {
      EN: ["Hello!", 'designing', 'developing', 'digital experiences'],
      ES: ["¡Hola!", "Soy Alejandro", 'diseño', 'desarrollo', 'experiencias digitales']
    };

    const allStyledPhrases = [...phrasesToColorAnimate, ...phrasesToBold];
    const stylingRegex = new RegExp(`(${allStyledPhrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    const parts = text.split(stylingRegex).filter(Boolean);

    return (
      <Fragment>
        {parts.map((part, index) => {
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
      </Fragment>
    );
  };
  
  const fullHeroText = useMemo(() => {
      if (!isClientReady) return getInitialServerTranslation(t => t.home.hero.subtitle);
      return translationsForLanguage.home.hero.subtitle;
  }, [isClientReady, translationsForLanguage, getInitialServerTranslation]);

  const handleAnimationComplete = useCallback(() => {
    setAreControlsVisible(true);
    setShouldNavbarContentBeVisible(true);
  }, [setShouldNavbarContentBeVisible]);
  
  const animationItems = useMemo(() => {
    const items: { content: React.ReactNode; delayAfter: number; className?: string }[] = [];
    if (!isClientReady || !fullHeroText) return items;

    const mainBlocks = fullHeroText.split('\n\n');
    
    if (mainBlocks.length >= 2) {
        const firstBlock = mainBlocks[0];
        const secondBlock = mainBlocks[1];
        const thirdBlockParts = mainBlocks[2] ? mainBlocks[2].split('\n') : [];
      
        items.push(
            { content: renderStyledText(firstBlock, language), delayAfter: 1700, className: "mb-16" },
            { content: renderStyledText(secondBlock, language), delayAfter: 2000, className: "mb-16" }
        );

        if (thirdBlockParts.length > 0) {
            items.push({ content: renderStyledText(thirdBlockParts[0], language), delayAfter: 1000 });
        }
        if (thirdBlockParts.length > 1) {
            items.push({ content: renderStyledText(thirdBlockParts[1], language), delayAfter: 1000 });
        }
        if (thirdBlockParts.length > 2) {
            items.push({ content: renderStyledText(thirdBlockParts[2], language), delayAfter: 0 });
        }
    }
    return items;
  }, [fullHeroText, language, isClientReady]);
  
  const StaticSubtitle = () => {
    if (!fullHeroText) return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
    
    const parts = fullHeroText.split('\n\n').map((block, index) => (
      <div key={index} className={index < 2 ? 'mb-16' : ''}>
        {block.split('\n').map((line, lineIndex) => (
          <div key={lineIndex}>{renderStyledText(line, language)}</div>
        ))}
      </div>
    ));

    return <>{parts}</>;
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
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center pt-10 pb-20"
      >
        <div className={cn(
          "w-full max-w-4xl transition-opacity duration-1000",
          isContentVisible ? 'opacity-100' : 'opacity-0'
        )}>
            <div className="mb-10 text-foreground/80 text-3xl md:text-5xl font-medium">
              {shouldAnimateHeroIntro && animationItems.length > 0 ? (
                  <StaggeredTextAnimation
                    key={language}
                    items={animationItems}
                    onComplete={handleAnimationComplete}
                  />
                ) : (
                  <StaticSubtitle />
                )
              }
            </div>

            <div className={cn(
              "flex flex-col sm:flex-row gap-6 justify-center",
              areControlsVisible ? "animate-controls-fade-in" : "opacity-0"
            )}>
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6">
                  <Link href="/#projects" onClick={handleSmoothScroll}>
                    <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                      {viewWorkButtonText}
                    </span>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:border-foreground dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground text-lg px-10 py-6"
                >
                  <Link href="/#about" onClick={handleSmoothScroll}>
                    <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                      {aboutMeButtonText}
                    </span>
                    <ArrowDown size={24} className="ml-3" />
                  </Link>
                </Button>
            </div>
        </div>
      </section>

      <section id="projects" className="pt-[50px]">
        <ProjectList projects={projects} />
      </section>
      <section id="about" ref={aboutSectionRef} className="pt-[100px] pb-[80px]">
        <AboutMe />
      </section>
    </div>
  );
}
