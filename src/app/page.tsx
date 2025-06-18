
"use client"; // Make HomePage a client component

import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import { getAllProjectsFromFirestore } from '@/lib/firebase';
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import TypingAnimation from '@/components/effects/TypingAnimation';
import LetterRevealAnimation from '@/components/effects/LetterRevealAnimation';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// export const revalidate = 0; // Revalidate is for server-rendered pages; data fetching is now client-side

export default function HomePage() {
  const { translationsForLanguage } = useLanguage(); // Use the language context

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
        // Optionally set an error state here
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const heroLine1 = translationsForLanguage.home.hero.line1;
  const heroLine2 = translationsForLanguage.home.hero.line2;
  const heroLine3 = translationsForLanguage.home.hero.line3;
  const heroSubtitle = translationsForLanguage.home.hero.subtitle;
  const viewWorkButtonText = translationsForLanguage.home.buttons.viewWork;
  const aboutMeButtonText = translationsForLanguage.home.buttons.aboutMe;


  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:justify-between">
          {/* Left Column: Title, Subtitle, Buttons */}
          <div className="md:w-1/2 flex flex-col text-left">
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-foreground dark:text-foreground">
              <LetterRevealAnimation key={heroLine1} text={heroLine1} className="whitespace-nowrap" />
              {heroLine2 && <br />}
              {heroLine2 && <LetterRevealAnimation key={heroLine2} text={heroLine2} />}
              {heroLine3 && <br />}
              {heroLine3 && <LetterRevealAnimation key={heroLine3} text={heroLine3} />}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-xl mb-10 min-h-[5em] whitespace-pre-line">
              <TypingAnimation
                text={heroSubtitle}
                speed={30}
                startDelay={1500} 
              />
            </p>
            <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/#projects">{viewWorkButtonText}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:border-foreground dark:text-foreground dark:hover:bg-[hsl(270,95%,80%)] dark:hover:text-[hsl(225,30%,10%)] dark:hover:border-[hsl(270,95%,80%)]"
              >
                <Link href="/#about">
                  {aboutMeButtonText} <ArrowDown size={20} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end items-center md:ml-[150px]">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 aspect-square relative rounded-lg overflow-hidden shadow-lg bg-muted/30 mx-auto md:mx-0">
              <Image
                src="https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/projects//ChatGPT%20Image%20Jun%2015,%202025,%2010_43_19%20PM.png"
                alt="Digital Experiences Placeholder" // This alt text could also be translated
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
           <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 dark:text-foreground">
             My Projects
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
