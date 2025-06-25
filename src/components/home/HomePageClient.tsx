
"use client";

import { useEffect, useState, useRef, Fragment } from 'react';
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
import TypingAnimation from '@/components/effects/TypingAnimation';

interface HomePageClientProps {
  projects: Project[];
}

export default function HomePageClient({ projects }: HomePageClientProps) {
  const {
    language,
    translationsForLanguage,
    isClientReady,
    getEnglishTranslation
  } = useLanguage();
  const { setShouldNavbarContentBeVisible, setShowLanguageHint } = useNavbarVisibility();
  const aboutSectionRef = useRef<HTMLElement>(null);
  const { setIsFooterVisible } = useFooter();
  const pathname = usePathname();

  const [shouldAnimateHeroIntro, setShouldAnimateHeroIntro] = useState<boolean | null>(null);
  const prevLanguageRef = useRef<Language | null>(null);

  const [isContentVisible, setIsContentVisible] = useState(false);
  const animationTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAnimationTimeouts = () => {
    animationTimersRef.current.forEach(clearTimeout);
    animationTimersRef.current = [];
  };

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
  
    const previousLanguage = prevLanguageRef.current;
    const languageHasChanged = previousLanguage !== null && previousLanguage !== language;
  
    if (languageHasChanged) {
      setShouldAnimateHeroIntro(true);
    } else {
      const initialLoadAnimatedKey = `portfolio_ace_initial_load_animated_${language}`;
      const hasAnimatedOnInitialLoad = sessionStorage.getItem(initialLoadAnimatedKey);
  
      if (!hasAnimatedOnInitialLoad) {
        setShouldAnimateHeroIntro(true);
        sessionStorage.setItem(initialLoadAnimatedKey, 'true');
      } else {
        setShouldAnimateHeroIntro(false);
      }
    }
  
    prevLanguageRef.current = language;
  
  }, [isClientReady, language]);

  useEffect(() => {
    if (shouldAnimateHeroIntro === null || !isClientReady) {
      return;
    }
    
    clearAnimationTimeouts();

    if (shouldAnimateHeroIntro) {
      setIsContentVisible(false);
      setShouldNavbarContentBeVisible(false);
      const timer = setTimeout(() => {
        setIsContentVisible(true);
        setShouldNavbarContentBeVisible(true);
      }, 300);
      animationTimersRef.current.push(timer);
    } else {
      setIsContentVisible(true);
      setShouldNavbarContentBeVisible(true);
    }
    
    return clearAnimationTimeouts;
  }, [shouldAnimateHeroIntro, isClientReady, setShouldNavbarContentBeVisible]);
  
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

  const heroSubtitle = isClientReady ? translationsForLanguage.home.hero.subtitle : '';
  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getEnglishTranslation(t => t.home.buttons.viewWork) as string || "View Work";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getEnglishTranslation(t => t.home.buttons.aboutMe) as string || "About Me";
  
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
  
  const highlightedWordsForTypingAnim = [
    ...phrasesToColorAnimate.map(word => ({ word, className: 'animate-text-pulse font-bold text-accent' })),
    ...phrasesToBold.map(word => ({ word, className: 'font-bold text-foreground/90' }))
  ];
  
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
  
  const StaticSubtitle = ({ text }: { text: string }) => {
    if (!isClientReady) return <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
    
    const allStyledPhrases = [...phrasesToColorAnimate, ...phrasesToBold];
    const stylingRegex = new RegExp(`(${allStyledPhrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    const parts = text.split(stylingRegex).filter(Boolean);

    return (
      <>
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
    <div className="container mx-auto">
      <section 
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center py-20"
      >
        <div className={cn(
          "w-full max-w-4xl transition-opacity duration-1000",
          isContentVisible ? 'opacity-100' : 'opacity-0'
        )}>
            <div className="mb-10 text-foreground/80 text-3xl md:text-5xl font-medium whitespace-pre-line">
              {shouldAnimateHeroIntro ? (
                  <TypingAnimation
                    key={heroSubtitle}
                    text={heroSubtitle}
                    speed={25}
                    highlightedWords={highlightedWordsForTypingAnim}
                    punctuationPauseFactor={5}
                  />
                ) : (
                  <StaticSubtitle text={heroSubtitle} />
                )
              }
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
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
