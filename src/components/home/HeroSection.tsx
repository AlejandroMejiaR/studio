
"use client";

import { useEffect, useMemo, Fragment, Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { useFooter } from '@/contexts/FooterContext';
import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useGLTF } from '@react-three/drei';

const HeroScene = dynamic(() => import('@/components/home/HeroScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />,
});


export default function HeroSection() {
  const {
    language,
    translationsForLanguage,
    isClientReady,
    getInitialServerTranslation
  } = useLanguage();
  const { setShouldNavbarContentBeVisible } = useNavbarVisibility();
  const { setIsFooterVisible } = useFooter();
  const pathname = usePathname();
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  
  // Preload the model as early as possible on the client
  useEffect(() => {
    useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Final.glb', true);
  }, []);

  // This effect handles side-effects like scroll and navbar visibility.
  useEffect(() => {
    // Show navbar content immediately since there is no entry animation.
    setShouldNavbarContentBeVisible(true);
    // Ensure scroll is enabled.
    document.body.classList.remove('no-scroll');

    // Cleanup function
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [setShouldNavbarContentBeVisible]);

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

    return () => clearTimeout(scrollTimer);
  }, [isClientReady, pathname]);
  
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

  const StaticSubtitle = () => {
    if (!fullHeroText) return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
    
    const lines = fullHeroText.split('\n');
    if (lines.length < 5) return null;

    const fontSizes = [
        'text-4xl md:text-5xl font-medium', // ¡Hola!
        'text-5xl md:text-6xl font-medium', // Soy Alejandro
        'text-5xl md:text-6xl font-medium', // Desarrollador de Videojuegos
        'text-5xl md:text-6xl font-medium', // Diseñador UX
        'text-2xl md:text-4xl font-light'  // Me apasiona...
    ];
    
    return (
        <>
            <div className={cn('text-foreground', fontSizes[0], 'mb-6')}>{renderStyledText(lines[0], language)}</div>
            <div className={cn('text-foreground', fontSizes[1], 'mb-6')}>{renderStyledText(lines[1], language)}</div>
            <div className={cn('text-foreground', fontSizes[2], 'mb-6')}>{renderStyledText(lines[2], language)}</div>
            <div className={cn('text-foreground', fontSizes[3], 'mb-12')}>{renderStyledText(lines[3], language)}</div>
            <div className={cn('text-foreground', fontSizes[4])}>{renderStyledText(lines[4], language)}</div>
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
            className="absolute top-0 left-0 w-full z-20 pointer-events-none"
            style={{ height: '750px' }}
        >
            <Suspense fallback={<div className="w-full h-full bg-transparent" />}>
              <HeroScene />
            </Suspense>
        </div>
        
        <section 
          id="hero"
          className="relative flex flex-col justify-center items-center text-left pt-10 pb-20 h-[750px]"
        >
          <div className="container mx-auto">
            <div className={cn(
              "relative z-30 w-full h-full flex flex-col justify-center",
              "opacity-0 animate-fadeInNavbarContent", // Apply animation classes directly
              !isMobile && "pointer-events-none" 
            )}>
              {/* Text Container */}
              <div className={cn(
                "w-full flex flex-col items-center",
                !isMobile && "md:w-3/5"
              )}>
                <div className="w-full text-left md:items-start flex flex-col items-center pointer-events-auto">
                  <div className="items-start text-left">
                    <StaticSubtitle />
                  </div>
                </div>

                <div className="flex justify-center w-full pt-16 pointer-events-auto">
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
