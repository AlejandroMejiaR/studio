
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
}

const TypingAnimation: FC<TypingAnimationProps> = ({
  text,
  speed = 50, // Default speed in milliseconds per character
  className,
  cursorClassName = 'inline-block w-[2px] h-[1.2em] ml-1 bg-foreground animate-blink-cursor align-text-bottom',
  startDelay = 0, // Delay in seconds
  style,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  // isReadyToStart will be true if startDelay is 0, otherwise effect handles it.
  const [isReadyToStart, setIsReadyToStart] = useState(startDelay === 0);

  useEffect(() => {
    // This effect handles setting isReadyToStart after startDelay.
    // It re-runs if startDelay changes or if isReadyToStart changes (e.g. from false to true by this effect).
    if (startDelay > 0 && !isReadyToStart) {
      const delayTimeout = setTimeout(() => {
        setIsReadyToStart(true);
      }, startDelay * 1000); // Convert seconds to milliseconds
      return () => clearTimeout(delayTimeout);
    } else if (startDelay <= 0 && !isReadyToStart) {
      // If delay is 0 or less, and not yet ready, become ready immediately.
      // This also handles cases where startDelay might change to 0.
      setIsReadyToStart(true);
    }
  }, [startDelay, isReadyToStart]);

  useEffect(() => {
    if (!isReadyToStart) {
      // If not ready to start, ensure displayed text is empty and typing is not complete.
      // This is important if the component re-renders with a new text/delay before previous one finished.
      if (displayedText !== '') setDisplayedText('');
      if (isTypingComplete) setIsTypingComplete(false);
      return;
    }

    if (displayedText.length < text.length) {
      setIsTypingComplete(false);
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    } else {
      if (text.length > 0) {
        setIsTypingComplete(true);
      } else { 
        // Handles case where text becomes empty string
        setIsTypingComplete(false);
        if (displayedText !== '') setDisplayedText('');
      }
    }
  }, [displayedText, text, speed, isReadyToStart]);

  // If text is empty and we are ready (meaning delay passed or was 0), and displayedText is also empty, render null.
  if (!text && isReadyToStart && displayedText === '') return null;


  return (
    <span className={cn(className)} style={style}>
      {displayedText}
      {isReadyToStart && ( // Only show cursor if we are past the delay
        <span className={cn(
          cursorClassName,
          { 'opacity-0': isTypingComplete && displayedText.length === text.length }
        )} />
      )}
    </span>
  );
};

export default TypingAnimation;
