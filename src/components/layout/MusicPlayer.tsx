
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Headphones, VolumeX } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Initial volume at 50%
  const [lastVolume, setLastVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Sound/Music.mp3');
      audio.loop = true;
      audio.volume = 0; // Start muted
      audioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Mute
      setLastVolume(volume);
      setVolume(0);
      setIsPlaying(false);
      // We don't pause, just set volume to 0 to keep it running seamlessly
    } else {
      // Unmute
      const newVolume = lastVolume > 0 ? lastVolume : 0.5; // Restore or default
      setVolume(newVolume);
      setIsPlaying(true);
      audio.play().catch(error => console.error("Audio play failed:", error));
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (vol > 0 && !isPlaying) {
      setIsPlaying(true);
      if (audioRef.current?.paused) {
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
      }
    } else if (vol === 0 && isPlaying) {
      setIsPlaying(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          onClick={togglePlay}
          aria-label={isPlaying ? "Mute music" : "Play music"}
          className="h-10 w-10 hover:bg-accent/10"
        >
          {volume > 0 ? (
            <Headphones style={{ color: '#ffa600', width: '25px', height: '25px' }} strokeWidth={2.5}/>
          ) : (
            <VolumeX style={{ color: '#ffa600', width: '25px', height: '25px' }} strokeWidth={2.5}/>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-20 p-2" align="center" side="top">
        <div className="flex justify-center items-center h-32">
          <Slider
            defaultValue={[volume]}
            value={[volume]}
            max={1}
            step={0.01}
            orientation="vertical"
            onValueChange={handleVolumeChange}
            className="h-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MusicPlayer;
