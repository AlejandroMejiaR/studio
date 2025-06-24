"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProjectLikes, incrementProjectLike, decrementProjectLike, hasClientLiked, setClientLiked } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { VariantProps } from 'class-variance-authority';

interface LikeButtonProps {
  projectId: string;
  initialLikes?: number;
  className?: string;
  size?: VariantProps<typeof buttonVariants>['size'];
  iconClassName?: string;
}

const LikeButton = ({ projectId, initialLikes, className, size = 'sm', iconClassName }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { translationsForLanguage } = useLanguage();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        if (typeof initialLikes === 'undefined') { // Only fetch if not provided
            const fetchedLikes = await getProjectLikes(projectId);
            setLikes(fetchedLikes);
        }
        setIsLiked(hasClientLiked(projectId));
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
        setClientLiked(projectId, false);
        setIsLiked(false);
        toast({ 
          title: translationsForLanguage.likeButton.unlikedTitle, 
          description: translationsForLanguage.likeButton.unlikedDescription 
        });
      } else {
        newLikesCount = await incrementProjectLike(projectId);
        setClientLiked(projectId, true);
        setIsLiked(true);
        toast({ 
          title: translationsForLanguage.likeButton.likedTitle, 
          description: translationsForLanguage.likeButton.likedDescription 
        });
      }
      setLikes(newLikesCount);
    } catch (error) {
      console.error("Error updating like:", error);
      toast({
        title: translationsForLanguage.likeButton.errorTitle,
        description: translationsForLanguage.likeButton.errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "group hover:bg-transparent", // Ensure no background on hover
        className
      )}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Unlike project" : "Like project"}
    >
      <Heart
        className={cn(
          "transition-colors duration-150",
          isLiked
            ? "fill-destructive text-destructive"
            : "fill-transparent text-muted-foreground group-hover:fill-destructive group-hover:text-destructive",
          iconClassName
        )}
      />
    </Button>
  );
};

export default LikeButton;
