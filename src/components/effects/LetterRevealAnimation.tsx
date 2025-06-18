
"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface LetterRevealAnimationProps {
  text: string;
  staggerDelay?: number;
  animationDuration?: number;
  className?: string;
  letterClassName?: string;
  style?: React.CSSProperties;
}

const LetterRevealAnimation: FC<LetterRevealAnimationProps> = ({
  text,
  staggerDelay = 0.05,
  animationDuration = 0.6,
  className,
  letterClassName,
  style,
}) => {
  const characters = text.split('');

  return (
    <span
      className={cn(className)} // Base className, can be 'block' if passed from parent
      aria-label={text}
      style={style}
    >
      {characters.map((char, index) => {
        // Corrected delay calculation for left-to-right animation
        const delay = index * staggerDelay;
        return (
          <span
            key={`char-${index}-${char}-${text}`} // Ensure key is unique across different texts/renders
            className={cn(
              "inline-block opacity-0 animate-letter-reveal",
              letterClassName
            )}
            style={{
              animationDelay: `${delay}s`,
              animationDuration: `${animationDuration}s`,
            }}
            aria-hidden="true"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
};

export default LetterRevealAnimation;
