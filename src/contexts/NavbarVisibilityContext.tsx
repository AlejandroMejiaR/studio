
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

interface NavbarVisibilityContextType {
  isNavbarVisible: boolean;
  setIsNavbarVisible: Dispatch<SetStateAction<boolean>>;
}

const NavbarVisibilityContext = createContext<NavbarVisibilityContextType | undefined>(undefined);

export const NavbarVisibilityProvider = ({ children }: { children: ReactNode }) => {
  // Default to true. Homepage will manage setting it to false during animations.
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  return (
    <NavbarVisibilityContext.Provider value={{ isNavbarVisible, setIsNavbarVisible }}>
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
