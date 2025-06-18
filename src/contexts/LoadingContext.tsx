
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLanguage } from './LanguageContext'; // Import useLanguage

interface LoadingContextType {
  isPageLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();
  
  const getDynamicDefaultLoadingText = useCallback(() => {
    return isClientReady 
      ? translationsForLanguage.loadingScreen.defaultText 
      : getEnglishTranslation(t => t.loadingScreen.defaultText) || "Loading...";
  }, [isClientReady, translationsForLanguage, getEnglishTranslation]);

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string>(getDynamicDefaultLoadingText());

  // Update loadingText if language changes while it's using the default
  useEffect(() => {
    if (!isPageLoading || loadingText === getDynamicDefaultLoadingText()) {
        // If not loading, or if loading and current text is the (potentially old) default, update to new default
        setLoadingText(getDynamicDefaultLoadingText());
    }
    // This effect should re-run if the default loading text changes (due to language switch)
  }, [getDynamicDefaultLoadingText, isPageLoading, loadingText]);


  const showLoading = useCallback((text?: string) => {
    setLoadingText(text || getDynamicDefaultLoadingText());
    setIsPageLoading(true);
  }, [getDynamicDefaultLoadingText]);

  const hideLoading = useCallback(() => {
    setIsPageLoading(false);
    setLoadingText(getDynamicDefaultLoadingText()); // Reset text on hide
  }, [getDynamicDefaultLoadingText]);

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
