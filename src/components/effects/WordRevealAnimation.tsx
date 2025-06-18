
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
  let currentWordStartDelay = lineBaseDelay;

  words.forEach((word, wordIndex) => {
    if (wordIndex > 0) {
         currentWordStartDelay += delayBetweenWords;
    }

    animatedElements.push(
      <span key={`${word}-${wordIndex}-wrapper`} className={cn('inline-block whitespace-nowrap', wordClassName)}>
        <LetterRevealAnimation
          key={`${word}-${wordIndex}`}
          text={word}
          baseDelay={currentWordStartDelay}
          letterStaggerDelay={letterStaggerDelay}
          letterAnimationDuration={letterAnimationDuration}
          letterClassName={letterClassName}
        />
      </span>
    );

    const wordItselfAnimationDuration = (word.length > 0 ? (word.length - 1) * letterStaggerDelay : 0) + letterAnimationDuration;
    currentWordStartDelay += wordItselfAnimationDuration;


    if (wordIndex < words.length - 1) {
      animatedElements.push(<span key={`space-${wordIndex}`} className="inline-block">&nbsp;</span>);
    }
  });

  return (
    <span className={cn(className)} style={style}>
      {animatedElements.map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </span>
  );
};

export default WordRevealAnimation;

