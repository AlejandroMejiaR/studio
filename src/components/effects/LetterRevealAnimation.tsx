
"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface LetterRevealAnimationProps {
  text: string;
  staggerDelay?: number; // Delay between each letter's animation start (in seconds)
  animationDuration?: number; // Duration of each letter's animation (in seconds)
  className?: string; // Class for the container span
  letterClassName?: string; // Class for individual letter spans
  style?: React.CSSProperties; // Added style prop
}

const LetterRevealAnimation: FC<LetterRevealAnimationProps> = ({
  text,
  staggerDelay = 0.05,
  animationDuration = 0.6,
  className,
  letterClassName,
  style, // Destructure style prop
}) => {
  const charactersWithOriginalIndices = text.split('').map((char, index) => ({ char, originalIndex: index }));
  const segments = text.split(/(\s+)/).filter(segment => segment.length > 0);
  let charCounterInOriginalText = 0;

  return (
    <span className={cn(className)} aria-label={text} style={style}>
      {segments.flatMap((segment, segmentIndex) => {
        if (segment.match(/^\s+$/)) { // It's a whitespace segment
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
                {'\u00A0'} {/* Use non-breaking space */}
              </span>
            );
          }).filter(Boolean);
        }
        // It's a word segment
        return [(
          <span key={`word-${segmentIndex}`} className="inline-block whitespace-nowrap">
            {segment.split('').map(() => {
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
            }).filter(Boolean)}
          </span>
        )];
      })}
    </span>
  );
};

export default LetterRevealAnimation;
