
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Gamepad2, Sun, Moon, Languages } from 'lucide-react';
import AnimatedBrandName from '@/components/effects/AnimatedBrandName';
import { cn } from '@/lib/utils';
import { useLoading } from '@/contexts/LoadingContext';
import { useLanguage, type AppTranslations } from '@/contexts/LanguageContext'; // Updated import
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isMounted, setIsMounted] = useState(false);
  const { showLoading } = useLoading();
  const { language, setLanguage, translationsForLanguage } = useLanguage(); // Use language context
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('portfolio-ace-theme');
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio-ace-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio-ace-theme', 'light');
    }
  }, [theme, isMounted]);

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
  
  const brandTextToDisplay = translationsForLanguage.brandName;
  const staggerDelay = 0.05; // Retained for AnimatedBrandName logic

  const handleHomeNavigation = () => {
    if (pathname !== '/') {
      showLoading("Returning to Home...");
    }
  };
  
  const handleMobileHomeNavigation = () => {
    if (pathname !== '/') {
      showLoading("Returning to Home...");
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
          {isMounted ? (
            <Gamepad2
              key={`icon-${theme}`}
              className={cn("h-7 w-7", theme === 'dark' ? "text-foreground/80" : "text-primary", "animate-icon-pulse")}
            />
          ) : (
            <Gamepad2 className="h-7 w-7 text-primary" />
          )}

          {isMounted ? (
            <AnimatedBrandName
              key={`brand-${theme}-${language}`} // Use language from context for key
              text={brandTextToDisplay}
            />
          ) : (
            // Fallback for SSR/pre-mount - uses default EN
            <h1 className="font-headline text-xl font-bold" aria-label="Alejandro Mejia - Multimedia Engineer">
              {"Alejandro Mejia - Multimedia Engineer".split('').map((letter, index) => (
                <span
                  key={index}
                  className="inline-block"
                  style={{ animationDelay: `${( ("Alejandro Mejia - Multimedia Engineer".length - 1 - index) * staggerDelay)}s` }}
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
              {translationsForLanguage.nav[link.labelKey]}
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
              key={language} // Use language from context for key
              className="ml-1.5 text-xs font-semibold text-foreground/80 animate-fadeIn"
            >
              {language}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 hover:bg-accent/10"
          >
            {isMounted ? (
              theme === 'light' ? <Moon className="h-5 w-5 text-foreground/80" /> : <Sun className="h-5 w-5 text-foreground/80" />
            ) : (
              <Moon className="h-5 w-5 text-primary" /> /* Default to Moon for SSR */
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
              key={`mobile-${language}`} // Use language from context for key
              className="ml-1.5 text-xs font-semibold text-foreground/80 animate-fadeIn"
            >
              {language}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 hover:bg-accent/10"
          >
             {isMounted ? (
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
              <div className="p-6">
                <Link
                  href="/"
                  className="flex items-center gap-3 mb-8 transition-opacity duration-300 ease-in-out hover:opacity-80"
                  onClick={handleMobileHomeNavigation}
                >
                  {isMounted ? (
                     <Gamepad2
                        key={`icon-mobile-${theme}`}
                        className={cn("h-7 w-7", theme === 'dark' ? "text-foreground/80" : "text-primary", "animate-icon-pulse")}
                      />
                  ) : (
                    <Gamepad2 className="h-7 w-7 text-primary" />
                  )}
                  {isMounted ? (
                    <AnimatedBrandName
                      key={`brand-mobile-${theme}-${language}`} // Use language from context
                      text={brandTextToDisplay}
                    />
                  ) : (
                     <h1 className="font-headline text-xl font-bold" aria-label="Alejandro Mejia - Multimedia Engineer">
                        {"Alejandro Mejia - Multimedia Engineer".split('').map((letter, index) => (
                            <span
                                key={index}
                                className="inline-block"
                                style={{ animationDelay: `${( ("Alejandro Mejia - Multimedia Engineer".length - 1 - index) * staggerDelay)}s` }}
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
                      {translationsForLanguage.nav[link.labelKey]}
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
