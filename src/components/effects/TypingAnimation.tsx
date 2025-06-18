
"use client";

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string; // Class for the span wrapping text + cursor
  cursorClassName?: string;
  startDelay?: number; // Optional delay before starting animation
  style?: React.CSSProperties; // Added style prop
}

const TypingAnimation: FC<TypingAnimationProps> = ({
  text,
  speed = 50, // Default speed in milliseconds per character
  className,
  cursorClassName = 'inline-block w-[2px] h-[1.2em] ml-1 bg-foreground animate-blink-cursor align-text-bottom',
  startDelay = 0,
  style, // Destructure style prop
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(startDelay === 0);

  useEffect(() => {
    if (startDelay > 0 && !isReadyToStart) {
      const delayTimeout = setTimeout(() => {
        setIsReadyToStart(true);
      }, startDelay);
      return () => clearTimeout(delayTimeout);
    }
  }, [startDelay, isReadyToStart]);

  useEffect(() => {
    if (!isReadyToStart) return;

    if (displayedText.length < text.length) {
      setIsTypingComplete(false);
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    } else {
      if (text.length > 0) {
        setIsTypingComplete(true);
      }
    }
  }, [displayedText, text, speed, isReadyToStart]);

  if (!text && isReadyToStart && displayedText === '') return null;

  return (
    <span className={cn(className)} style={style}> {/* Apply the passed style */}
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
