
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { getAllProjectsFromFirestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import TypingAnimation from '@/components/effects/TypingAnimation';
import LetterRevealAnimation from '@/components/effects/LetterRevealAnimation';
import Image from 'next/image';
import type { Project } from '@/types';

// This line disables data caching for this page.
// On every request, getAllProjectsFromFirestore will be called.
export const revalidate = 0;

export default async function HomePage() {
  const projects = await getAllProjectsFromFirestore();
  const heroHeadline = "Crafting Digital Experiences";
  const heroSubtitle = "I'm Alejandro. I create interactive experiences by blending Game Design, UX, and Generative AI.\nExplore my work — let's build something amazing together.";

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold mb-10 text-foreground dark:text-foreground text-left">
          <LetterRevealAnimation text={heroHeadline} />
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:justify-between">
          {/* Left Content Block */}
          <div className="md:max-w-lg text-left">
            <p className="text-xl md:text-2xl text-foreground/80 max-w-xl mb-10 min-h-[5em] whitespace-pre-line">
              <TypingAnimation
                text={heroSubtitle}
                speed={30}
                startDelay={1500}
              />
            </p>
            <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/#projects">View My Work</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-accent hover:text-accent-foreground dark:border-foreground dark:text-foreground dark:hover:bg-[hsl(270,95%,80%)] dark:hover:text-[hsl(225,30%,10%)] dark:hover:border-[hsl(270,95%,80%)]"
              >
                <Link href="/#about">
                  About Me <ArrowDown size={20} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Placeholder Image */}
          <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 aspect-square relative rounded-lg overflow-hidden shadow-lg bg-muted/30 mx-auto md:ml-[150px]">
            <Image
              src="https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/projects//ChatGPT%20Image%20Jun%2015,%202025,%2010_43_19%20PM.png"
              alt="Digital Experiences Placeholder"
              fill
              className="object-contain"
              sizes="(max-width: 767px) 256px, (max-width: 1023px) 320px, 384px"
            />
          </div>
        </div>
      </section>

      <ProjectList projects={projects} />
      <AboutMe />
    </div>
  );
}
