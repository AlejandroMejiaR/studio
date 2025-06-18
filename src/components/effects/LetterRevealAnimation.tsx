
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
  const words = text.split(' ').filter(word => word.length > 0);
  let globalCharIndex = 0;
  const animatedElements: JSX.Element[] = [];

  words.forEach((word, wordIndex) => {
    // Add letters of the word
    word.split('').forEach((char) => {
      const delay = globalCharIndex * staggerDelay;
      animatedElements.push(
        <span
          key={`char-${globalCharIndex}`}
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
          {char}
        </span>
      );
      globalCharIndex++;
    });

    // Add invisible 'Q' as a spacer if not the last word
    if (wordIndex < words.length - 1) {
      const delay = globalCharIndex * staggerDelay;
      animatedElements.push(
        <span
          key={`spacer-Q-${globalCharIndex}`}
          className={cn(
            "inline-block opacity-0 animate-letter-reveal"
            // Not applying letterClassName here, as it's a spacer
          )}
          style={{
            animationDelay: `${delay}s`,
            animationDuration: `${animationDuration}s`,
            color: 'hsl(var(--background))', // Adapts to theme's background
          }}
          aria-hidden="true"
        >
          Q
        </span>
      );
      globalCharIndex++;
    }
  });

  return (
    <span
      className={cn("flex flex-wrap", className)} // Using flex-wrap for layout
      aria-label={text} // Screen readers will read the original text
      style={style}
    >
      {animatedElements.length > 0 ? animatedElements : (
        // Fallback for empty text or text with only spaces to avoid empty span if not desired
        // Or, to ensure the aria-label is still on a span if text is effectively empty after processing
        <span aria-hidden="true" style={{opacity: 0}}>{text}</span>
      )}
    </span>
  );
};

export default LetterRevealAnimation;
