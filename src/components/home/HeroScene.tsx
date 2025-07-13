
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

// A helper component to log camera position, rotation, zoom, and target.
function CameraPositionLogger() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const logCameraState = () => {
      const { x: posX, y: posY, z: posZ } = camera.position;
      const { x: rotX, y: rotY, z: rotZ } = camera.rotation;
      const { x: targetX, y: targetY, z: targetZ } = controls.target;
      const zoom = camera.zoom;
      const fov = (camera as THREE.PerspectiveCamera).fov; // Cast to get fov

      console.log(
        `Position: { x: ${posX.toFixed(2)}, y: ${posY.toFixed(2)}, z: ${posZ.toFixed(2)} },\n` +
        `Rotation: { _x: ${rotX.toFixed(2)}, _y: ${rotY.toFixed(2)}, _z: ${rotZ.toFixed(2)} },\n` +
        `Target: { x: ${targetX.toFixed(2)}, y: ${targetY.toFixed(2)}, z: ${targetZ.toFixed(2)} },\n` +
        `Zoom: ${zoom.toFixed(2)},\n` +
        `FOV: ${fov}`
      );
    };

    controls.addEventListener('change', logCameraState);
    
    // Initial log
    logCameraState();

    return () => {
      controls.removeEventListener('change', logCameraState);
    };
  }, [camera]);

  // Set the initial target to match the model's y-position for more intuitive panning.
  return <OrbitControls ref={controlsRef} target={[0, -2, 0]} />;
}

export default function HeroScene() {
  // Preload the model here.
  useEffect(() => {
    useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/SFinal.glb');
  }, []);

  return (
    <Canvas camera={{ position: [0.84, -0.24, 1.58], rotation: [-0.33, 0.81, 0.24], fov: 30 }}>
      {/* Lights */}
      <ambientLight intensity={0} />
      <directionalLight position={[5, 5, 5]} intensity={0} />
      <directionalLight position={[-5, -5, -5]} intensity={0} />
      
      <Suspense fallback={null}>
        <Model scale={[1, 1, 1]} position={[0, -2, 0]} />
      </Suspense>

      {/* OrbitControls allows you to orbit around the model. Re-enabled for positioning. */}
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
