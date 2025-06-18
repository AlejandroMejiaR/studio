
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
  
  // Segments for layout: words are inline-block & nowrap, spaces are inline-block to allow breaking
  const segments = text.split(/(\s+)/).filter(segment => segment.length > 0); 

  let charCounterInOriginalText = 0; // Tracks the character position in the original text string

  return (
    <span className={cn(className)} aria-label={text} style={style}> {/* Root span is default (inline) */}
      {segments.flatMap((segment, segmentIndex) => { 
        if (segment.match(/^\s+$/)) { // It's a whitespace segment
          // Return an array of animated space characters directly
          return segment.split('').map((spaceChar) => {
            // Ensure we don't go out of bounds if original text had trailing spaces etc.
            if (charCounterInOriginalText >= charactersWithOriginalIndices.length) return null;
            
            const charDetail = charactersWithOriginalIndices[charCounterInOriginalText++];
            const delay = charDetail.originalIndex * staggerDelay;
            return (
              <span
                key={`char-${charDetail.originalIndex}`} // Unique key based on original character index
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
                {spaceChar} {/* Use the original space character directly */}
              </span>
            );
          }).filter(Boolean); // Filter out any nulls
        }
        // It's a word segment
        // Return an array containing a single word wrapper span
        return [(
          <span key={`word-${segmentIndex}`} className="inline-block whitespace-nowrap"> {/* Word is inline-block and won't break internally */}
            {segment.split('').map(() => {
              if (charCounterInOriginalText >= charactersWithOriginalIndices.length) return null;

              const charDetail = charactersWithOriginalIndices[charCounterInOriginalText++];
              const delay = charDetail.originalIndex * staggerDelay;
              return (
                <span
                  key={`char-${charDetail.originalIndex}`} // Unique key based on original character index
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
                  {charDetail.char} {/* Use char from charDetail to ensure consistency */}
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
