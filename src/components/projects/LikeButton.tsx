"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProjectLikes, incrementProjectLike, decrementProjectLike, hasSessionLiked, setSessionLiked } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  projectId: string;
  initialLikes?: number; // Optional: pass initial likes to avoid fetching on first render
}

const LikeButton = ({ projectId, initialLikes }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        if (typeof initialLikes === 'undefined') { // Only fetch if not provided
            const fetchedLikes = await getProjectLikes(projectId);
            setLikes(fetchedLikes);
        }
        setIsLiked(hasSessionLiked(projectId));
      } catch (error) {
        console.error("Error fetching initial like data:", error);
        // Set to initialLikes or 0 if fetch fails
        setLikes(initialLikes ?? 0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [projectId, initialLikes]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let newLikesCount;
      if (isLiked) {
        newLikesCount = await decrementProjectLike(projectId);
        setSessionLiked(projectId, false);
        setIsLiked(false);
        toast({ title: "Unliked!", description: "You unliked this project." });
      } else {
        newLikesCount = await incrementProjectLike(projectId);
        setSessionLiked(projectId, true);
        setIsLiked(true);
        toast({ title: "Liked!", description: "Thanks for liking this project!" });
      }
      setLikes(newLikesCount);
    } catch (error) {
      console.error("Error updating like:", error);
      toast({
        title: "Error",
        description: "Could not update like status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 transition-all duration-150",
        isLiked ? "text-destructive border-destructive hover:bg-destructive/10" : "text-muted-foreground hover:text-primary hover:border-primary"
      )}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Unlike project" : "Like project"}
    >
      <Heart size={16} className={cn(isLiked ? "fill-destructive" : "fill-transparent")} />
      <span>{likes}</span>
    </Button>
  );
};

export default LikeButton;
