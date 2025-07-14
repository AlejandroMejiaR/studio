
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Headphones, VolumeX } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Sound/Music.mp3');
      audio.loop = true;
      audio.volume = 0; // Start muted but ready
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
      // If music is playing, the click should mute it.
      setLastVolume(volume);
      setVolume(0);
      setIsPlaying(false);
      setIsPopoverOpen(false); // Close popover on mute
    } else {
      // If music is muted, the click should unmute it.
      const newVolume = lastVolume > 0 ? lastVolume : 0.5;
      setVolume(newVolume);
      setIsPlaying(true);
      if (audio.paused) {
        audio.play().catch(error => console.error("Audio play failed:", error));
      }
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    // If user drags slider to 0, reflect this as 'muted' state
    if (vol === 0) {
      if (isPlaying) setIsPlaying(false);
    } else {
      if (!isPlaying) {
        setIsPlaying(true);
        if (audioRef.current?.paused) {
           audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        }
      }
    }
  };
  
  const handleSliderCommit = () => {
    // When the user releases the slider, close the popover.
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => {
            // This click handler is for the PopoverTrigger button itself.
            // It should only toggle the popover if music is playing.
            if (isPlaying) {
              setIsPopoverOpen((prev) => !prev);
            } else {
              // If muted, this click should just play the music, not open popover.
              togglePlay();
            }
          }}
          aria-label={isPlaying ? "Adjust volume" : "Play music"}
          className="h-10 w-10 hover:bg-accent/10"
        >
          {/* A separate clickable div for the icon to handle mute/unmute */}
           <div 
              onClick={(e) => { 
                // Stop click from propagating to the parent button's onClick
                e.stopPropagation(); 
                togglePlay(); 
              }}
              aria-label={isPlaying ? "Mute music" : "Play music"}
           >
            {volume > 0 ? (
              <Headphones style={{ color: '#ffa600', width: '25px', height: '25px' }} strokeWidth={2.5}/>
            ) : (
              <VolumeX style={{ color: '#ffa600', width: '25px', height: '25px' }} strokeWidth={2.5}/>
            )}
           </div>
        </Button>
      </PopoverTrigger>
      {/* The PopoverContent is only rendered if music is playing, preventing it from showing on unmute */}
      {isPlaying && (
        <PopoverContent className="w-20 p-2" align="center" side="top">
          <div className="flex justify-center items-center h-32">
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              orientation="vertical"
              onValueChange={handleVolumeChange}
              onValueCommit={handleSliderCommit}
              className="h-full"
            />
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default MusicPlayer;
