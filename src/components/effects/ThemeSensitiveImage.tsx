
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const ThemeSensitiveImage = ({ lightSrc, darkSrc, alt, width, height, className }: { lightSrc: string, darkSrc: string, alt: string, width: number, height: number, className?: string }) => {
    const [theme, setTheme] = useState('dark');
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
        const handleThemeChange = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
        };

        handleThemeChange(); // Set initial theme

        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    if (!isMounted) {
        // Render the dark version by default to match server-side rendering and avoid flash.
        return <Image src={darkSrc} alt={alt} width={width} height={height} className={cn("object-contain", className)} />;
    }
    
    const src = theme === 'dark' ? darkSrc : lightSrc;

    return <Image src={src} alt={alt} width={width} height={height} className={cn("object-contain", className)} />;
};

export default ThemeSensitiveImage;
