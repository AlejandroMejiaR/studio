
import { useState, useEffect } from "react";

export type ScreenSize = 'mobile' | 'tablet' | 'desktop';

const getScreenSize = (width: number): ScreenSize => {
  if (width < 768) {
    return 'mobile';
  }
  if (width < 1024) {
    return 'tablet';
  }
  return 'desktop';
};

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize(window.innerWidth));
    };

    // Set the initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}
