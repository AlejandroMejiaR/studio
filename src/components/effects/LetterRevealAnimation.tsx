
"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface LetterRevealAnimationProps {
  text: string;
  staggerDelay?: number; // Delay between each letter's animation start (in seconds)
  animationDuration?: number; // Duration of each letter's animation (in seconds)
  className?: string; // Class for the container span
  letterClassName?: string; // Class for individual letter spans
}

const LetterRevealAnimation: FC<LetterRevealAnimationProps> = ({
  text,
  staggerDelay = 0.05,
  animationDuration = 0.6,
  className,
  letterClassName,
}) => {
  const letters = text.split('');

  return (
    <span className={cn("inline-block", className)} aria-label={text}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={cn(
            "inline-block opacity-0 animate-letter-reveal",
            letterClassName
          )}
          style={{
            animationDelay: `${(letters.length - 1 - index) * staggerDelay}s`,
            animationDuration: `${animationDuration}s`,
          }}
          aria-hidden="true"
        >
          {letter === ' ' ? '\u00A0' : letter} {/* Preserve spaces */}
        </span>
      ))}
    </span>
  );
};

export default LetterRevealAnimation;
