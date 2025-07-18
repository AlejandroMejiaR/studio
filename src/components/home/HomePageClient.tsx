
"use client";

import { useEffect, useState, useMemo, useCallback, Fragment, Suspense } from 'react';
import type { Project } from '@/types';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { cn } from '@/lib/utils';
import StaggeredTextAnimation from '@/components/effects/StaggeredTextAnimation';
import { ArrowDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useScreenSize } from '@/hooks/use-screen-size';

const HeroScene = dynamic(() => import('@/components/home/HeroScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />,
});


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
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';


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
      ES: ['UX', 'Videojuegos', 'IA'],
    };
  
    const phrasesToColorAnimate = colorAnimatedWordsConfig[language] || [];
    const stylingRegex = new RegExp(`(${phrasesToColorAnimate.join('|')})`, 'g');
  
    const finalParts = text.split(stylingRegex).filter(Boolean);
  
    return (
      <Fragment>
        {finalParts.map((part, index) => {
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
    if (lines.length < 4) return [];

    const fontSizes = [
        'text-4xl md:text-5xl font-medium',         // "Hello!"
        'text-5xl md:text-6xl font-medium',         // "I'm Alejandro"
        'text-5xl md:text-6xl font-medium',         // "UX & Game Designer"
        'text-2xl md:text-4xl font-light'            // "I'm passionate about..."
    ];

    return [
        {
            content: <div className={cn(fontSizes[0])}>{renderStyledText(lines[0], language)}</div>,
            delayAfter: 800,
            className: 'text-foreground mb-6'
        },
        {
            content: <div className={cn(fontSizes[1])}>{renderStyledText(lines[1], language)}</div>,
            delayAfter: 800,
            className: 'text-foreground mb-6'
        },
        {
            content: <div className={cn(fontSizes[2])}>{renderStyledText(lines[2], language)}</div>,
            delayAfter: 1200,
            className: 'text-foreground mb-12'
        },
        {
            content: <div className={cn(fontSizes[3])}>{renderStyledText(lines[3], language)}</div>,
            delayAfter: 0,
            className: 'text-foreground'
        }
    ];
  }, [fullHeroText, language, isClientReady]);
  
  const StaticSubtitle = () => {
    if (!fullHeroText) return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
    
    const lines = fullHeroText.split('\n');
    if (lines.length < 4) return null; // Or some fallback

    const fontSizes = [
        'text-4xl md:text-5xl font-medium',
        'text-5xl md:text-6xl font-medium',
        'text-5xl md:text-6xl font-medium',
        'text-2xl md:text-4xl font-light'
    ];
    
    return (
        <>
            <div className={cn('text-foreground', fontSizes[0], 'mb-6')}>{renderStyledText(lines[0], language)}</div>
            <div className={cn('text-foreground', fontSizes[1], 'mb-6')}>{renderStyledText(lines[1], language)}</div>
            <div className={cn('text-foreground', fontSizes[2], 'mb-12')}>{renderStyledText(lines[2], language)}</div>
            <div className={cn('text-foreground', fontSizes[3])}>{renderStyledText(lines[3], language)}</div>
        </>
    );
  };

  if (!isClientReady || shouldAnimateHeroIntro === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <div 
            className={cn(
              "absolute top-0 left-0 w-full z-20 pointer-events-none",
              areControlsVisible ? "animate-controls-fade-in" : "opacity-0"
            )}
            style={{ height: '750px' }}
        >
            <Suspense fallback={<div className="w-full h-full bg-transparent" />}>
              <HeroScene />
            </Suspense>
        </div>
        
        <section 
          className={cn(
            "relative flex flex-col justify-center items-center text-left pt-10 pb-20 h-[750px]"
          )}
        >
          <div className="container mx-auto">
            <div className={cn(
              "relative z-30 w-full h-full flex flex-col justify-center transition-opacity duration-1000",
              isContentVisible ? 'opacity-100' : 'opacity-0',
              !isMobile && "pointer-events-none" 
            )}>
              {/* Text Container */}
              <div className={cn(
                "w-full flex flex-col items-center",
                !isMobile && "md:w-3/5"
              )}>
                <div className="w-full text-left md:items-start flex flex-col items-center pointer-events-auto">
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
                  "flex justify-center w-full pt-16 pointer-events-auto",
                  areControlsVisible ? "animate-controls-fade-in" : "opacity-0"
                )}>
                  <Button
                    size="icon"
                    asChild
                    className="h-20 w-20 rounded-full border-2 border-accent bg-transparent text-accent animate-bounce-subtle hover:bg-accent hover:text-accent-foreground"
                    aria-label={viewWorkButtonText}
                  >
                    <Link href="/#projects" onClick={handleSmoothScroll}>
                      <ArrowDown className="h-8 w-8" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="h-[200px]" />

      <div className="container mx-auto">
        <section id="projects" className="pt-[50px]">
          <ProjectList projects={projects} />
        </section>
      </div>
    </div>
  );
}
