"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface StaggeredTextAnimationProps {
    phrases: React.ReactNode[];
    staggerDuration?: number; // ms
    className?: string;
}

const StaggeredTextAnimation: React.FC<StaggeredTextAnimationProps> = ({ phrases, staggerDuration = 400, className }) => {
    return (
        <div className={cn("flex flex-col items-center text-center", className)}>
            {phrases.map((phrase, index) => (
                <div
                    key={index}
                    className="opacity-0 animate-slide-up-fade-in"
                    style={{
                        animationDelay: `${index * staggerDuration}ms`,
                    }}
                >
                    {phrase}
                </div>
            ))}
        </div>
    );
};

export default StaggeredTextAnimation;
