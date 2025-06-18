
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
  // Create a map of original character positions for accurate delay calculation
  const charactersWithOriginalIndices = text.split('').map((char, index) => ({ char, originalIndex: index }));
  
  // Segments for layout: words are inline-block & nowrap, spaces are inline to allow breaking
  const segments = text.split(/(\s+)/).filter(segment => segment.length > 0); 

  let charCounterInOriginalText = 0; // Tracks the character position in the original text string

  return (
    <span className={cn(className)} aria-label={text} style={style}> {/* Root span is default (inline) */}
      {segments.map((segment, segmentIndex) => {
        if (segment.match(/^\s+$/)) { // It's a whitespace segment
          // Render animated spaces
          return (
            <span key={`segment-${segmentIndex}`} className="inline"> {/* Whitespace container is inline */}
              {segment.split('').map((spaceChar, spaceIdx) => {
                // Ensure we don't go out of bounds if original text had trailing spaces etc.
                if (charCounterInOriginalText >= charactersWithOriginalIndices.length) return null;
                
                const charDetail = charactersWithOriginalIndices[charCounterInOriginalText++];
                const delay = (text.length - 1 - charDetail.originalIndex) * staggerDelay;
                return (
                  <span
                    key={`space-${segmentIndex}-${spaceIdx}`}
                    className={cn(
                      "inline-block opacity-0 animate-letter-reveal", // Each space char is inline-block for animation
                      letterClassName
                    )}
                    style={{
                      animationDelay: `${delay}s`,
                      animationDuration: `${animationDuration}s`,
                    }}
                    aria-hidden="true"
                  >
                    {spaceChar === ' ' ? '\u00A0' : spaceChar}
                  </span>
                );
              })}
            </span>
          );
        }
        // It's a word segment
        return (
          <span key={`segment-${segmentIndex}`} className="inline-block whitespace-nowrap align-bottom"> {/* Word is inline-block and won't break internally */}
            {segment.split('').map((letter, letterIdx) => {
              if (charCounterInOriginalText >= charactersWithOriginalIndices.length) return null;

              const charDetail = charactersWithOriginalIndices[charCounterInOriginalText++];
              const delay = (text.length - 1 - charDetail.originalIndex) * staggerDelay;
              return (
                <span
                  key={`letter-${segmentIndex}-${letterIdx}`}
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
                  {letter}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
};

export default LetterRevealAnimation;
