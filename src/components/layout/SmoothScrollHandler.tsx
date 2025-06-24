'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function SmoothScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // This handles scrolling when navigating TO a page with a hash.
    // The onClick handlers will manage same-page hash scrolling.
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Using a timeout to ensure the element is rendered and painted,
        // especially after a page transition.
        const timer = setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
        return () => clearTimeout(timer); // Cleanup timer on unmount or re-run
      }
    }
  }, [pathname]); // Effect runs when the pathname changes

  return null;
}
