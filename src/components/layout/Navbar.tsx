
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Gamepad2, Sun, Moon } from 'lucide-react';
import AnimatedBrandName from '@/components/effects/AnimatedBrandName';
import { cn } from '@/lib/utils';
import { useLanguage, type AppTranslations } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import LanguageSwitcherTooltip from './LanguageSwitcherTooltip';
import MusicPlayer from './MusicPlayer';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark'); // Default to dark
  const [navbarIsMounted, setNavbarIsMounted] = useState(false);
  const { language, setLanguage, translationsForLanguage, isClientReady, getInitialServerTranslation } = useLanguage();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { shouldNavbarContentBeVisible, showLanguageHint, setShowLanguageHint } = useNavbarVisibility();

  const [animateBrandName, setAnimateBrandName] = useState(true);


  useEffect(() => {
    setNavbarIsMounted(true);
    const storedTheme = localStorage.getItem('portfolio-ace-theme');
    if (storedTheme) {
      setTheme(storedTheme); // 'light' or 'dark'
    } else {
      // If no theme is stored, default to dark, matching the layout script.
      setTheme('dark');
      document.documentElement.classList.add('dark'); // Ensure class is set if storage was empty
      localStorage.setItem('portfolio-ace-theme', 'dark'); // Persist default if not set
    }
  }, []);

  useEffect(() => {
    if (!navbarIsMounted) return;

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio-ace-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio-ace-theme', 'light');
    }
  }, [theme, navbarIsMounted]);

  useEffect(() => {
    if (!isClientReady) {
      setAnimateBrandName(false);
      return;
    }

    if (pathname === '/') {
        // Only animate brand name if content is also visible (or about to be)
        setAnimateBrandName(shouldNavbarContentBeVisible);
    } else {
      setAnimateBrandName(false); // Static brand on other pages
    }
  }, [pathname, language, theme, isClientReady, shouldNavbarContentBeVisible]);


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ES' : 'EN');
  };

  const navLinks: { href: string; labelKey: keyof AppTranslations['nav'] }[] = [
    { href: '/#projects', labelKey: 'projects' },
    { href: '/about', labelKey: 'about' },
  ];

  const brandTextKey = isMobile ? 'brandNameShort' : 'brandName';
  const brandTextToRender = isClientReady
    ? translationsForLanguage[brandTextKey]
    : getInitialServerTranslation(t => t[brandTextKey]) || (isMobile ? "Alejandro Mejía" : "Alejandro Mejía - Ingeniero en Multimedia");

  const currentLanguageDisplay = isClientReady ? language : 'ES';
  const navLinkText = (labelKey: keyof AppTranslations['nav']) => isClientReady ? translationsForLanguage.nav[labelKey] : getInitialServerTranslation(t => t.nav[labelKey]) || labelKey;

  const staggerDelay = 0.05;

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    // Only handle scroll if on the homepage
    if (pathname === '/' && href?.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.substring(2);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Otherwise, let Link component handle navigation
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleSmoothScroll(e);
    handleMobileMenuClose();
  };

  const languageSwitchText = language === 'EN' ? 'English' : 'Español';
  const changeLanguageHintText = navLinkText('changeLanguageHint');

  const brandNameComponent = navbarIsMounted && animateBrandName && pathname === '/' ? (
    <AnimatedBrandName
      key={`brand-${theme}-${currentLanguageDisplay}-${isMobile ? 'short' : 'full'}-${pathname}`}
      text={brandTextToRender}
      style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
    />
  ) : navbarIsMounted ? (
    <h1
      className={cn(
        "font-headline text-xl font-bold",
        theme === 'dark' ? "text-foreground/80" : "text-primary"
      )}
      style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
    >
      {brandTextToRender}
    </h1>
  ) : ( 
    <h1 className="font-headline text-xl font-bold" aria-label={getInitialServerTranslation(t => t[brandTextKey]) || (isMobile ? "Alejandro Mejía" : "Alejandro Mejía - Ingeniero en Multimedia")} style={{ visibility: 'hidden' }}>
      {((getInitialServerTranslation(t => t[brandTextKey]) as string) || (isMobile ? "Alejandro Mejía" : "Alejandro Mejía - Ingeniero en Multimedia")).split('').map((letter, index) => (
        <span
          key={index}
          className="inline-block"
          style={{ animationDelay: `${(((getInitialServerTranslation(t => t[brandTextKey]) as string) || (isMobile ? "Alejandro Mejía" : "Alejandro Mejía - Ingeniero en Multimedia")).length - 1 - index) * staggerDelay}s` }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </h1>
  );


  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm transition-colors duration-500 ease-in-out",
      shouldNavbarContentBeVisible
        ? "border-[rgb(200,200,200)] dark:border-[rgb(70,70,70)]"
        : "border-transparent"
    )}>
      <div className={cn(
          "container flex h-16 items-center justify-between",
          pathname === '/' && !shouldNavbarContentBeVisible && "opacity-0",
          pathname === '/' && shouldNavbarContentBeVisible && "animate-fadeInNavbarContent"
      )}>
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity duration-300 ease-in-out hover:opacity-80"
        >
          {navbarIsMounted ? (
            <Gamepad2
              key={`icon-${theme}-${pathname}`} 
              className={cn("h-7 w-7", theme === 'dark' ? "text-foreground/80" : "text-primary", animateBrandName && pathname === '/' ? "animate-icon-pulse" : "")}
            />
          ) : (
            <Gamepad2 className="h-7 w-7 text-primary" /> 
          )}
          {brandNameComponent}
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          <MusicPlayer />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleSmoothScroll}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300 ease-in-out px-2"
            >
              <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                {navLinkText(link.labelKey)}
              </span>
            </Link>
          ))}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              aria-label={changeLanguageHintText}
              className="h-9 px-3 hover:bg-accent/10"
            >
              <span
                key={`desktop-lang-switch-${currentLanguageDisplay}`}
                className="text-sm font-medium text-foreground/80 animate-fadeIn"
                style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
              >
                {languageSwitchText}
              </span>
            </Button>
            <LanguageSwitcherTooltip
              show={showLanguageHint}
              onClose={() => setShowLanguageHint(false)}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 hover:bg-accent/10"
          >
            {navbarIsMounted ? (
              theme === 'light' ? <Moon className="h-5 w-5 text-foreground/80" /> : <Sun className="h-5 w-5 text-foreground/80" />
            ) : (
              <Sun className="h-5 w-5 text-primary" /> 
            )}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              aria-label={changeLanguageHintText}
              className="h-9 px-3 hover:bg-accent/10"
            >
              <span
                key={`mobile-lang-switch-${currentLanguageDisplay}`}
                className="text-sm font-medium text-foreground/80 animate-fadeIn"
                style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
              >
                {languageSwitchText}
              </span>
            </Button>
            <LanguageSwitcherTooltip
              show={showLanguageHint}
              onClose={() => setShowLanguageHint(false)}
            />
          </div>
          <MusicPlayer />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 hover:bg-accent/10"
          >
             {navbarIsMounted ? (
              theme === 'light' ? <Moon className="h-5 w-5 text-foreground/80" /> : <Sun className="h-5 w-5 text-foreground/80" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background">
               <SheetTitle className="sr-only">
                 <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                    {navLinkText('mobileMenuTitle')}
                  </span>
               </SheetTitle>
              <div className="p-6">
                <Link
                  href="/"
                  className="flex items-center gap-3 mb-8 transition-opacity duration-300 ease-in-out hover:opacity-80"
                  onClick={handleMobileMenuClose}
                >
                  {navbarIsMounted ? (
                     <Gamepad2
                        key={`icon-mobile-${theme}-${pathname}`}
                        className={cn("h-7 w-7", theme === 'dark' ? "text-foreground/80" : "text-primary", animateBrandName && pathname === '/' ? "animate-icon-pulse" : "")}
                      />
                  ) : (
                    <Gamepad2 className="h-7 w-7 text-primary" />
                  )}
                  {brandNameComponent} 
                </Link>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors duration-300 ease-in-out"
                      onClick={handleMobileLinkClick}
                    >
                      <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                        {navLinkText(link.labelKey)}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
