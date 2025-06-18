
"use client";

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string; // Class for the span wrapping text + cursor
  cursorClassName?: string;
  startDelay?: number; // Optional delay before starting animation, in seconds
  style?: React.CSSProperties;
  onComplete?: () => void; // Callback for when animation completes
}

const TypingAnimation: FC<TypingAnimationProps> = ({
  text,
  speed = 50, // Default speed in milliseconds per character
  className,
  cursorClassName = 'inline-block w-[2px] h-[1.2em] ml-1 bg-foreground animate-blink-cursor align-text-bottom',
  startDelay = 0, // Delay in seconds
  style,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(startDelay === 0);

  useEffect(() => {
    if (startDelay > 0 && !isReadyToStart) {
      const delayTimeout = setTimeout(() => {
        setIsReadyToStart(true);
      }, startDelay * 1000); // Convert seconds to milliseconds
      return () => clearTimeout(delayTimeout);
    } else if (startDelay <= 0 && !isReadyToStart) {
      setIsReadyToStart(true);
    }
  }, [startDelay, isReadyToStart]);

  useEffect(() => {
    if (!isReadyToStart) {
      if (displayedText !== '') setDisplayedText('');
      if (isTypingComplete) setIsTypingComplete(false);
      return;
    }

    let animationFinished = false;
    if (displayedText.length < text.length) {
      setIsTypingComplete(false);
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    } else {
      if (text.length > 0) {
        if (!isTypingComplete) { // Call onComplete only once when it transitions to complete
          setIsTypingComplete(true);
          animationFinished = true;
        }
      } else {
        setIsTypingComplete(false);
        if (displayedText !== '') setDisplayedText('');
      }
    }
    if(animationFinished && onComplete) {
        onComplete();
    }
  }, [displayedText, text, speed, isReadyToStart, onComplete, isTypingComplete]);

  if (!text && isReadyToStart && displayedText === '') return null;

  return (
    <span className={cn(className)} style={style}>
      {displayedText}
      {isReadyToStart && (
        <span className={cn(
          cursorClassName,
          { 'opacity-0': isTypingComplete && displayedText.length === text.length }
        )} />
      )}
    </span>
  );
};

export default TypingAnimation;
