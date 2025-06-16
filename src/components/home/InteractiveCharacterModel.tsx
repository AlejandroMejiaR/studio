
"use client";

import type { FC } from 'react';
import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveCharacterModelProps {
  modelUrl: string;
  idleAnimUrl: string;
  dance1AnimUrl: string;
  dance2AnimUrl: string; // Assuming 'animation_Dance.fbx' is a second distinct dance
  endClapAnimUrl: string;
  containerClassName?: string;
}

// This sub-component contains the actual R3F logic and will only be rendered on the client
// due to the dynamic import in page.tsx.
const CharacterModel: FC<Omit<InteractiveCharacterModelProps, 'containerClassName'>> = ({
  modelUrl,
  idleAnimUrl,
  dance1AnimUrl,
  dance2AnimUrl,
  endClapAnimUrl,
}) => {
  const modelRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(modelUrl);

  // Load FBX animations and assign names
  const idleFbx = useFBX(idleAnimUrl);
  const dance1Fbx = useFBX(dance1AnimUrl);
  const dance2Fbx = useFBX(dance2AnimUrl);
  const endClapFbx = useFBX(endClapAnimUrl);

  const animations = [];
  if (idleFbx.animations.length > 0) {
    idleFbx.animations[0].name = 'idle';
    animations.push(idleFbx.animations[0]);
  }
  if (dance1Fbx.animations.length > 0) {
    dance1Fbx.animations[0].name = 'dance1';
    animations.push(dance1Fbx.animations[0]);
  }
  if (dance2Fbx.animations.length > 0) {
    dance2Fbx.animations[0].name = 'dance'; // Named 'dance' for mapping to actions.dance
    animations.push(dance2Fbx.animations[0]);
  }
  if (endClapFbx.animations.length > 0) {
    endClapFbx.animations[0].name = 'endClap';
    animations.push(endClapFbx.animations[0]);
  }
  
  const { actions, mixer } = useAnimations(animations, modelRef);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (actions.idle) {
      actions.idle.reset().play();
    }
    // Store the callback in a variable to ensure the same function reference is used for add/remove
    const handleAnimationFinished = (event: THREE.Event & { action: THREE.AnimationAction }) => {
      onAnimationFinished(event);
    };

    return () => {
      mixer?.stopAllAction();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mixer?.removeEventListener('finished', handleAnimationFinished as (e: THREE.Event) => void);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, mixer]); // mixer dependency added as it's used in cleanup

  // Keep onAnimationFinished stable with useCallback if actions/mixer are not expected to change often after init
  // or ensure its dependencies are correctly listed if it's recreated.
  // For simplicity here, assuming actions and mixer are stable after initial load.
  const onAnimationFinished = (event: THREE.Event & { action: THREE.AnimationAction}) => {
    if (!actions.dance1 || !actions.dance || !actions.endClap || !actions.idle || !mixer) return;

    const currentAction = event.action;
    let nextAction: THREE.AnimationAction | null = null;

    if (currentAction === actions.dance1) nextAction = actions.dance;
    else if (currentAction === actions.dance) nextAction = actions.endClap;
    else if (currentAction === actions.endClap) nextAction = actions.idle;

    currentAction.fadeOut(0.3);

    if (nextAction) {
      nextAction.reset().fadeIn(0.3).play();
      if (nextAction === actions.idle) {
        setIsInteracting(false);
        mixer.removeEventListener('finished', onAnimationFinished as (e: THREE.Event) => void);
      }
    }
  };


  const handleInteraction = () => {
    if (isInteracting || !actions.idle || !actions.dance1 || !actions.dance || !actions.endClap || !mixer) return;

    setIsInteracting(true);
    // Store the callback for removal
    const onFinishedCallback = (event: THREE.Event & { action: THREE.AnimationAction}) => onAnimationFinished(event);
    mixer.addEventListener('finished', onFinishedCallback as (e: THREE.Event) => void);

    actions.idle.fadeOut(0.5);
    
    const animsToConfigure = [actions.dance1, actions.dance, actions.endClap];
    animsToConfigure.forEach(action => {
      if (action) {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }
    });
    
    actions.dance1.reset().fadeIn(0.5).play();
  };
  
  const modelScale = 1; 
  const modelHeight = 1.8 * modelScale; 

  return (
    <Canvas
      gl={{ alpha: true }}
      style={{ background: 'transparent', touchAction: 'none' }}
      camera={{ position: [0, modelHeight * 0.6, 3 * modelScale], fov: 50 }} 
      shadows 
    >
      <ambientLight intensity={1.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 5, -5]} intensity={1} /> 
      <Suspense fallback={null}>
        <primitive 
          object={scene} 
          ref={modelRef} 
          scale={modelScale} 
          onClick={handleInteraction}
          position={[0, -modelHeight / 2, 0]} 
          castShadow
          receiveShadow
        />
      </Suspense>
      {/* <OrbitControls /> */}
    </Canvas>
  );
};


// This is the main exported component. It ensures the container div is always rendered.
const InteractiveCharacterModel: FC<InteractiveCharacterModelProps> = ({ containerClassName, ...props }) => {
  return (
    <div className={containerClassName} style={{ width: '100%', height: '100%' }}>
      {/* CharacterModel will only be rendered on the client due to dynamic import */}
      <CharacterModel {...props} />
    </div>
  );
};

export default InteractiveCharacterModel;
