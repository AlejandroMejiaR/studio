
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarVisibilityContextType {
  shouldNavbarContentBeVisible: boolean;
  setShouldNavbarContentBeVisible: Dispatch<SetStateAction<boolean>>;
  showLanguageHint: boolean;
  setShowLanguageHint: Dispatch<SetStateAction<boolean>>;
}

const NavbarVisibilityContext = createContext<NavbarVisibilityContextType | undefined>(undefined);

export const NavbarVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [shouldNavbarContentBeVisible, setShouldNavbarContentBeVisible] = useState(false);
  const [showLanguageHint, setShowLanguageHint] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') {
      setShouldNavbarContentBeVisible(true);
    }
  }, [pathname]);

  return (
    <NavbarVisibilityContext.Provider value={{ 
      shouldNavbarContentBeVisible, 
      setShouldNavbarContentBeVisible,
      showLanguageHint,
      setShowLanguageHint,
    }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

export const useNavbarVisibility = (): NavbarVisibilityContextType => {
  const context = useContext(NavbarVisibilityContext);
  if (context === undefined) {
    throw new Error('useNavbarVisibility must be used within a NavbarVisibilityProvider');
  }
  return context;
};
