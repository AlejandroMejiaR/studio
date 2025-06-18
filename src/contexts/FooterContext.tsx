
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
  // Default to false. Effects will manage visibility.
  // This helps prevent flash on homepage, as page.tsx will explicitly show it if needed.
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    if (pathname === '/') {
      // On the homepage, isFooterVisible starts as false (from useState).
      // src/app/page.tsx's IntersectionObserver is responsible for setting it to true
      // if the 'About Me' section is initially in view, or later when scrolled to.
      // If page.tsx determines "About Me" is not in view, it will call setIsFooterVisible(false),
      // confirming the initial state.
    } else {
      // For all other pages, ensure the footer is visible.
      setIsFooterVisible(true);
    }
  }, [pathname, setIsFooterVisible]); // setIsFooterVisible added for exhaustive-deps

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
