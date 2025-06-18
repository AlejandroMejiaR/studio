
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Gamepad2, Sun, Moon, Languages } from 'lucide-react';
import AnimatedBrandName from '@/components/effects/AnimatedBrandName';
import { cn } from '@/lib/utils';
import { useLoading } from '@/contexts/LoadingContext';
import { useLanguage, type AppTranslations } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile'; // Added

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [navbarIsMounted, setNavbarIsMounted] = useState(false);
  const { showLoading } = useLoading();
  const { language, setLanguage, translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();
  const pathname = usePathname();
  const isMobile = useIsMobile(); // Added

  useEffect(() => {
    setNavbarIsMounted(true);
    const storedTheme = localStorage.getItem('portfolio-ace-theme');
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
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

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ES' : 'EN');
  };

  const navLinks: { href: string; labelKey: keyof AppTranslations['nav'] }[] = [
    { href: '/#projects', labelKey: 'projects' },
    { href: '/#about', labelKey: 'about' },
  ];
  
  const brandTextKey = isMobile ? 'brandNameShort' : 'brandName';
  const brandTextToRender = isClientReady 
    ? translationsForLanguage[brandTextKey] 
    : getEnglishTranslation(t => t[brandTextKey]) || (isMobile ? "Brand" : "Brand Name");

  const currentLanguageDisplay = isClientReady ? language : 'EN'; 
  const navLinkText = (labelKey: keyof AppTranslations['nav']) => isClientReady ? translationsForLanguage.nav[labelKey] : getEnglishTranslation(t => t.nav[labelKey]) || labelKey;

  const returningHomeText = isClientReady 
    ? translationsForLanguage.loadingScreen.returningHome 
    : getEnglishTranslation(t => t.loadingScreen.returningHome) || "Returning to Home...";

  const staggerDelay = 0.05;

  const handleHomeNavigation = () => {
    if (pathname !== '/') {
      showLoading(returningHomeText);
    }
  };
  
  const handleMobileHomeNavigation = () => {
    if (pathname !== '/') {
      showLoading(returningHomeText);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity duration-300 ease-in-out hover:opacity-80"
          prefetch={false}
          onClick={handleHomeNavigation}
        >
          {navbarIsMounted ? (
            <Gamepad2
              key={`icon-${theme}`}
              className={cn("h-7 w-7", theme === 'dark' ? "text-foreground/80" : "text-primary", "animate-icon-pulse")}
            />
          ) : (
            <Gamepad2 className="h-7 w-7 text-primary" />
          )}

          {navbarIsMounted ? (
            <AnimatedBrandName
              key={`brand-${theme}-${currentLanguageDisplay}-${isMobile ? 'short' : 'full'}`} 
              text={brandTextToRender}
              style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
            />
          ) : (
            <h1 className="font-headline text-xl font-bold" aria-label={getEnglishTranslation(t => t[brandTextKey]) || (isMobile ? "Brand" : "Brand")} style={{ visibility: 'hidden' }}>
              {(getEnglishTranslation(t => t[brandTextKey]) || (isMobile ? "Brand" : "Brand")).split('').map((letter, index) => (
                <span
                  key={index}
                  className="inline-block"
                  style={{ animationDelay: `${(((getEnglishTranslation(t => t[brandTextKey]) || (isMobile ? "Brand" : "Brand")).length - 1 - index) * staggerDelay)}s` }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </h1>
          )}
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300 ease-in-out px-2"
              prefetch={false}
            >
              <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                {navLinkText(link.labelKey)}
              </span>
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="h-9 px-2 hover:bg-accent/10 flex items-center"
          >
            <Languages className="h-5 w-5 text-foreground/80" />
            <span
              key={`desktop-lang-indicator-${currentLanguageDisplay}`}
              className="ml-1.5 text-xs font-semibold text-foreground/80 animate-fadeIn"
              style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
            >
              {currentLanguageDisplay}
            </span>
          </Button>
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
              <Moon className="h-5 w-5 text-primary" /> 
            )}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="h-9 px-2 hover:bg-accent/10 flex items-center"
          >
            <Languages className="h-5 w-5 text-foreground/80" />
            <span
              key={`mobile-lang-indicator-${currentLanguageDisplay}`}
              className="ml-1.5 text-xs font-semibold text-foreground/80 animate-fadeIn"
              style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
            >
              {currentLanguageDisplay}
            </span>
          </Button>
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
              <Moon className="h-5 w-5 text-primary" />
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
                  onClick={handleMobileHomeNavigation}
                >
                  {navbarIsMounted ? (
                     <Gamepad2
                        key={`icon-mobile-${theme}`}
                        className={cn("h-7 w-7", theme === 'dark' ? "text-foreground/80" : "text-primary", "animate-icon-pulse")}
                      />
                  ) : (
                    <Gamepad2 className="h-7 w-7 text-primary" />
                  )}
                  {navbarIsMounted ? (
                    <AnimatedBrandName
                      key={`brand-mobile-${theme}-${currentLanguageDisplay}-${isMobile ? 'short' : 'full'}`}
                      text={brandTextToRender}
                      style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                    />
                  ) : (
                     <h1 className="font-headline text-xl font-bold" aria-label={getEnglishTranslation(t => t[brandTextKey]) || (isMobile ? "Brand" : "Brand")} style={{ visibility: 'hidden' }}>
                        {(getEnglishTranslation(t => t[brandTextKey]) || (isMobile ? "Brand" : "Brand")).split('').map((letter, index) => (
                            <span
                                key={index}
                                className="inline-block"
                                style={{ animationDelay: `${(((getEnglishTranslation(t => t[brandTextKey]) || (isMobile ? "Brand" : "Brand")).length - 1 - index) * staggerDelay)}s` }}
                            >
                                {letter === ' ' ? '\u00A0' : letter}
                            </span>
                        ))}
                    </h1>
                  )}
                </Link>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors duration-300 ease-in-out"
                      onClick={() => setIsMobileMenuOpen(false)}
                      prefetch={false}
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
