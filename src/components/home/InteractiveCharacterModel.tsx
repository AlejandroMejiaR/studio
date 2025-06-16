"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Props for this wrapper component, should match what CharacterModelRenderer expects, plus containerClassName
export interface InteractiveCharacterModelProps {
  modelUrl: string;
  idleAnimUrl: string;
  dance1AnimUrl: string;
  dance2AnimUrl: string;
  endClapAnimUrl: string;
  containerClassName?: string;
}

// Dynamically import the actual renderer.
// The loading component here is a secondary one, the primary is in page.tsx's dynamic import.
const CharacterModelRenderer = dynamic(
  () => import('./CharacterModelRenderer').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        {/* This loading state is usually covered by the one in page.tsx dynamic import */}
        {/* <p className="text-muted-foreground text-sm">Initializing 3D Scene...</p> */}
      </div>
    )
  }
);

const InteractiveCharacterModel: FC<InteractiveCharacterModelProps> = ({ 
  containerClassName, 
  ...rendererProps // Spread the rest of the props to CharacterModelRenderer
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This effect runs only on the client after the component mounts.
    setIsMounted(true);
  }, []);

  return (
    <div className={containerClassName} style={{ width: '100%', height: '100%' }}>
      {isMounted ? (
        <CharacterModelRenderer {...rendererProps} />
      ) : (
        // Fallback content before client-side mount, usually handled by page.tsx's dynamic import loading state.
        // If page.tsx's loading covers it, this can be null.
        // Keeping a minimal placeholder in case this wrapper renders before parent's loading state resolves.
        <div className="w-full h-full flex items-center justify-center bg-transparent">
             {/* This placeholder is mostly superseded by the loading UI in page.tsx */}
        </div>
      )}
    </div>
  );
};

export default InteractiveCharacterModel;