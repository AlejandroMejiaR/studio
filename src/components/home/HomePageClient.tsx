
"use client";

import { useEffect, useState, useMemo, useCallback, Fragment, Suspense } from 'react';
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { useFooter } from '@/contexts/FooterContext';
import { cn } from '@/lib/utils';
import StaggeredTextAnimation from '@/components/effects/StaggeredTextAnimation';
import { ArrowDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useGLTF } from '@react-three/drei';

const HeroScene = dynamic(() => import('@/components/home/HeroScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />,
});

// Function to check sessionStorage safely on the client
const getInitialAnimationState = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Never animate on the server
  }
  try {
    const hasAnimated = sessionStorage.getItem('portfolio_ace_has_animated');
    return !hasAnimated;
  } catch (e) {
    return false;
  }
};


export default function HomePageClient({ projects }: { projects: Project[] }) {
  const {
    language,
    translationsForLanguage,
    isClientReady,
    getInitialServerTranslation
  } = useLanguage();
  const { setShouldNavbarContentBeVisible, setShowLanguageHint } = useNavbarVisibility();
  const { setIsFooterVisible } = useFooter();
  const pathname = usePathname();
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';

  // The single source of truth: Should we animate? Decision is made immediately.
  const [shouldAnimate, setShouldAnimate] = useState(getInitialAnimationState);

  // Preload the model as early as possible on the client
  useEffect(() => {
    useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Final.glb', true);
  }, []);


  // This effect handles all side-effects related to the animation state.
  useEffect(() => {
    if (shouldAnimate) {
      // Prepare for animation
      setShouldNavbarContentBeVisible(false);
      document.body.classList.add('no-scroll');
    } else {
      // Ensure everything is visible if not animating
      setShouldNavbarContentBeVisible(true);
      document.body.classList.remove('no-scroll');
    }

    // Cleanup function to ensure scroll is always re-enabled on component unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [shouldAnimate, setShouldNavbarContentBeVisible]);

  // Effect to control footer visibility based on hero section
  useEffect(() => {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero is NOT intersecting (i.e., scrolled out of view), show footer.
        setIsFooterVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    observer.observe(heroSection);

    return () => {
      observer.disconnect();
    };
  }, [setIsFooterVisible]);


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

    const hintShown = sessionStorage.getItem('portfolio-ace-language-hint-shown');
    if (!hintShown) {
        setShowLanguageHint(true);
        sessionStorage.setItem('portfolio-ace-language-hint-shown', 'true');
    }

    return () => clearTimeout(scrollTimer);
  }, [isClientReady, pathname, setShowLanguageHint]);
  
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
    // Animation is done, show controls and re-enable scroll
    setShouldNavbarContentBeVisible(true);
    document.body.classList.remove('no-scroll');
    // Mark as animated in this session
    sessionStorage.setItem('portfolio_ace_has_animated', 'true');
    // Update state to render static content and prevent re-animation
    setShouldAnimate(false);
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

  if (!isClientReady) {
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
              !shouldAnimate ? "animate-controls-fade-in" : "opacity-0"
            )}
            style={{ height: '750px' }}
        >
            <Suspense fallback={<div className="w-full h-full bg-transparent" />}>
              <HeroScene />
            </Suspense>
        </div>
        
        <section 
          id="hero"
          className={cn(
            "relative flex flex-col justify-center items-center text-left pt-10 pb-20 h-[750px]"
          )}
        >
          <div className="container mx-auto">
            <div className={cn(
              "relative z-30 w-full h-full flex flex-col justify-center",
              !isMobile && "pointer-events-none" 
            )}>
              {/* Text Container */}
              <div className={cn(
                "w-full flex flex-col items-center",
                !isMobile && "md:w-3/5"
              )}>
                <div className="w-full text-left md:items-start flex flex-col items-center pointer-events-auto">
                  {shouldAnimate ? (
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
                  !shouldAnimate ? "animate-controls-fade-in" : "opacity-0"
                )}>
                  <Button
                    size="icon"
                    asChild
                    className="h-20 w-20 rounded-full border-2 border-accent bg-transparent text-accent animate-bounce-subtle hover:bg-accent hover:text-accent-foreground [&_svg]:size-8"
                    aria-label={viewWorkButtonText}
                  >
                    <Link href="/#projects" onClick={handleSmoothScroll}>
                      <ArrowDown />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="case-studies" className="scroll-mt-16" />
    </div>
  );
}

    