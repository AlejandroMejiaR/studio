
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Gamepad2, Sun, Moon, Languages } from 'lucide-react'; // Added Languages
import AnimatedBrandName from '@/components/effects/AnimatedBrandName';
import { cn } from '@/lib/utils';
import { useLoading } from '@/contexts/LoadingContext';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isMounted, setIsMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'ES'>('EN'); // Language state
  const { showLoading } = useLoading();
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
    setCurrentLanguage(prev => (prev === 'EN' ? 'ES' : 'EN'));
    // Actual language switching logic would go here in a real implementation
  };

  const navLinks = [
    { href: '/#projects', label: 'Projects' },
    { href: '/#about', label: 'About' },
  ];

  const brandName = "Alejandro Mejia - Multimedia Engineer";
  const staggerDelay = 0.05; 

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
              key={`brand-${theme}`}
              text={brandName} 
            />
          ) : (
            <h1 className="font-headline text-xl font-bold" aria-label={brandName}>
              {brandName.split('').map((letter, index) => {
                const delay = (brandName.length - 1 - index) * staggerDelay;
                return (
                  <span
                    key={index}
                    className="inline-block" 
                    style={{ animationDelay: `${delay}s` }} 
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                );
              })}
            </h1>
          )}
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2"> {/* Reduced space-x for more items */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300 ease-in-out px-2"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm" // Adjusted size to be consistent
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="h-9 px-2 hover:bg-accent/10 flex items-center"
          >
            <Languages className="h-5 w-5 text-foreground/80" />
            <span
              key={currentLanguage}
              className="ml-1.5 text-xs font-semibold text-foreground/80 animate-fadeIn"
            >
              {currentLanguage}
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
              <Moon className="h-5 w-5 text-primary" /> // Fallback for SSR or pre-mount
            )}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1"> {/* Reduced space-x */}
          <Button
            variant="ghost"
            size="sm" // Adjusted size
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="h-9 px-2 hover:bg-accent/10 flex items-center"
          >
            <Languages className="h-5 w-5 text-foreground/80" />
            <span
              key={`mobile-${currentLanguage}`} // Ensure unique key for mobile
              className="ml-1.5 text-xs font-semibold text-foreground/80 animate-fadeIn"
            >
              {currentLanguage}
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
              <Moon className="h-5 w-5 text-primary" /> // Fallback
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
                      key={`brand-mobile-${theme}`}
                      text={brandName} 
                    />
                  ) : (
                     <h1 className="font-headline text-xl font-bold" aria-label={brandName}>
                        {brandName.split('').map((letter, index) => {
                            const delay = (brandName.length - 1 - index) * staggerDelay;
                            return (
                            <span
                                key={index}
                                className="inline-block"
                                style={{ animationDelay: `${delay}s` }}
                            >
                                {letter === ' ' ? '\u00A0' : letter}
                            </span>
                            );
                        })}
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
                      {link.label}
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
