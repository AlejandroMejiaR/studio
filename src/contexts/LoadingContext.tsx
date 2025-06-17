
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextType {
  isPageLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

const DEFAULT_LOADING_TEXT = "Loading...";

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string>(DEFAULT_LOADING_TEXT);

  const showLoading = useCallback((text?: string) => {
    setLoadingText(text || DEFAULT_LOADING_TEXT);
    setIsPageLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsPageLoading(false);
    setLoadingText(DEFAULT_LOADING_TEXT); // Reset text on hide
  }, []);

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
