
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
    return () => {
      mixer?.stopAllAction();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mixer?.removeEventListener('finished', onAnimationFinished);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, mixer]);

  const onAnimationFinished = (event: THREE.Event & { action: THREE.AnimationAction}) => {
    if (!actions.dance1 || !actions.dance || !actions.endClap || !actions.idle) return;

    if (event.action === actions.dance1) {
      actions.dance1.fadeOut(0.3);
      actions.dance.reset().fadeIn(0.3).play();
    } else if (event.action === actions.dance) {
      actions.dance.fadeOut(0.3);
      actions.endClap.reset().fadeIn(0.3).play();
    } else if (event.action === actions.endClap) {
      actions.endClap.fadeOut(0.3);
      actions.idle.reset().fadeIn(0.3).play();
      setIsInteracting(false);
      mixer.removeEventListener('finished', onAnimationFinished);
    }
  };

  const handleInteraction = () => {
    if (isInteracting || !actions.idle || !actions.dance1 || !actions.dance || !actions.endClap || !mixer) return;

    setIsInteracting(true);
    mixer.addEventListener('finished', onAnimationFinished as (e: THREE.Event) => void);

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
  
  // Adjust scale as needed for your model
  // For example, if your model is exported in cm from Blender, scale might be 0.01
  const modelScale = 1; // Example: adjust this value

  // Estimate model height for camera positioning (e.g., 1.8 units for 1.8m)
  const modelHeight = 1.8 * modelScale; 

  return (
    <Canvas
      gl={{ alpha: true }}
      style={{ background: 'transparent', touchAction: 'none' }}
      camera={{ position: [0, modelHeight * 0.6, 3 * modelScale], fov: 50 }} // Position camera to view model
      shadows // Enable shadows
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
          position={[0, -modelHeight / 2, 0]} // Adjust if model pivot is not at its feet
          castShadow
          receiveShadow
        />
      </Suspense>
      {/* <OrbitControls /> optionally, for debugging camera and model scale */}
    </Canvas>
  );
};


const InteractiveCharacterModel: FC<InteractiveCharacterModelProps> = ({ containerClassName, ...props }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a simple placeholder or null on the server to avoid hydration issues
    // The div will take up space according to containerClassName
    return <div className={containerClassName}></div>;
  }

  return (
    <div className={containerClassName} style={{ width: '100%', height: '100%' }}>
      <CharacterModel {...props} />
    </div>
  );
};

export default InteractiveCharacterModel;
