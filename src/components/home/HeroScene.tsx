
"use client";

import { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import React from 'react';

// This component loads and displays the GLB model.
function Model(props: JSX.IntrinsicElements['group']) {
  // useGLTF hook preloads and caches the model.
  const { scene } = useGLTF('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Finalscene.glb');
  
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

      {/* OrbitControls allows you to orbit around the model.
          We can disable this later once the camera position is finalized. */}
      <OrbitControls />
    </Canvas>
  );
}

// Make sure the GLTF file is preloaded for better performance.
useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Finalscene.glb');
