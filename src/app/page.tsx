
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { getAllProjects } from '@/data/projects';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import TypingAnimation from '@/components/effects/TypingAnimation';
import LetterRevealAnimation from '@/components/effects/LetterRevealAnimation';
import InteractiveCharacterModel from '@/components/home/InteractiveCharacterModel'; // Import the new component
import { getSupabaseImageUrl } from '@/lib/supabase'; // To construct asset URLs


export default function HomePage() {
  const projects = getAllProjects();
  const heroHeadline = "Crafting Digital Experiences";
  const heroSubtitle = "I’m Alejandro. I create interactive experiences by blending Game Design, UX, and Generative AI.\nExplore my work — let’s build something amazing together.";

  // Define Supabase asset URLs
  // IMPORTANT: Replace 'portfolio-assets' with your actual bucket name
  // and 'character_animated' with your actual folder name if different.
  const bucketName = 'portfolio-assets'; // Or your chosen bucket name
  const modelFolder = 'character_animated'; // Or your chosen folder path within the bucket

  const modelUrl = getSupabaseImageUrl(bucketName, `${modelFolder}/character_base.glb`);
  const idleAnimUrl = getSupabaseImageUrl(bucketName, `${modelFolder}/animation_Idle.fbx`);
  const dance1AnimUrl = getSupabaseImageUrl(bucketName, `${modelFolder}/animation_Dance1.fbx`);
  const dance2AnimUrl = getSupabaseImageUrl(bucketName, `${modelFolder}/animation_Dance.fbx`); // Assuming animation_Dance.fbx is the second dance
  const endClapAnimUrl = getSupabaseImageUrl(bucketName, `${modelFolder}/animation_EndClap.fbx`);

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold mb-10 text-foreground dark:text-foreground text-center">
          <LetterRevealAnimation text={heroHeadline} />
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:justify-center"> {/* Increased gap from gap-6 md:gap-10 */}
          {/* Left Content Block */}
          <div className="md:max-w-lg text-center md:text-left">
            <p className="text-xl md:text-2xl text-foreground/80 max-w-xl mx-auto md:mx-0 mb-10 min-h-[3em] sm:min-h-[2.5em] whitespace-pre-line">
              <TypingAnimation
                text={heroSubtitle}
                speed={30}
                startDelay={1500}
              />
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4">
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

          {/* Right 3D Model - Replaced placeholder */}
          <InteractiveCharacterModel
            modelUrl={modelUrl}
            idleAnimUrl={idleAnimUrl}
            dance1AnimUrl={dance1AnimUrl}
            dance2AnimUrl={dance2AnimUrl}
            endClapAnimUrl={endClapAnimUrl}
            containerClassName="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 aspect-square" // Container sizing
          />
        </div>
      </section>

      <ProjectList projects={projects} />
      <AboutMe />
    </>
  );
}
