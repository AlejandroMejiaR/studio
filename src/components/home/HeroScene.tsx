
"use client";

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React from 'react';

// This component loads and displays the GLB model.
function Model(props: JSX.IntrinsicElements['group']) {
  // useGLTF hook preloads and caches the model.
  const { scene } = useGLTF('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/SceneFinal.glb');
  
  // The 'primitive' object is a way to render a pre-existing THREE.Object3D scene.
  return <primitive object={scene} {...props} />;
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
      {/* Lights */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, -5, -5]} intensity={1} />
      
      <Suspense fallback={null}>
        <Model scale={[1, 1, 1]} position={[0, -2, 0]} />
      </Suspense>

      {/* OrbitControls allows you to orbit around the model. */}
      <OrbitControls />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.3} // Only objects brighter than this threshold will bloom
          luminanceSmoothing={0.9} // Smoothness of the bloom effect
          height={300} // Quality of the bloom effect
          intensity={0.8} // Strength of the bloom effect
        />
      </EffectComposer>
    </Canvas>
  );
}

// Make sure the GLTF file is preloaded for better performance.
useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/SceneFinal.glb');
