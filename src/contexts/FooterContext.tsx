
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
  // It ensures the footer is hidden by default on the homepage and shown on all other pages.
  useEffect(() => {
    if (pathname === '/') {
      // On the homepage, the footer's visibility is controlled by an IntersectionObserver.
      // We initially hide it to prevent flickering on load.
      setIsFooterVisible(false);
    } else {
      // On all other pages, the footer should be visible.
      setIsFooterVisible(true);
    }
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
