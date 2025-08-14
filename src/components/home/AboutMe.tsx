
"use client"; // Ensure this is a client component

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage
import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Gamepad2, Component, Sparkles, Languages, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ThemeSensitiveImage = ({ lightSrc, darkSrc, alt, width, height, className, unoptimized }: { lightSrc: string, darkSrc: string, alt: string, width: number, height: number, className?: string, unoptimized?: boolean }) => {
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
        // Render a placeholder or the light version SSR to avoid layout shift
        return <Image src={lightSrc} alt={alt} width={width} height={height} className={cn("object-contain", className)} unoptimized={unoptimized} />;
    }
    
    const src = theme === 'dark' ? darkSrc : lightSrc;

    return <Image src={src} alt={alt} width={width} height={height} className={cn("object-contain", className)} unoptimized={unoptimized} />;
};


// This component no longer needs a ref as it's on its own page.
const AboutMe = () => {
  const { translationsForLanguage } = useLanguage();

  const skills = [
    { name: translationsForLanguage.aboutMe.skills.coding, icon: Code2 },
    { name: translationsForLanguage.aboutMe.skills.gameDesign, icon: Gamepad2 },
    { name: translationsForLanguage.aboutMe.skills.uxDesign, icon: Component },
    { name: translationsForLanguage.aboutMe.skills.generativeAI, icon: Sparkles },
    { name: translationsForLanguage.aboutMe.skills.englishB2, icon: Languages },
  ];
  
  const technologies = [
    // Logos
    { name: 'Unity', type: 'logo', logoLight: 'UnityClaro.png', logoDark: 'UnityOscuro.png' },
    { name: 'Unreal Engine', type: 'logo', logoLight: 'UnrealClaro.png', logoDark: 'UnrealOscuro.png' },
    { name: 'JavaScript', type: 'logo', logo: 'javascript.png' },
    { name: 'python', type: 'logo', logo: 'python.png' },
    { name: 'Git', type: 'logo', logo: 'git.png' },
    { name: 'VS Code', type: 'logo', logo: 'Vs.png' },
    { name: 'Figma', type: 'logo', logo: 'Figma.png' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-center">
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <Card className="w-full max-w-sm shadow-xl bg-background">
            <CardContent className="p-0">
              <Image
                src={"https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents//Profile.jpeg"}
                alt="Alejandro Mejia Rojas"
                width={400}
                height={500}
                className="rounded-t-lg object-cover w-full h-auto"
                data-ai-hint="professional portrait"
              />
            </CardContent>
            <div className="p-6 bg-background rounded-b-lg">
                <h3 className="font-headline text-2xl font-semibold text-primary dark:text-foreground">Alejandro Mejia Rojas</h3>
                <p className="text-accent">
                  {translationsForLanguage.aboutMe.jobTitle}<br />
                  <span className="text-sm">{translationsForLanguage.aboutMe.jobSpecialization}</span>
                </p>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-6 dark:text-foreground">
            {translationsForLanguage.aboutMe.title}
          </h2>
          <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
            {translationsForLanguage.aboutMe.paragraph1}
          </p>
          <p className="text-lg text-foreground/80 mb-2 leading-relaxed">
            {translationsForLanguage.aboutMe.paragraph2}
          </p>
          <p className="text-lg mb-8">
            <a 
              href="mailto:alejandro197mejia@gmail.com" 
              className="font-bold text-accent hover:text-accent/90 no-underline transition-colors"
            >
              {translationsForLanguage.aboutMe.workTogether}
            </a>
          </p>
          
          <div>
            <h3 className="font-headline text-2xl font-semibold text-primary mb-6 dark:text-foreground">
              {translationsForLanguage.aboutMe.skillsTitle}
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
              {skills.map((skill) => (
                <TooltipProvider key={skill.name} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group relative bg-background border p-3 rounded-lg flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-24 w-24 text-center">
                        <skill.icon className="h-8 w-8 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
                        <span className="text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-accent">{skill.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{skill.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <h3 className="font-headline text-2xl font-semibold text-primary mb-6 dark:text-foreground">
              {translationsForLanguage.aboutMe.technologiesTitle}
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {technologies.map((skill) => (
                <TooltipProvider key={skill.name} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group relative h-16 w-16 flex items-center justify-center p-2 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                          {skill.logoLight && skill.logoDark ? (
                              <ThemeSensitiveImage 
                                lightSrc={`https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Logos/${skill.logoLight}`}
                                darkSrc={`https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Logos/${skill.logoDark}`}
                                alt={`${skill.name} logo`}
                                width={48}
                                height={48}
                                className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                                unoptimized={true}
                              />
                          ) : (
                              <Image
                                  src={`https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Logos/${skill.logo}`}
                                  alt={`${skill.name} logo`}
                                  width={48} height={48}
                                  className={cn(
                                    "object-contain transition-transform duration-300 ease-in-out group-hover:scale-110",
                                    skill.name === 'Figma' && 'p-2'
                                  )}
                                  unoptimized={true}
                              />
                          )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{skill.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
