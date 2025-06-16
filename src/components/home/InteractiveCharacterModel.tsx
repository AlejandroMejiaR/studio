
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
// Ensure next/dynamic is imported if it were to be used at top level, but not for this specific fix.
// import dynamic from 'next/dynamic'; 
import type { CharacterModelRendererProps } from './CharacterModelRenderer';

// Props for this wrapper component
export interface InteractiveCharacterModelProps extends CharacterModelRendererProps {
  containerClassName?: string;
}

const InteractiveCharacterModel: FC<InteractiveCharacterModelProps> = ({
  containerClassName = "w-full h-full",
  ...rendererProps // Contains modelUrl, idleAnimUrl, etc.
}) => {
  const [ClientRenderer, setClientRenderer] = useState<FC<CharacterModelRendererProps> | null>(null);

  useEffect(() => {
    // Dynamically import CharacterModelRenderer only on the client
    // Use standard dynamic import() which returns a Promise
    import('./CharacterModelRenderer') 
      .then(mod => {
        if (mod.default) {
          setClientRenderer(() => mod.default);
        } else {
          console.error("Failed to load CharacterModelRenderer: Default export not found.");
        }
      })
      .catch(err => console.error("Failed to load CharacterModelRenderer", err));
  }, []); // Empty dependency array ensures this runs once on mount

  if (!ClientRenderer) {
    return (
      <div className={`${containerClassName} bg-muted/20 rounded-lg flex items-center justify-center animate-pulse`}>
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground text-sm">Initializing 3D Renderer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <ClientRenderer {...rendererProps} />
    </div>
  );
};

export default InteractiveCharacterModel;

