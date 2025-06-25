
"use client";

import { useState, useEffect, FC, Fragment } from 'react';
import React from 'react';
import { cn } from '@/lib/utils';

interface HighlightedWord {
  word: string;
  className: string;
}

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  cursorClassName?: string;
  startDelay?: number;
  style?: React.CSSProperties;
  onComplete?: () => void;
  punctuationChars?: string[];
  punctuationPauseFactor?: number;
  highlightedWords?: HighlightedWord[];
}

const TypingAnimation: FC<TypingAnimationProps> = ({
  text,
  speed = 80,
  className,
  cursorClassName = 'inline-block w-[2px] h-[1.2em] ml-1 bg-foreground animate-blink-cursor align-text-bottom',
  startDelay = 0,
  style,
  onComplete,
  punctuationChars = ['.', ',', '!', '?', ';', ':', '\n'],
  punctuationPauseFactor = 7,
  highlightedWords = [],
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(startDelay === 0);

  useEffect(() => {
    if (startDelay > 0 && !isReadyToStart) {
      const delayTimeout = setTimeout(() => {
        setIsReadyToStart(true);
      }, startDelay * 1000);
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

    if (displayedText.length < text.length) {
      setIsTypingComplete(false); // Ensure it's false while typing
      
      let currentSpeed = speed;
      // Check the character that was just typed for punctuation to add a pause.
      if (displayedText.length > 0 && punctuationChars.includes(text[displayedText.length - 1])) {
        currentSpeed = speed * punctuationPauseFactor;
      }

      const timeoutId = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, currentSpeed);
      return () => clearTimeout(timeoutId);
    } else {
      // Typing is complete or text is empty.
      if (text.length > 0) {
        if (!isTypingComplete) {
          // This block should only ever run ONCE when typing finishes to prevent loops.
          setIsTypingComplete(true);
          onComplete?.(); // Safely call onComplete here.
        }
      } else {
        // Text is empty, so reset state.
        if (isTypingComplete) setIsTypingComplete(false);
        if (displayedText !== '') setDisplayedText('');
      }
    }
    // The dependency array is intentionally causing a controlled loop for the typing effect.
    // The logic inside the effect handles the start and stop conditions to prevent an infinite loop.
  }, [displayedText, text, speed, isReadyToStart, onComplete, isTypingComplete, punctuationChars, punctuationPauseFactor]);

  const renderTextWithHighlights = () => {
    if (!isReadyToStart) return null;
    if (highlightedWords.length === 0) return displayedText;

    // Build a regex to find all highlighted words. Escape special characters.
    const allWordsRegex = highlightedWords.map(h => h.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${allWordsRegex.join('|')})`, 'g');
    
    // Split the text into parts: normal text and highlighted words.
    const parts = text.split(regex).filter(Boolean);
    const highlightedMap = new Map(highlightedWords.map(h => [h.word, h.className]));
    
    const typedJsx: React.ReactNode[] = [];
    let charsTypedSoFar = 0;
    const totalCharsToDisplay = displayedText.length;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const charsLeftToType = totalCharsToDisplay - charsTypedSoFar;
        if (charsLeftToType <= 0) break;

        const isHighlight = highlightedMap.has(part);
        const partToDisplay = part.substring(0, charsLeftToType);

        if (isHighlight) {
            typedJsx.push(<span key={i} className={highlightedMap.get(part)}>{partToDisplay}</span>);
        } else {
            typedJsx.push(<Fragment key={i}>{partToDisplay}</Fragment>);
        }

        charsTypedSoFar += part.length;
    }
    
    return <>{typedJsx}</>;
  }

  if (!text && isReadyToStart && displayedText === '') return null;

  return (
    <span className={cn(className)} style={style}>
      {renderTextWithHighlights()}
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
