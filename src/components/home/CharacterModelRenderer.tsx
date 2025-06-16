"use client";

import type { FC } from 'react';
import { Suspense, useRef, useState, useEffect } from 'react'; // Added useState back
import { Canvas } from '@react-three/fiber';
import { useGLTF, useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export interface CharacterModelRendererProps {
  modelUrl: string;
  idleAnimUrl: string;
  dance1AnimUrl: string;
  dance2AnimUrl: string;
  endClapAnimUrl: string;
}

const CharacterModelRenderer: FC<CharacterModelRendererProps> = ({
  modelUrl,
  idleAnimUrl,
  dance1AnimUrl,
  dance2AnimUrl,
  endClapAnimUrl,
}) => {
  const modelRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(modelUrl);

  const idleFbx = useFBX(idleAnimUrl);
  const dance1Fbx = useFBX(dance1AnimUrl);
  const dance2Fbx = useFBX(dance2AnimUrl);
  const endClapFbx = useFBX(endClapAnimUrl);

  const animationsInput = [];
  if (idleFbx.animations.length > 0) {
    idleFbx.animations[0].name = 'idle';
    animationsInput.push(idleFbx.animations[0]);
  }
  if (dance1Fbx.animations.length > 0) {
    dance1Fbx.animations[0].name = 'dance1';
    animationsInput.push(dance1Fbx.animations[0]);
  }
  if (dance2Fbx.animations.length > 0) {
    // Ensure this name 'dance' matches the key used in actions (e.g., actions.dance)
    dance2Fbx.animations[0].name = 'dance'; 
    animationsInput.push(dance2Fbx.animations[0]);
  }
  if (endClapFbx.animations.length > 0) {
    endClapFbx.animations[0].name = 'endClap';
    animationsInput.push(endClapFbx.animations[0]);
  }
  
  const { actions, mixer } = useAnimations(animationsInput, modelRef);
  const [isInteracting, setIsInteracting] = useState(false);

  const onAnimationFinished = (event: THREE.Event & { action: THREE.AnimationAction}) => {
    if (!actions.dance1 || !actions.dance || !actions.endClap || !actions.idle || !mixer) return;

    const currentAction = event.action;
    let nextAction: THREE.AnimationAction | null = null;

    if (currentAction === actions.dance1) nextAction = actions.dance;
    else if (currentAction === actions.dance) nextAction = actions.endClap;
    else if (currentAction === actions.endClap) nextAction = actions.idle;

    // It's important to fade out the current action
    currentAction.fadeOut(0.3);

    if (nextAction) {
      nextAction.reset().fadeIn(0.3).play();
      if (nextAction === actions.idle) {
        setIsInteracting(false); // Unlock interaction when idle animation starts
        // Remove listener specific to this sequence
        mixer.removeEventListener('finished', onAnimationFinished as (e: THREE.Event) => void);
      }
    } else {
      // Fallback if nextAction is not determined, go to idle
      actions.idle.reset().fadeIn(0.3).play();
      setIsInteracting(false);
      mixer.removeEventListener('finished', onAnimationFinished as (e: THREE.Event) => void);
    }
  };
  
  useEffect(() => {
    if (actions.idle) {
      actions.idle.reset().play();
    }
    // Cleanup function for when the component unmounts or dependencies change
    return () => {
      mixer?.stopAllAction();
      mixer?.removeEventListener('finished', onAnimationFinished as (e: THREE.Event) => void);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, mixer]); // Mixer should be stable, actions might change if animationsInput changes

  const handleInteraction = () => {
    if (isInteracting || !actions.idle || !actions.dance1 || !actions.dance || !actions.endClap || !mixer) return;

    setIsInteracting(true);
    // Add the listener for the current interaction sequence
    mixer.addEventListener('finished', onAnimationFinished as (e: THREE.Event) => void);

    actions.idle.fadeOut(0.5);
    
    // Ensure dance animations are configured to play once
    const animsToConfigure = [actions.dance1, actions.dance, actions.endClap];
    animsToConfigure.forEach(action => {
      if (action) {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true; // Important for sequence
      }
    });
    
    actions.dance1.reset().fadeIn(0.5).play();
  };
  
  const modelScale = 1; 
  const modelHeight = 1.8 * modelScale; 

  return (
    <Canvas
      gl={{ alpha: true }}
      style={{ background: 'transparent', touchAction: 'none' }} // touchAction: 'none' can help with mobile interactions
      camera={{ position: [0, modelHeight * 0.6, 3 * modelScale], fov: 50 }} 
      shadows // Enable shadows for the canvas
    >
      <ambientLight intensity={1.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={2.5} 
        castShadow // Light will cast shadows
        shadow-mapSize-width={1024} // Shadow map quality
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 5, -5]} intensity={1} /> 
      <Suspense fallback={null}> {/* Fallback for useGLTF/useFBX */}
        <primitive 
          object={scene} 
          ref={modelRef} 
          scale={modelScale} 
          onClick={handleInteraction}
          position={[0, -modelHeight / 2, 0]} // Adjust Y to place feet at origin if pivot is at center
          castShadow // Model will cast shadows
          receiveShadow // Model will receive shadows (e.g., on itself if applicable)
        />
      </Suspense>
      {/* <OrbitControls /> */} {/* Uncomment for debugging camera/model placement */}
    </Canvas>
  );
};

export default CharacterModelRenderer;