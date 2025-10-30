
"use client";

import { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React from 'react';
import * as THREE from 'three';
import { useScreenSize, type ScreenSize } from '@/hooks/use-screen-size';
import { cn } from '@/lib/utils';

// This component loads and displays the GLB model and handles its animations.
function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Final.glb');
  const { actions, mixer } = useAnimations(animations, group);
  const [isAnimating, setIsAnimating] = useState(false);
  const screenSize = useScreenSize();
  
  const startWaveAnimation = useCallback(() => {
    if (isAnimating || !actions.Idle || !actions.Wave) {
      return;
    }
    setIsAnimating(true);
    
    actions.Idle.fadeOut(0.5);
    actions.Wave.reset().fadeIn(0.5).play();
  }, [actions, isAnimating]);

  // Effect for setting up animations and handling the "finished" event logic.
  useEffect(() => {
    if (!actions.Idle || !actions.Wave) return;

    actions.Idle.play();
    actions.Wave.setLoop(THREE.LoopOnce, 1);
    actions.Wave.clampWhenFinished = true;
    
    let wavePlayCount = 0;

    const onFinished = (e: any) => {
      if (e.action === actions.Wave) {
        if (wavePlayCount < 1) { 
          wavePlayCount++;
          actions.Wave.reset().play();
        } else { 
          actions.Wave.fadeOut(0.5);
          actions.Idle.reset().fadeIn(0.5).play();
          wavePlayCount = 0; 
          setIsAnimating(false);
        }
      }
    };

    mixer.addEventListener('finished', onFinished);
    
    // Check session storage to decide if the welcome animation should play.
    const hasGreeted = sessionStorage.getItem('portfolio-ace-has-greeted');
    if (!hasGreeted) {
      // After a delay to allow for the model's fade-in, trigger the welcome wave.
      const welcomeTimer = setTimeout(() => {
        startWaveAnimation();
        sessionStorage.setItem('portfolio-ace-has-greeted', 'true');
      }, 3000); // Wait for model to be visible
      return () => clearTimeout(welcomeTimer);
    }
    

    return () => {
      mixer.removeEventListener('finished', onFinished);
    };
  }, [actions, mixer, startWaveAnimation]);


  const handleModelClick = (event: any) => {
    event.stopPropagation();
    if (screenSize === 'mobile') {
      return;
    }
    startWaveAnimation();
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

function Loader() {
  return (
    <Html center>
      <div className="flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent"></div>
      </div>
    </Html>
  );
}


export default function HeroScene() {
  const screenSize = useScreenSize();
  const [theme, setTheme] = useState('dark');
  const [isMounted, setIsMounted] = useState(false);
  const [initialCameraProps, setInitialCameraProps] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('portfolio-ace-theme') || 'dark';
    setTheme(storedTheme);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDark = (mutation.target as HTMLElement).classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (screenSize && screenSize !== 'mobile') {
      const config = cameraConfigs[screenSize];
      setInitialCameraProps({
        position: config.position,
        fov: 30,
        // The lookAt will be handled inside the canvas by the OrbitControls or manual camera adjustments if any.
        // We set the initial position and fov here.
      });
    } else {
      setInitialCameraProps(null);
    }
  }, [screenSize]);

  // Determine if we are ready to render the canvas
  const canRenderCanvas = isMounted && initialCameraProps && screenSize !== 'mobile';
  
  const bgColor = theme === 'light' ? '#d9d9d9' : '#0d0d0d';

  return (
    <div className={cn(
        "w-full h-full pointer-events-auto transition-opacity duration-1000 ease-in",
        canRenderCanvas ? "opacity-100" : "opacity-0"
    )}>
        {canRenderCanvas ? (
            <Canvas camera={initialCameraProps} onCreated={({ camera }) => {
                const config = cameraConfigs[screenSize as Exclude<ScreenSize, 'mobile'>];
                if (config) {
                    camera.lookAt(new THREE.Vector3(...config.target));
                }
            }}>
                <color attach="background" args={[bgColor]} />
                
                <Suspense fallback={<Loader />}>
                    <Model scale={[1, 1, 1]} position={[0, -2, 0]} />
                </Suspense>
                
                <EffectComposer>
                    <Bloom 
                    luminanceThreshold={0.3}
                    luminanceSmoothing={0.9}
                    height={300}
                    intensity={0.2}
                    />
                </EffectComposer>
            </Canvas>
        ) : (
            // Placeholder to prevent layout shift
            <div className="w-full h-full" />
        )}
    </div>
  );
}
