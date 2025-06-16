
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
  }, []);

  const letters = text.split('');

  // Apply animation class only on client-side after mount
  const animationClass = isMounted
    ? (currentTheme === 'light' ? 'animate-text-color-wave-light' : 'animate-text-color-wave-dark')
    : '';

  return (
    <h1
      className={cn(
        "font-headline text-xl font-bold", // Base classes for consistent server/client initial render
        animationClass, // Applied only client-side
        className
      )}
      aria-label={text}
    >
      {letters.map((letter, index) => {
        const delay = (letters.length - 1 - index) * staggerDelay;
        return (
          <span
            key={index}
            className={cn("inline-block", letterClassName)} // Added "inline-block" for initial layout
            style={{ animationDelay: `${delay}s` }} // Style applied server & client for consistency
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
