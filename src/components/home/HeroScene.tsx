
"use client";

import { Suspense, useRef, useEffect, useState }from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

// This component loads and displays the GLB model and handles its animations.
function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/FinalS.glb');
  const { actions, mixer } = useAnimations(animations, group);
  const [isAnimating, setIsAnimating] = useState(false);
  const waveCount = useRef(0);

  useEffect(() => {
    const idleAction = actions.Idle;
    if (idleAction) {
      idleAction.play();
    }

    const waveAction = actions.Wave;
    if (waveAction) {
      waveAction.setLoop(THREE.LoopOnce, 1);
      waveAction.clampWhenFinished = true; // Crucial for smooth transition
    }

    const onFinished = (e: any) => {
      if (e.action === waveAction) {
        waveCount.current++;
        if (waveCount.current < 2) {
          // Play the wave animation again without resetting
          waveAction.play();
        } else {
          // Finished waving twice, now go back to idle
          const idleAction = actions.Idle;
          if (idleAction) {
            waveAction.fadeOut(0.5);
            idleAction.reset().fadeIn(0.5).play();
          }
          setIsAnimating(false);
          waveCount.current = 0; // Reset for next interaction
        }
      }
    };

    mixer.addEventListener('finished', onFinished);

    return () => {
      mixer.removeEventListener('finished', onFinished);
    };
  }, [actions, mixer]);

  const handleModelClick = () => {
    if (isAnimating || !actions.Idle || !actions.Wave) {
      return;
    }
    setIsAnimating(true);
    waveCount.current = 0; // Reset counter on new click
    
    const idleAction = actions.Idle;
    const waveAction = actions.Wave;

    idleAction.fadeOut(0.5);
    waveAction.reset().fadeIn(0.5).play();
  };

  return <primitive ref={group} object={scene} {...props} onClick={handleModelClick} />;
}

// A helper component to log camera position
function CameraPositionLogger() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return <OrbitControls ref={controlsRef} />;
}

export default function HeroScene() {
  // Preload the model here to avoid export issues.
  useEffect(() => {
    useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/FinalS.glb');
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 30 }}>
      {/* Lights */}
      <ambientLight intensity={0} />
      <directionalLight position={[5, 5, 5]} intensity={0} />
      <directionalLight position={[-5, -5, -5]} intensity={0} />
      
      <Suspense fallback={null}>
        <Model scale={[1, 1, 1]} position={[0, -2, 0]} />
      </Suspense>

      {/* OrbitControls allows you to orbit around the model. */}
      <CameraPositionLogger />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          height={300}
          intensity={0.1}
        />
      </EffectComposer>
    </Canvas>
  );
}
