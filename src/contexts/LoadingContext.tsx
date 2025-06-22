
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';

interface LoadingContextType {
  isPageLoading: boolean;
  loadingText: string;
  showLoading: (messages?: string[]) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const getDynamicDefaultMessages = useCallback((): string[] => {
    const defaultMessages = isClientReady 
      ? translationsForLanguage.loadingScreen.defaultText 
      : getEnglishTranslation(t => t.loadingScreen.defaultText);
    return defaultMessages || ["Loading..."];
  }, [isClientReady, translationsForLanguage, getEnglishTranslation]);

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string>(getDynamicDefaultMessages()[0]);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const showLoading = useCallback((messages?: string[]) => {
    const newMessages = messages && messages.length > 0 ? messages : getDynamicDefaultMessages();
    setMessageQueue(newMessages);
    setLoadingText(newMessages[0] || getDynamicDefaultMessages()[0]);
    setIsPageLoading(true);
  }, [getDynamicDefaultMessages]);

  const hideLoading = useCallback(() => {
    setIsPageLoading(false);
  }, []);

  // Effect to manage the interval for changing text
  useEffect(() => {
    // Clear any existing interval when loading state changes or messages change
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPageLoading && messageQueue.length > 1) {
      // Start a new interval
      let currentIndex = 0;
      intervalRef.current = setInterval(() => {
        currentIndex = (currentIndex + 1) % messageQueue.length;
        setLoadingText(messageQueue[currentIndex]);
      }, 2500); // Change text every 2.5 seconds
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPageLoading, messageQueue]);

  return (
    <LoadingContext.Provider value={{ isPageLoading, loadingText, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
