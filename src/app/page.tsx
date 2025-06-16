
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { getAllProjectsFromFirestore, getProjectBySlugFromFirestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import TypingAnimation from '@/components/effects/TypingAnimation';
import LetterRevealAnimation from '@/components/effects/LetterRevealAnimation';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import type { Project } from '@/types';

export default async function HomePage() {
  const projects = await getAllProjectsFromFirestore();
  const heroHeadline = "Crafting Digital Experiences";
  const heroSubtitle = "I'm Alejandro. I create interactive experiences by blending Game Design, UX, and Generative AI.\nExplore my work — let's build something amazing together.";

  let featuredProject: Project | undefined;
  try {
    // Attempt to fetch the specific project for the hero carousel
    // Using 'project-showcase-platform' as the assumed slug for "project 1"
    featuredProject = await getProjectBySlugFromFirestore('project-showcase-platform');
  } catch (error) {
    console.error("Error fetching featured project for homepage carousel:", error);
    featuredProject = undefined; // Ensure it's undefined on error
  }

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold mb-10 text-foreground dark:text-foreground text-center">
          <LetterRevealAnimation text={heroHeadline} />
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:justify-center">
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

          {/* Right Placeholder Image */}
          <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 aspect-square relative rounded-lg overflow-hidden shadow-lg bg-muted/30">
            <Image
              src="https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/projects//ChatGPT%20Image%20Jun%2015,%202025,%2010_43_19%20PM.png"
              alt="Digital Experiences Placeholder"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Temporary Carousel for Project 1 */}
      {featuredProject && featuredProject.galleryImages && featuredProject.galleryImages.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 text-center dark:text-foreground">
            Featured Project Showcase
          </h2>
          <Carousel
            opts={{ align: "start", loop: featuredProject.galleryImages.length > 1 }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {featuredProject.galleryImages.map((src, index) => (
                <CarouselItem key={index} className="basis-full"> {/* Shows one image at a time */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={src}
                      alt={`${featuredProject.title} gallery image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 896px"
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {featuredProject.galleryImages.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-[-20px] sm:left-[-30px] md:left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card text-foreground border-border shadow-md" />
                <CarouselNext className="absolute right-[-20px] sm:right-[-30px] md:right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card text-foreground border-border shadow-md" />
              </>
            )}
          </Carousel>
        </section>
      )}

      <ProjectList projects={projects} />
      <AboutMe />
    </>
  );
}
