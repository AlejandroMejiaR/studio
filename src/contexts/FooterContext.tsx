
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface FooterContextType {
  isFooterVisible: boolean;
  setIsFooterVisible: Dispatch<SetStateAction<boolean>>;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  // This effect synchronizes the footer's visibility based on the current route.
  useEffect(() => {
    // Footer is now visible on all pages by default.
    // The logic to hide it on the homepage via IntersectionObserver has been removed.
    setIsFooterVisible(true);
  }, [pathname]);

  return (
    <FooterContext.Provider value={{ isFooterVisible, setIsFooterVisible }}>
      {children}
    </FooterContext.Provider>
  );
};

export const useFooter = (): FooterContextType => {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};
