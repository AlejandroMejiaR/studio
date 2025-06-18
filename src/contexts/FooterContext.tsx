
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
  // Default to true, so footer is visible on non-homepage routes or if observer logic isn't active
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  useEffect(() => {
    // If on the homepage, the page itself will control visibility via IntersectionObserver.
    // If not on the homepage, ensure footer is visible.
    if (pathname !== '/') {
      setIsFooterVisible(true);
    }
    // For the homepage, src/app/page.tsx will set the initial state
    // based on whether the 'about' section is initially in view or not.
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
