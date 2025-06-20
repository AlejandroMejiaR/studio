
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

interface NavbarVisibilityContextType {
  isNavbarVisible: boolean;
  setIsNavbarVisible: Dispatch<SetStateAction<boolean>>;
  isNavbarReadyToAnimateIn: boolean; // Added
  setNavbarReadyToAnimateIn: Dispatch<SetStateAction<boolean>>; // Added
}

const NavbarVisibilityContext = createContext<NavbarVisibilityContextType | undefined>(undefined);

export const NavbarVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isNavbarReadyToAnimateIn, setNavbarReadyToAnimateIn] = useState(false); // Added

  return (
    <NavbarVisibilityContext.Provider value={{ 
      isNavbarVisible, 
      setIsNavbarVisible,
      isNavbarReadyToAnimateIn, // Added
      setNavbarReadyToAnimateIn  // Added
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
