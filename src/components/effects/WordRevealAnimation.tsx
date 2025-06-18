
"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';
import LetterRevealAnimation from './LetterRevealAnimation';
import React from 'react';

interface WordRevealAnimationProps {
  text: string; // A single line of text
  lineBaseDelay?: number; // Delay before this entire line's animation sequence begins
  delayBetweenWords?: number; // Pause duration AFTER one word finishes animating and BEFORE the next word starts its animation
  letterStaggerDelay?: number; // Passed to LetterRevealAnimation for intra-word letter staggering
  letterAnimationDuration?: number; // Passed to LetterRevealAnimation for individual letter animation duration
  className?: string; // Class for the root span of this component (the line container)
  wordClassName?: string; // Optional class for the span wrapping each word
  letterClassName?: string; // Optional class passed to LetterRevealAnimation for individual letters
  style?: React.CSSProperties;
}

const WordRevealAnimation: FC<WordRevealAnimationProps> = ({
  text,
  lineBaseDelay = 0,
  delayBetweenWords = 0.1,
  letterStaggerDelay = 0.05,
  letterAnimationDuration = 0.6,
  className,
  wordClassName,
  letterClassName,
  style,
}) => {
  const words = text.split(' ').filter(word => word.length > 0);
  const animatedElements: React.ReactNode[] = [];
  let currentCumulativeDelayForThisLine = lineBaseDelay;

  words.forEach((word, wordIndex) => {
    // Determine the delay to add *before* this word starts, if it's not the first word.
    // This delay is the pause *between* the previous word finishing and this word starting.
    if (wordIndex > 0) {
      const prevWord = words[wordIndex - 1];
      const currentWord = words[wordIndex];
      
      let actualInterWordDelay = delayBetweenWords; // Default delay
      
      // Check for specific pairs to remove the delay
      if ((prevWord === "Ideas" && currentWord === "Into") || (prevWord === "Ideas" && currentWord === "En")) {
        actualInterWordDelay = 0; // No pause for these specific pairs
      }
      currentCumulativeDelayForThisLine += actualInterWordDelay;
    }
    // currentCumulativeDelayForThisLine is now the actual start time for *this* word's animation.

    animatedElements.push(
      <span key={`${word}-${wordIndex}-wrapper-${text.substring(0,5)}`} className={cn('inline-block whitespace-nowrap', wordClassName)}>
        <LetterRevealAnimation
          key={`${word}-${wordIndex}-${text.substring(0,5)}`}
          text={word}
          baseDelay={currentCumulativeDelayForThisLine} // This word starts animating at this time
          letterStaggerDelay={letterStaggerDelay}
          letterAnimationDuration={letterAnimationDuration}
          letterClassName={letterClassName}
        />
      </span>
    );

    // Calculate the duration of the current word's letter-by-letter animation
    const currentWordAnimationDuration = (word.length > 0 ? (word.length - 1) * letterStaggerDelay : 0) + letterAnimationDuration;
    // Advance currentCumulativeDelayForThisLine to be the time when *this* word *finishes* animating.
    currentCumulativeDelayForThisLine += currentWordAnimationDuration; 

    // Add a space span if not the last word on the line
    if (wordIndex < words.length - 1) {
      animatedElements.push(<span key={`space-${wordIndex}-${text.substring(0,5)}`} className="inline-block">&nbsp;</span>);
    }
  });

  return (
    <span className={cn(className)} style={style} aria-label={text}>
      {animatedElements.map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </span>
  );
};

export default WordRevealAnimation;
