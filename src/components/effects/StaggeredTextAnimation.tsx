"use client";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

interface StaggeredTextItem {
    content: React.ReactNode;
    delayAfter: number; // ms to wait after this item's animation STARTS before starting the next
    className?: string;
}

interface StaggeredTextAnimationProps {
    items: StaggeredTextItem[];
    className?: string;
    onComplete?: () => void;
}

const StaggeredTextAnimation: React.FC<StaggeredTextAnimationProps> = ({ items, className, onComplete }) => {
    const animationDuration = 500; // From .animate-slide-up-fade-in (0.5s)

    useEffect(() => {
        if (onComplete && items.length > 0) {
            // Calculate the time until the last item *starts* animating
            const lastItemDelay = items.slice(0, -1).reduce((acc, item) => acc + item.delayAfter, 0);
            
            // Total time is when the last item starts + its own animation duration
            const totalAnimationTime = lastItemDelay + animationDuration;

            const timer = setTimeout(() => {
                onComplete();
            }, totalAnimationTime);
            
            return () => clearTimeout(timer);
        }
    }, [items, onComplete, animationDuration]);

    let cumulativeDelay = 0;

    return (
        <div className={cn("flex flex-col items-center text-center", className)}>
            {items.map((item, index) => {
                const currentItemDelay = cumulativeDelay;
                // Add the delay for the *next* item
                cumulativeDelay += item.delayAfter;

                return (
                    <div
                        key={index}
                        className={cn("opacity-0 animate-slide-up-fade-in", item.className)}
                        style={{
                            animationDelay: `${currentItemDelay}ms`,
                        }}
                    >
                        {item.content}
                    </div>
                );
            })}
        </div>
    );
};

export default StaggeredTextAnimation;
