
"use client";

import { Suspense, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';


// This component loads and displays the GLB model.
function Model(props: JSX.IntrinsicElements['group']) {
  // useGLTF hook preloads and caches the model.
  const { scene } = useGLTF('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Final.glb');
  
  // The 'primitive' object is a way to render a pre-existing THREE.Object3D scene.
  return <primitive object={scene} {...props} />;
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
