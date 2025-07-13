
"use client";

import { Suspense, useRef, useEffect, useState }from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React from 'react';
import * as THREE from 'three';
import { useScreenSize, type ScreenSize } from '@/hooks/use-screen-size';

// This component loads and displays the GLB model and handles its animations.
function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Scene.glb');
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

const cameraConfigs: Record<Exclude<ScreenSize, 'mobile'>, { position: [number, number, number], target: [number, number, number] }> = {
  desktop: {
    position: [0.8, 0.09, 1.33],
    target: [-0.84, -0.85, 0.21],
  },
  laptop: {
    position: [1.14, 0.33, 1.61],
    target: [-0.68, -0.95, 0.07],
  },
  tablet: {
    position: [1.81, 0.87, 3.48],
    target: [-0.69, -1.07, 0.26],
  },
};

function CameraSetup() {
  const { camera } = useThree();
  const screenSize = useScreenSize();

  useEffect(() => {
    if (screenSize && screenSize !== 'mobile') {
      const config = cameraConfigs[screenSize];
      if (config) {
        camera.position.set(...config.position);
        camera.lookAt(...config.target);
      }
    }
  }, [camera, screenSize]);

  return null;
}


export default function HeroScene() {
  const screenSize = useScreenSize();
  const [bgColor, setBgColor] = useState('hsl(220 16% 93%)'); // Default light theme bg

  useEffect(() => {
    // This function reads the computed background color from the body.
    const updateBgColor = () => {
      if (typeof window !== 'undefined') {
        const bodyStyles = window.getComputedStyle(document.body);
        setBgColor(bodyStyles.backgroundColor);
      }
    };

    // Set the initial color
    updateBgColor();

    // Observe changes to the theme (light/dark mode toggle)
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateBgColor();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    useGLTF.preload('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Scene.glb');
  }, []);

  if (!screenSize || screenSize === 'mobile') {
    return null; // Don't render on server or on mobile
  }

  return (
    <div className="w-full h-full pointer-events-auto">
        <Canvas camera={{ fov: 30 }}>
        {/* Set canvas background color to match the page's theme */}
        <color attach="background" args={[bgColor]} />
        {/* Lights */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 10, 0]} intensity={1} />
        <directionalLight position={[0, 2, -10]} intensity={1.5} />
        
        <Suspense fallback={null}>
            <Model scale={[1, 1, 1]} position={[0, -2, 0]} />
        </Suspense>
        
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
    </div>
  );
}
