
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarVisibilityContextType {
  shouldNavbarContentBeVisible: boolean;
  setShouldNavbarContentBeVisible: Dispatch<SetStateAction<boolean>>;
}

const NavbarVisibilityContext = createContext<NavbarVisibilityContextType | undefined>(undefined);

export const NavbarVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [shouldNavbarContentBeVisible, setShouldNavbarContentBeVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // This effect ensures that when navigating away from the homepage,
    // the navbar content becomes visible immediately if it was hidden.
    // For the homepage itself, its visibility is primarily controlled by HomePage.tsx.
    if (pathname !== '/') {
      setShouldNavbarContentBeVisible(true);
    }
    // If navigating TO the homepage, HomePage.tsx will set it to false if animations are running.
  }, [pathname]);

  return (
    <NavbarVisibilityContext.Provider value={{ 
      shouldNavbarContentBeVisible, 
      setShouldNavbarContentBeVisible,
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
