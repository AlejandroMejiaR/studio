
"use client";

import { Suspense, useRef, useEffect, useState }from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React from 'react';
import * as THREE from 'three';

// This component loads and displays the GLB model and handles its animations.
function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/SFinal.glb');
  const { actions, mixer } = useAnimations(animations, group);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wavePlayCount, setWavePlayCount] = useState(0);

  useEffect(() => {
    const idleAction = actions.Idle;
    if (idleAction) {
      idleAction.play();
    }

    const waveAction = actions.Wave;
    if (waveAction) {
      waveAction.setLoop(THREE.LoopOnce, 1); // We will control the repeat manually.
      waveAction.clampWhenFinished = true; // Prevents T-pose between plays
    }

    const onFinished = (e: any) => {
      if (e.action === waveAction) {
        if (wavePlayCount < 1) { // If it has played once, play it again
          setWavePlayCount(prev => prev + 1);
          waveAction.reset().play();
        } else { // If it has played twice, transition back to idle
          waveAction.fadeOut(0.5);
          const idleAction = actions.Idle;
          if (idleAction) {
            idleAction.reset().fadeIn(0.5).play();
          }
          setIsAnimating(false);
        }
      }
    };

    mixer.addEventListener('finished', onFinished);

    return () => {
      mixer.removeEventListener('finished', onFinished);
    };
  }, [actions, mixer, wavePlayCount]);

  const handleModelClick = () => {
    if (isAnimating || !actions.Idle || !actions.Wave) {
      return;
    }
    setIsAnimating(true);
    setWavePlayCount(0); // Reset play count for the new interaction
    
    const idleAction = actions.Idle;
    const waveAction = actions.Wave;

    idleAction.fadeOut(0.5);
    waveAction.reset().fadeIn(0.5).play();
  };

  return <primitive ref={group} object={scene} {...props} onClick={handleModelClick} />;
}

// A helper component to set the camera's target.
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(new THREE.Vector3(-1.49, -1.22, -0.12));
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}


export default function HeroScene() {
  // Preload the model here.
  useEffect(() => {
    useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/SFinal.glb');
  }, []);

  return (
    <Canvas camera={{ position: [0.86, 0.13, 1.79], fov: 30 }}>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      
      <Suspense fallback={null}>
        <Model scale={[1, 1, 1]} position={[0, -2, 0]} />
      </Suspense>
      
      {/* Set the final camera target */}
      <CameraSetup />

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
