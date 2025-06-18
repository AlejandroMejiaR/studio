
"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface LetterRevealAnimationProps {
  text: string;
  baseDelay?: number; // Time before this animation instance starts
  letterStaggerDelay?: number; // Time between each letter appearing
  letterAnimationDuration?: number; // Duration of each letter's individual animation
  className?: string; // Class for the root span of this component
  letterClassName?: string; // Class for individual letter spans
  style?: React.CSSProperties;
}

const LetterRevealAnimation: FC<LetterRevealAnimationProps> = ({
  text,
  baseDelay = 0,
  letterStaggerDelay = 0.05,
  letterAnimationDuration = 0.6,
  className,
  letterClassName,
  style,
}) => {
  const characters = text.split('');

  return (
    <span
      className={cn(className)}
      aria-label={text}
      style={style}
    >
      {characters.map((char, index) => {
        const delay = baseDelay + (index * letterStaggerDelay);
        return (
          <span
            key={`char-${index}-${char}-${text.substring(0,10)}`}
            className={cn(
              "inline-block opacity-0 animate-letter-reveal",
              letterClassName
            )}
            style={{
              animationDelay: `${delay}s`,
              animationDuration: `${letterAnimationDuration}s`,
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
