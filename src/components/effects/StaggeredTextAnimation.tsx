"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface StaggeredTextItem {
    content: React.ReactNode;
    delayAfter: number; // ms to wait after this item's animation STARTS before starting the next
}

interface StaggeredTextAnimationProps {
    items: StaggeredTextItem[];
    className?: string;
}

const StaggeredTextAnimation: React.FC<StaggeredTextAnimationProps> = ({ items, className }) => {
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
                        className={cn("opacity-0 animate-slide-up-fade-in")}
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
