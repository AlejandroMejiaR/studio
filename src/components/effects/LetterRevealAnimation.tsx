
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
  // Filter out any zero-length segments that might result from split (e.g., from leading/trailing/multiple spaces)
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
                key={`char-${charDetail.originalIndex}`}
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
                {'\u00A0'} {/* Use non-breaking space for spaces */}
              </span>
            );
          }).filter(Boolean); // Filter out any nulls if charCounter went out of bounds
        }
        
        // Word segment
        const animatedLetters = segment.split('').map(() => {
          if (charCounterInOriginalText >= charactersWithOriginalIndices.length) return null;

          const charDetail = charactersWithOriginalIndices[charCounterInOriginalText++];
          const delay = charDetail.originalIndex * staggerDelay;
          return (
            <span
              key={`char-${charDetail.originalIndex}`}
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
        }).filter(Boolean); // Filter out any nulls if charCounter went out of bounds

        // If a "word" segment results in no animatable letters, return null for this segment.
        if (animatedLetters.length === 0) {
          // This also handles cases where a segment might have had length but all its characters
          // were somehow determined to be non-renderable (though current logic renders all chars).
          // If segment was genuinely empty and bypassed the initial filter, this also catches it.
          return null;
        }

        return ( // Return the word-wrapper span directly (flatMap handles flattening later)
          <span key={`word-${segmentIndex}-${charCounterInOriginalText}`} className="inline-block whitespace-nowrap">
            {animatedLetters}
          </span>
        );
      }).filter(Boolean) /* Filter out any nulls returned for empty/non-renderable word segments */ }
    </span>
  );
};

export default LetterRevealAnimation;
