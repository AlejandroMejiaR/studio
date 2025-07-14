
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Headphones, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create the audio element on the client side to avoid SSR issues.
    if (!audioRef.current) {
      const audio = new Audio('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Sound/Music.ogg');
      audio.loop = true;
      audio.volume = 0; // Start with volume at 0
      audioRef.current = audio;
    }

    // Cleanup on unmount
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      audioRef.current?.pause();
    };
  }, []);

  const fadeAudio = (targetVolume: number, duration: number = 1000) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const startVolume = audio.volume;
    const stepTime = 50; // ms per step
    const totalSteps = duration / stepTime;
    const volumeStep = (targetVolume - startVolume) / totalSteps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        audio.volume = targetVolume;
        clearInterval(fadeIntervalRef.current as NodeJS.Timeout);
        fadeIntervalRef.current = null;
        if (targetVolume === 0) {
          audio.pause();
        }
      } else {
        const newVolume = startVolume + (volumeStep * currentStep);
        // Clamp volume between 0 and 1
        audio.volume = Math.max(0, Math.min(1, newVolume));
      }
    }, stepTime);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      fadeAudio(0);
      setIsPlaying(false);
    } else {
      audio.play().catch(error => {
        console.error("Audio play failed:", error);
      });
      fadeAudio(1);
      setIsPlaying(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePlay}
      aria-label={isPlaying ? "Mute music" : "Play music"}
      className="h-10 w-10 hover:bg-accent/10"
    >
      {isPlaying ? (
        <Headphones className="h-[25px] w-[25px]" style={{ color: '#ffa600' }} strokeWidth={2.5}/>
      ) : (
        <VolumeX className="h-[25px] w-[25px]" style={{ color: '#ffa600' }} strokeWidth={2.5}/>
      )}
    </Button>
  );
};

export default MusicPlayer;
