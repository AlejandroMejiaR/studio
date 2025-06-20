
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
  // Default to false to prevent flash on homepage.
  // page.tsx will set it to true for homepage when appropriate.
  const [shouldNavbarContentBeVisible, setShouldNavbarContentBeVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // If not on the homepage, the navbar content should be visible.
    // For the homepage, its visibility is controlled by effects in page.tsx.
    if (pathname !== '/') {
      setShouldNavbarContentBeVisible(true);
    }
    // If on the homepage, and this effect runs before page.tsx's effect,
    // it might briefly be false, which is desired to prevent flash.
    // page.tsx will then take over.
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
