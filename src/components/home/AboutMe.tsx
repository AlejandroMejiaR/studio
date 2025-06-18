
"use client"; // Ensure this is a client component

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, DraftingCompass, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabaseImageUrl } from '@/lib/supabase';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage

const AboutMe = () => {
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage(); // Use the hook

  const skills = ['Game Design', 'UX Design', 'Unity', 'Unreal Engine', 'C#', 'C++', 'JS', 'Python', 'Git', 'Generative AI', 'English B2'];
  const cvUrl = getSupabaseImageUrl('documents', 'ResumeEN.pdf');

  // Determine text based on client readiness and language
  const aboutMeTitle = isClientReady ? translationsForLanguage.aboutMe.title : getEnglishTranslation(t => t.aboutMe.title);
  const paragraph1 = isClientReady ? translationsForLanguage.aboutMe.paragraph1 : getEnglishTranslation(t => t.aboutMe.paragraph1);


  return (
    <section id="about" className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16 lg:py-20">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <Card className="w-full max-w-sm shadow-xl">
            <CardContent className="p-0">
              <Image
                src="https://placehold.co/400x500/122624/F2F2F2.png?text=Your+Photo"
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
                <Button variant="outline" className="mt-4 w-full text-accent border-accent hover:bg-accent hover:text-accent-foreground" asChild>
                  <a href={cvUrl} download="Alejandro_Mejia_Rojas_CV.pdf" target="_blank" rel="noopener noreferrer">
                    <Download size={18} className="mr-2" />
                    Download CV
                  </a>
                </Button>
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
          <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
            When I’m not coding, you’ll find me exploring new design trends or savoring a good cup of coffee. I believe in continuous learning and am constantly seeking to broaden my skill set—always ready for the next challenge and collaboration.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="bg-secondary/30 dark:bg-[hsl(270,30%,20%)]">
              <CardHeader className="items-center sm:items-start">
                <Brain size={32} className="text-accent mb-2" />
                <CardTitle className="text-lg font-headline text-primary dark:text-foreground">Experience</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p className="text-lg font-bold text-accent">Continuous Learner</p>
                <p className="text-sm text-muted-foreground"></p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/30 dark:bg-[hsl(270,30%,20%)]">
              <CardHeader className="items-center sm:items-start">
                <DraftingCompass size={32} className="text-accent mb-2" />
                <CardTitle className="text-lg font-headline text-primary dark:text-foreground">Projects</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p className="text-2xl font-bold text-accent">5+</p>
                <p className="text-sm text-muted-foreground">Web, Unity & Unreal prototyping</p>
              </CardContent>
            </Card>
             <Card className="bg-secondary/30 dark:bg-[hsl(270,30%,20%)]">
              <CardHeader className="items-center sm:items-start">
                <Sparkles size={32} className="text-accent mb-2" />
                <CardTitle className="text-lg font-headline text-primary dark:text-foreground">Focus</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p className="text-lg font-semibold text-accent">Game Design & Gen AI</p>
                <p className="text-sm text-muted-foreground"></p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="font-headline text-2xl font-semibold text-primary mb-4 dark:text-foreground">My Skills</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span key={skill} className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
