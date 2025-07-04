
"use client";

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) { // Show button if scrolled more than 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Set initial visibility on mount
    toggleVisibility(); 
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <Button
      size="icon"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 ease-in-out",
        "bg-accent text-accent-foreground hover:bg-accent/90",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
      )}
      aria-label="Scroll to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  );
};

export default ScrollToTopButton;
