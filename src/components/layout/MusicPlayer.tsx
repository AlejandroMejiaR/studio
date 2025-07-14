
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Headphones, VolumeX } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We create the audio element on the client side to avoid SSR issues.
    if (!audioRef.current) {
      const audio = new Audio('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Sound/Music.ogg');
      audio.loop = true;
      audioRef.current = audio;
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        // Autoplay can be blocked by browsers, good to log this.
        console.error("Audio play failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePlay}
      aria-label={isPlaying ? "Mute music" : "Play music"}
      className="h-9 w-9 hover:bg-accent/10"
    >
      {isPlaying ? (
        <Headphones className="h-5 w-5" style={{ color: '#ffa600' }} />
      ) : (
        <VolumeX className="h-5 w-5" style={{ color: '#ffa600' }} />
      )}
    </Button>
  );
};

export default MusicPlayer;
