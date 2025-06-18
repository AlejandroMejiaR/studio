
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
  const charactersWithOriginalIndices = text.split('').map((char, index) => ({ char, originalIndex: index }));
  const segments = text.split(/(\s+)/).filter(segment => segment.length > 0);
  let charCounterInOriginalText = 0;

  return (
    <span className={cn("flex flex-wrap", className)} aria-label={text} style={style}>
      {segments.flatMap((segment, segmentIndex) => {
        // Whitespace segment
        if (segment.match(/^\s+$/)) {
          return segment.split('').map(() => {
            if (charCounterInOriginalText >= charactersWithOriginalIndices.length) return null;
            
            const charDetail = charactersWithOriginalIndices[charCounterInOriginalText++];
            const delay = charDetail.originalIndex * staggerDelay;
            return (
              <span
                key={`char-${charDetail.originalIndex}-space`}
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
                {' '} {/* Use a regular space here */}
              </span>
            );
          }).filter(Boolean);
        }
        
        // Word segment
        const animatedLetters = segment.split('').map(() => {
          if (charCounterInOriginalText >= charactersWithOriginalIndices.length) return null;

          const charDetail = charactersWithOriginalIndices[charCounterInOriginalText++];
          const delay = charDetail.originalIndex * staggerDelay;
          return (
            <span
              key={`char-${charDetail.originalIndex}-letter`}
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
              {charDetail.char}
            </span>
          );
        }).filter(Boolean);

        if (animatedLetters.length === 0) {
          return null; 
        }

        return (
          <span key={`word-${segmentIndex}-${charCounterInOriginalText}`} className="inline-block whitespace-nowrap">
            {animatedLetters}
          </span>
        );
      }).filter(Boolean)}
    </span>
  );
};

export default LetterRevealAnimation;
