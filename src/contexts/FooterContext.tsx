
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

interface FooterContextType {
  isFooterVisible: boolean;
  setIsFooterVisible: Dispatch<SetStateAction<boolean>>;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider = ({ children }: { children: ReactNode }) => {
  // Default to true. The footer should be visible on all pages by default.
  // Specific pages can override this if necessary, but it's no longer hidden
  // on the homepage by default.
  const [isFooterVisible, setIsFooterVisible] = useState(true);

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
