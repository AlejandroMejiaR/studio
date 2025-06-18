
"use client"; 

import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import { getAllProjectsFromFirestore } from '@/lib/firebase';
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import TypingAnimation from '@/components/effects/TypingAnimation';
import WordRevealAnimation from '@/components/effects/WordRevealAnimation'; // Changed
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { language, translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const fetchedProjects = await getAllProjectsFromFirestore();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const heroFullTitleLines = isClientReady ? translationsForLanguage.home.hero.fullTitle : (getEnglishTranslation(t => t.home.hero.fullTitle) as string[] || ["Loading Title..."]);
  const heroSubtitle = isClientReady ? translationsForLanguage.home.hero.subtitle : getEnglishTranslation(t => t.home.hero.subtitle) as string || "Loading subtitle...";
  const viewWorkButtonText = isClientReady ? translationsForLanguage.home.buttons.viewWork : getEnglishTranslation(t => t.home.buttons.viewWork) as string || "View Work";
  const aboutMeButtonText = isClientReady ? translationsForLanguage.home.buttons.aboutMe : getEnglishTranslation(t => t.home.buttons.aboutMe) as string || "About Me";
  const projectsSectionTitleText = isClientReady ? translationsForLanguage.home.projectsSectionTitle : getEnglishTranslation(t => t.home.projectsSectionTitle) as string || "My Projects";

  let cumulativeLineDelay = 0;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:justify-between">
          {/* Left Column: Title, Subtitle, Buttons */}
          <div className="md:w-1/2 flex flex-col text-left">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground dark:text-foreground text-left">
              {heroFullTitleLines.map((line, lineIndex) => {
                const currentLineDelay = cumulativeLineDelay;
                // Estimate this line's duration for the next line's delay
                // This is an approximation. A more precise calculation would involve WordRevealAnimation exposing its duration.
                const wordsInLine = line.split(' ').filter(w => w.length > 0).length;
                const estimatedLineDuration = (wordsInLine * 0.5) + ((wordsInLine > 0 ? wordsInLine -1 : 0) * 0.15) + 0.3; // approx word anim + delay between + base letter anim
                cumulativeLineDelay += (wordsInLine > 0 ? estimatedLineDuration : 0.3); // Add a small delay even for empty lines if they were to occur


                return (
                  <WordRevealAnimation
                    key={`${language}-line-${lineIndex}-${line}`}
                    text={line || ""}
                    lineBaseDelay={currentLineDelay} // Progressively delay start of each line
                    delayBetweenWords={0.15}     // Time between words on the same line
                    letterStaggerDelay={0.04}    // Time between letters in a word
                    letterAnimationDuration={0.5}// Duration of each letter's animation
                    style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                    className="block" // Each line is a block
                  />
                );
              })}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-full md:max-w-xl mb-10 min-h-[5em] whitespace-pre-line">
              <TypingAnimation
                key={heroSubtitle}
                text={heroSubtitle || ""}
                speed={30}
                startDelay={cumulativeLineDelay + 0.5} // Start typing after title animation
                style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
              />
            </p>
            <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/#projects">
                  <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                    {viewWorkButtonText}
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:border-foreground dark:text-foreground dark:hover:bg-[hsl(270,95%,80%)] dark:hover:text-[hsl(225,30%,10%)] dark:hover:border-[hsl(270,95%,80%)]"
              >
                <Link href="/#about">
                  <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                    {aboutMeButtonText}
                  </span>
                  <ArrowDown size={20} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end items-center md:ml-[150px]">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 aspect-square relative rounded-lg overflow-hidden shadow-lg bg-muted/30 mx-auto md:mx-0">
              <Image
                src="https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/projects//ChatGPT%20Image%20Jun%2015,%202025,%2010_43_19%20PM.png"
                alt="Digital Experiences Placeholder"
                fill
                className="object-contain"
                sizes="(max-width: 767px) 256px, (max-width: 1023px) 320px, 384px"
                data-ai-hint="robot laptop"
              />
            </div>
          </div>
        </div>
      </section>

      {isLoadingProjects ? (
         <section id="projects-loading" className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16 lg:py-20">
           <h2 
            className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 dark:text-foreground"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
           >
             {projectsSectionTitleText}
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex flex-col space-y-3">
                 <Skeleton className="h-[200px] w-full rounded-xl" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                 </div>
                 <div className="flex justify-between items-center pt-2">
                   <Skeleton className="h-8 w-20" />
                   <Skeleton className="h-8 w-24" />
                 </div>
               </div>
             ))}
           </div>
         </section>
      ) : (
        <ProjectList projects={projects} />
      )}
      <AboutMe />
    </div>
  );
}
