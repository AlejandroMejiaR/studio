
"use client";

import { Suspense, useRef, useEffect, useState }from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React from 'react';
import * as THREE from 'three';
import { useScreenSize, type ScreenSize } from '@/hooks/use-screen-size';

// This component loads and displays the GLB model and handles its animations.
function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/SFinal.glb');
  const { actions, mixer } = useAnimations(animations, group);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wavePlayCount, setWavePlayCount] = useState(0);
  const screenSize = useScreenSize();

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

  const handleModelClick = (event: any) => {
    // Stop propagation so the main container doesn't get the click.
    event.stopPropagation();
    if (isAnimating || !actions.Idle || !actions.Wave || screenSize === 'mobile') {
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
function CameraSetup({ config }: { config: { position: THREE.Vector3, target: THREE.Vector3 } }) {
  const { camera } = useThree();
  useFrame(() => {
    // Continuously look at the target
    camera.lookAt(config.target);
    camera.updateProjectionMatrix();
  });

  useEffect(() => {
    // Set initial position
    camera.position.set(config.position.x, config.position.y, config.position.z);
  }, [camera, config]);

  return null;
}

export default function HeroScene() {
  const screenSize = useScreenSize();
  const controlsRef = useRef<any>();

  const cameraConfigs: Record<ScreenSize, { position: THREE.Vector3, target: THREE.Vector3 }> = {
    desktop: {
      position: new THREE.Vector3(0.87, 0.13, 1.78),
      target: new THREE.Vector3(-1.49, -1.22, -0.12),
    },
    tablet: {
      position: new THREE.Vector3(0.95, 0.52, 1.90),
      target: new THREE.Vector3(-1.17, -1.49, -0.33),
    },
    mobile: {
      position: new THREE.Vector3(1.22, 1.06, 2.07),
      target: new THREE.Vector3(-0.89, -1.60, -0.17),
    }
  };
  
  const cameraConfig = screenSize ? cameraConfigs[screenSize] : cameraConfigs.desktop;

  useEffect(() => {
    useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/SFinal.glb');
  }, []);


  if (!screenSize) {
    return null; // Don't render on server or until screen size is known
  }

  return (
    <div className="w-full h-full pointer-events-auto">
        <Canvas camera={{ fov: 30 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
            <Model scale={[1, 1, 1]} position={[0, -2, 0]} />
        </Suspense>
        
        <CameraSetup config={cameraConfig} />

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
    </div>
  );
}
