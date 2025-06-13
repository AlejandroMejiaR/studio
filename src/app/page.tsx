
import AboutMe from '@/components/home/AboutMe';
import ProjectList from '@/components/projects/ProjectList';
import { getAllProjects } from '@/data/projects';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import TypingAnimation from '@/components/effects/TypingAnimation';
import LetterRevealAnimation from '@/components/effects/LetterRevealAnimation';

export default function HomePage() {
  const projects = getAllProjects();
  const heroHeadline = "Crafting Digital Experiences";
  const heroSubtitle = "I'm Your Name, a creative developer transforming ideas into engaging web solutions. Explore my work and let's build something amazing together.";

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-foreground dark:text-foreground">
          <LetterRevealAnimation text={heroHeadline} />
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-10 min-h-[3em] sm:min-h-[2.5em]"> {/* Added min-h to prevent layout shift */}
          <TypingAnimation
            text={heroSubtitle}
            speed={30} 
            startDelay={1500} // Increased delay to start after headline animation
          />
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/#projects">View My Work</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            asChild 
            className="border-primary text-primary dark:border-foreground dark:text-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground"
          >
            <Link href="/#about">
              About Me <ArrowDown size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
      
      <ProjectList projects={projects} />
      <AboutMe />
    </>
  );
}
