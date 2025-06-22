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
import { Gamepad2, Component, Sparkles, Languages, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Wrap AboutMe component with forwardRef to allow assigning ref from parent
const AboutMe = React.forwardRef<HTMLElement>((props, ref) => {
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage(); // Use the hook

  const skills = isClientReady ? [
    { name: translationsForLanguage.aboutMe.skills.gameDesign, icon: Gamepad2 },
    { name: translationsForLanguage.aboutMe.skills.uxDesign, icon: Component },
    { name: translationsForLanguage.aboutMe.skills.generativeAI, icon: Sparkles },
    { name: translationsForLanguage.aboutMe.skills.coding, icon: Code2 },
    { name: translationsForLanguage.aboutMe.skills.englishB2, icon: Languages },
  ] : [];
  
  const technologies = [
    // Logos
    { name: 'Unity', type: 'logo', logoLight: 'UnityClaro.png', logoDark: 'UnityOscuro.png' },
    { name: 'Unreal Engine', type: 'logo', logoLight: 'UnrealClaro.png', logoDark: 'UnrealOscuro.png' },
    { name: 'C#', type: 'logo', logo: 'c.png' },
    { name: 'C++', type: 'logo', logo: 'c++.png' },
    { name: 'JavaScript', type: 'logo', logo: 'javascript.png' },
    { name: 'python', type: 'logo', logo: 'python.png' },
    { name: 'Git', type: 'logo', logo: 'git.png' },
    { name: 'Figma', type: 'logo', logo: 'Figma.png' },
  ];

  // Determine text based on client readiness and language
  const aboutMeTitle = isClientReady ? translationsForLanguage.aboutMe.title : getEnglishTranslation(t => t.aboutMe.title);
  const paragraph1 = isClientReady ? translationsForLanguage.aboutMe.paragraph1 : getEnglishTranslation(t => t.aboutMe.paragraph1);
  const paragraph2 = isClientReady ? translationsForLanguage.aboutMe.paragraph2 : getEnglishTranslation(t => t.aboutMe.paragraph2);
  const workTogetherText = isClientReady ? translationsForLanguage.aboutMe.workTogether : getEnglishTranslation(t => t.aboutMe.workTogether);
  const skillsTitle = isClientReady ? translationsForLanguage.aboutMe.skillsTitle : getEnglishTranslation(t => t.aboutMe.skillsTitle);
  const technologiesTitle = isClientReady ? translationsForLanguage.aboutMe.technologiesTitle : getEnglishTranslation(t => t.aboutMe.technologiesTitle);

  return (
    // The outer section element is now in page.tsx and has the ref
    // This component now renders its content directly.
    // id="about" is also handled by the wrapping section in page.tsx
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16 lg:py-20">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-center">
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <Card className="w-full max-w-sm shadow-xl">
            <CardContent className="p-0">
              <Image
                src={getSupabaseImageUrl('documents', 'profile-picture.jpeg')}
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
            className="text-lg text-foreground/80 mb-2 leading-relaxed"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          >
            {paragraph2}
          </p>
          <p 
            className="text-lg mb-8"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          >
            <a 
              href="mailto:alejandro197mejia@gmail.com" 
              className="font-bold text-accent hover:text-accent/90 no-underline transition-colors"
            >
              {workTogetherText}
            </a>
          </p>
          
          <div>
            <h3 
              className="font-headline text-2xl font-semibold text-primary mb-6 dark:text-foreground"
              style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
            >
              {skillsTitle}
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
              {skills.map((skill) => (
                <TooltipProvider key={skill.name} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group relative bg-card p-3 rounded-lg flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-24 w-24 text-center">
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

            <h3 
              className="font-headline text-2xl font-semibold text-primary mb-6 dark:text-foreground"
              style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
            >
              {technologiesTitle}
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {technologies.map((skill) => (
                <TooltipProvider key={skill.name} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group relative h-16 w-16 flex items-center justify-center p-2 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                          {skill.logoLight && skill.logoDark ? (
                              <>
                                  <Image
                                      src={getSupabaseImageUrl('documents', `Logos/${skill.logoLight}`)}
                                      alt={`${skill.name} logo`}
                                      width={48} height={48}
                                      className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 block dark:hidden"
                                      unoptimized={true}
                                  />
                                  <Image
                                      src={getSupabaseImageUrl('documents', `Logos/${skill.logoDark}`)}
                                      alt={`${skill.name} logo`}
                                      width={48} height={48}
                                      className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 hidden dark:block"
                                      unoptimized={true}
                                  />
                              </>
                          ) : (
                              <Image
                                  src={getSupabaseImageUrl('documents', `Logos/${skill.logo}`)}
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
});

AboutMe.displayName = 'AboutMe'; // Add display name for React Developer Tools

export default AboutMe;
