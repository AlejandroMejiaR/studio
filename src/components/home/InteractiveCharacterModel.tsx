
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
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
    dynamic(() => import('./CharacterModelRenderer'), { ssr: false })
      .then(mod => setClientRenderer(() => mod.default))
      .catch(err => console.error("Failed to load CharacterModelRenderer", err));
  }, []);

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
