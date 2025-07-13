
"use client";

import { Suspense, useRef, useEffect, useState }from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';


// This component loads and displays the GLB model and handles its animations.
function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  // useGLTF hook preloads and caches the model, including its animations.
  const { scene, animations } = useGLTF('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Final.glb');
  // useAnimations hook provides controls for the animations.
  const { actions, mixer } = useAnimations(animations, group);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Play the 'Idle' animation by default
    const idleAction = actions.Idle;
    if (idleAction) {
      idleAction.play();
    }

    // Configure the 'Waving' animation to play only once
    const waveAction = actions.Waving;
    if (waveAction) {
      waveAction.setLoop(THREE.LoopOnce, 1);
      waveAction.clampWhenFinished = true;
    }

    // Listener for when an animation finishes
    const onFinished = (e: any) => {
      // Check if the finished animation is 'Waving'
      if (e.action === waveAction) {
        setIsAnimating(false);
        // Smoothly transition back to 'Idle'
        if (idleAction) {
          waveAction.crossFadeTo(idleAction, 0.3, true);
        }
      }
    };

    mixer.addEventListener('finished', onFinished);

    // Cleanup listener on component unmount
    return () => mixer.removeEventListener('finished', onFinished);

  }, [actions, mixer]);

  const handleModelClick = () => {
    // Don't do anything if an animation is already in progress
    if (isAnimating || !actions.Idle || !actions.Waving) return;

    setIsAnimating(true);
    
    // Smoothly transition from 'Idle' to 'Waving'
    actions.Idle.crossFadeTo(actions.Waving, 0.3, true);
    actions.Waving.reset().play();
  };

  // The 'primitive' object is a way to render a pre-existing THREE.Object3D scene.
  return <primitive ref={group} object={scene} {...props} onClick={handleModelClick} />;
}

// A helper component to log camera position
function CameraPositionLogger() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const logCameraPosition = () => {
    const { x, y, z } = camera.position;
    console.log(`Camera Position: { x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`);
  };

  return <OrbitControls ref={controlsRef} onChange={logCameraPosition} />;
}

export default function HeroScene() {
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
          luminanceThreshold={0.3} // Only objects brighter than this threshold will bloom
          luminanceSmoothing={0.9} // Smoothness of the bloom effect
          height={300} // Quality of the bloom effect
          intensity={0.1} // Strength of the bloom effect
        />
      </EffectComposer>
    </Canvas>
  );
}

// Make sure the GLTF file is preloaded for better performance.
useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Final.glb');
