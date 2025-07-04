
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import type { Project } from '@/types';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { cn } from '@/lib/utils';
import StaggeredTextAnimation from '@/components/effects/StaggeredTextAnimation';
import React, { Fragment } from 'react';
import { ArrowDown } from 'lucide-react';

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
      EN: ['UX', 'Game', 'AI'],
      ES: ['UX', 'Videojuegos', 'IA']
    };

    const phrasesToColorAnimate = colorAnimatedWordsConfig[language] || [];
    const stylingRegex = new RegExp(`(${phrasesToColorAnimate.join('|')})`, 'g');
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
    if (!isClientReady || !fullHeroText) return [];

    const lines = fullHeroText.split('\n');
    const fontSizes = [
      'text-4xl md:text-6xl font-medium', // Line 1
      'text-3xl md:text-5xl font-medium', // Line 2
      'text-2xl md:text-4xl font-light',   // Line 3
      'text-2xl md:text-4xl font-light'    // Line 4
    ];

    // Combine last two lines to animate them together
    if (lines.length >= 4) {
      const combinedLastLines = (
        <>
          <div className={cn('mb-4', fontSizes[2])}>
            {renderStyledText(lines[2], language)}
          </div>
          <div className={cn(fontSizes[3])}>
            {renderStyledText(lines[3], language)}
          </div>
        </>
      );

      const items = [
        {
          content: renderStyledText(lines[0], language),
          delayAfter: 1200,
          className: cn('text-foreground', 'mb-4', fontSizes[0])
        },
        {
          content: renderStyledText(lines[1], language),
          delayAfter: 800,
          className: cn('text-foreground', 'mb-20', fontSizes[1])
        },
        {
          content: combinedLastLines,
          delayAfter: 0, // It's the last item, no delay after it.
          className: 'text-foreground' // Apply base color to the animated wrapper
        }
      ];
      return items;
    }
    
    // Fallback to original logic if text format is different for some reason
    return lines.map((line, index) => ({
      content: renderStyledText(line, language),
      delayAfter: index === 0 ? 1200 : 800, 
      className: cn(
        'text-foreground',
        index === 1 ? 'mb-20' : 'mb-4',
        fontSizes[index] || fontSizes[fontSizes.length - 1]
      )
    }));
  }, [fullHeroText, language, isClientReady]);
  
  const StaticSubtitle = () => {
    if (!fullHeroText) return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
    
    const lines = fullHeroText.split('\n');
    const fontSizes = [
        'text-4xl md:text-6xl font-medium', // Line 1
        'text-3xl md:text-5xl font-medium', // Line 2
        'text-2xl md:text-4xl font-light',   // Line 3
        'text-2xl md:text-4xl font-light'    // Line 4
    ];
    
    const parts = lines.map((line, index) => (
      <div key={index} className={cn(
        'text-foreground',
        index === 1 ? 'mb-20' : 'mb-4',
        fontSizes[index] || fontSizes[fontSizes.length - 1]
      )}>
        {renderStyledText(line, language)}
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
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-left pt-10 pb-20"
      >
        <div className={cn(
          "w-full max-w-4xl transition-opacity duration-1000",
          isContentVisible ? 'opacity-100' : 'opacity-0'
        )}>
            <div className="mb-10 text-foreground">
              {shouldAnimateHeroIntro && animationItems.length > 0 ? (
                  <StaggeredTextAnimation
                    key={language}
                    items={animationItems}
                    onComplete={handleAnimationComplete}
                    className="items-start text-left"
                  />
                ) : (
                  <div className="items-start text-left">
                    <StaticSubtitle />
                  </div>
                )
              }
            </div>

            <div className={cn(
              "flex flex-col sm:flex-row gap-6 justify-start pt-8",
              areControlsVisible ? "animate-controls-fade-in" : "opacity-0"
            )}>
              <Button
                size="icon"
                variant="outline"
                asChild
                className="h-16 w-16 rounded-full border-2 border-accent bg-transparent text-accent animate-bounce-subtle"
                aria-label={viewWorkButtonText}
              >
                <Link href="/#projects" onClick={handleSmoothScroll}>
                  <ArrowDown className="h-8 w-8" />
                </Link>
              </Button>
            </div>
        </div>
      </section>

      <section id="projects" className="pt-[50px]">
        <ProjectList projects={projects} />
      </section>
    </div>
  );
}
