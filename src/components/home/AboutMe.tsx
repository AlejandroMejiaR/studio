
"use client"; // Ensure this is a client component

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage
import React from 'react'; // Import React for forwardRef
import { getSupabaseImageUrl } from '@/lib/supabase';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Gamepad2, Component, Code, Sparkles } from 'lucide-react';

// Wrap AboutMe component with forwardRef to allow assigning ref from parent
const AboutMe = React.forwardRef<HTMLElement>((props, ref) => {
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage(); // Use the hook

  const skills = [
    { name: 'Game Design', type: 'icon' as const, icon: Gamepad2 },
    { name: 'UX Design', type: 'icon' as const, icon: Component },
    { name: 'Unity', type: 'logo' as const, logoLight: 'UnityClaro.png', logoDark: 'UnityOscuro.png' },
    { name: 'Unreal Engine', type: 'logo' as const, logoLight: 'UnrealClaro.png', logoDark: 'UnrealOscuro.png' },
    { name: 'C#', type: 'logo' as const, logo: 'c#.png' },
    { name: 'C++', type: 'logo' as const, logo: 'c++.png' },
    { name: 'JavaScript', type: 'logo' as const, logo: 'javascript.png' },
    { name: 'Python', type: 'icon' as const, icon: Code },
    { name: 'Git', type: 'logo' as const, logo: 'git.png' },
    { name: 'Generative AI', type: 'icon' as const, icon: Sparkles },
  ];

  // Determine text based on client readiness and language
  const aboutMeTitle = isClientReady ? translationsForLanguage.aboutMe.title : getEnglishTranslation(t => t.aboutMe.title);
  const paragraph1 = isClientReady ? translationsForLanguage.aboutMe.paragraph1 : getEnglishTranslation(t => t.aboutMe.paragraph1);
  const paragraph2 = isClientReady ? translationsForLanguage.aboutMe.paragraph2 : getEnglishTranslation(t => t.aboutMe.paragraph2);
  
  const skillsTitle = isClientReady ? translationsForLanguage.aboutMe.skillsTitle : getEnglishTranslation(t => t.aboutMe.skillsTitle);


  return (
    // The outer section element is now in page.tsx and has the ref
    // This component now renders its content directly.
    // id="about" is also handled by the wrapping section in page.tsx
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16 lg:py-20">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <Card className="w-full max-w-sm shadow-xl">
            <CardContent className="p-0">
              <Image
                src="https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents//WhatsApp%20Image%202025-01-24%20at%207.15.31%20PM.jpeg"
                alt="Alejandro Mejia Rojas"
                width={400}
                height={500}
                className="rounded-t-lg object-cover w-full h-auto"
                data-ai-hint="professional portrait"
              />
            </CardContent>
            <div className="p-6 bg-card rounded-b-lg">
                <h3 className="font-headline text-2xl font-semibold text-primary dark:text-foreground">Alejandro Mejia Rojas</h3>
                <p className="text-accent">
                  Multimedia Engineer<br />
                  <span className="text-sm">Game Design · UX</span>
                </p>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h2 
            className="font-headline text-4xl md:text-5xl font-bold text-primary mb-6 dark:text-foreground"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          >
            {aboutMeTitle}
          </h2>
          <p 
            className="text-lg text-foreground/80 mb-6 leading-relaxed"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          >
            {paragraph1}
          </p>
          <p 
            className="text-lg text-foreground/80 mb-8 leading-relaxed"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          >
            {paragraph2}
          </p>
          
          <div>
            <h3 
              className="font-headline text-2xl font-semibold text-primary mb-6 dark:text-foreground"
              style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
            >
              {skillsTitle}
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              {skills.map((skill) => (
                <TooltipProvider key={skill.name} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group relative h-16 w-16 bg-card p-3 rounded-lg flex items-center justify-center shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                        {skill.type === 'logo' && skill.logoLight && skill.logoDark ? (
                           <>
                            <Image
                                src={getSupabaseImageUrl('documents', `Logos/${skill.logoLight}`)}
                                alt={`${skill.name} logo`}
                                width={40}
                                height={40}
                                className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 block dark:hidden"
                                unoptimized={true}
                            />
                            <Image
                                src={getSupabaseImageUrl('documents', `Logos/${skill.logoDark}`)}
                                alt={`${skill.name} logo`}
                                width={40}
                                height={40}
                                className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 hidden dark:block"
                                unoptimized={true}
                            />
                           </>
                        ) : skill.type === 'logo' && skill.logo ? (
                            <Image
                                src={getSupabaseImageUrl('documents', `Logos/${skill.logo}`)}
                                alt={`${skill.name} logo`}
                                width={40}
                                height={40}
                                className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 dark:filter dark:invert"
                                unoptimized={true}
                            />
                        ) : skill.type === 'icon' ? (
                            <skill.icon className="h-10 w-10 text-muted-foreground transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:text-accent" />
                        ) : null}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{skill.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                English B2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AboutMe.displayName = 'AboutMe'; // Add display name for React Developer Tools

export default AboutMe;
