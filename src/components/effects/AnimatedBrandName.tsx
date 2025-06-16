
"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBrandNameProps {
  text: string;
  className?: string;
  letterClassName?: string;
  staggerDelay?: number; // in seconds
}

const AnimatedBrandName: React.FC<AnimatedBrandNameProps> = ({
  text,
  className,
  letterClassName,
  staggerDelay = 0.05, // Time difference for animation start between consecutive letters
}) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Component has mounted on the client

    // Initial theme check
    const isDark = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDark ? 'dark' : 'light');

    // Observe theme changes
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDarkUpdated = (mutation.target as HTMLElement).classList.contains('dark');
          setCurrentTheme(isDarkUpdated ? 'dark' : 'light');
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const letters = text.split('');

  // Only apply theme-specific animation class if mounted on the client
  const animationClass = isMounted
    ? (currentTheme === 'light' ? 'animate-text-color-wave-light' : 'animate-text-color-wave-dark')
    : ''; // Render without theme-specific animation class on server and initial client render

  return (
    <h1
      className={cn(
        "font-headline text-xl font-bold text-primary dark:text-foreground/80", // Base styling from Navbar
        animationClass, // Apply theme-specific animation class conditionally
        className
      )}
      aria-label={text}
    >
      {letters.map((letter, index) => {
        // Animation delay from right to left
        const delay = (letters.length - 1 - index) * staggerDelay;
        return (
          <span
            key={index}
            className={cn(letterClassName)}
            style={{ animationDelay: `${delay}s` }}
            aria-hidden="true"
          >
            {letter === ' ' ? '\u00A0' : letter} {/* Preserve spaces */}
          </span>
        );
      })}
    </h1>
  );
};

export default AnimatedBrandName;
