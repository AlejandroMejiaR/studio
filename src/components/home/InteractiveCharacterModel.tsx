"use client";

import type { FC } from 'react';
// Static import for the renderer. It will only be processed client-side
// because InteractiveCharacterModel itself is dynamically imported with ssr:false from page.tsx.
import CharacterModelRenderer, { type CharacterModelRendererProps } from './CharacterModelRenderer';

// Props for this wrapper component now directly extend CharacterModelRendererProps
export interface InteractiveCharacterModelProps extends CharacterModelRendererProps {
  containerClassName?: string;
}

const InteractiveCharacterModel: FC<InteractiveCharacterModelProps> = ({
  containerClassName,
  // Spread the rest of the props (modelUrl, animUrls) to CharacterModelRenderer
  ...rendererProps
}) => {
  // This component is guaranteed to run on the client because it's dynamically imported
  // with ssr:false in page.tsx. No further client-side checks needed here for rendering.
  return (
    <div className={containerClassName} style={{ width: '100%', height: '100%' }}>
      <CharacterModelRenderer {...rendererProps} />
    </div>
  );
};

export default InteractiveCharacterModel;