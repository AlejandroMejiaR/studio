
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
  const paragraph2 = isClientReady ? translationsForLanguage.aboutMe.paragraph2 : getEnglishTranslation(t => t.aboutMe.paragraph2);
  
  const experienceCardTitle = isClientReady ? translationsForLanguage.aboutMe.experienceCard.title : getEnglishTranslation(t => t.aboutMe.experienceCard.title);
  const experienceCardDetail = isClientReady ? translationsForLanguage.aboutMe.experienceCard.detail : getEnglishTranslation(t => t.aboutMe.experienceCard.detail);

  const projectsCardTitle = isClientReady ? translationsForLanguage.aboutMe.projectsCard.title : getEnglishTranslation(t => t.aboutMe.projectsCard.title);
  const projectsCardDetailNumber = isClientReady ? translationsForLanguage.aboutMe.projectsCard.detailNumber : getEnglishTranslation(t => t.aboutMe.projectsCard.detailNumber);
  const projectsCardDetailText = isClientReady ? translationsForLanguage.aboutMe.projectsCard.detailText : getEnglishTranslation(t => t.aboutMe.projectsCard.detailText);
  
  const focusCardTitle = isClientReady ? translationsForLanguage.aboutMe.focusCard.title : getEnglishTranslation(t => t.aboutMe.focusCard.title);
  const focusCardDetail = isClientReady ? translationsForLanguage.aboutMe.focusCard.detail : getEnglishTranslation(t => t.aboutMe.focusCard.detail);

  const skillsTitle = isClientReady ? translationsForLanguage.aboutMe.skillsTitle : getEnglishTranslation(t => t.aboutMe.skillsTitle);
  const downloadCVButtonText = isClientReady ? translationsForLanguage.aboutMe.downloadCVButton : getEnglishTranslation(t => t.aboutMe.downloadCVButton);


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
                    <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                      {downloadCVButtonText}
                    </span>
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
          <p 
            className="text-lg text-foreground/80 mb-8 leading-relaxed"
            style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
          >
            {paragraph2}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="bg-secondary/30 dark:bg-[hsl(270,30%,20%)]">
              <CardHeader className="items-center sm:items-start">
                <Brain size={32} className="text-accent mb-2" />
                <CardTitle 
                  className="text-lg font-headline text-primary dark:text-foreground"
                  style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                >
                  {experienceCardTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p 
                  className="text-lg font-bold text-accent"
                  style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                >
                  {experienceCardDetail}
                </p>
                <p className="text-sm text-muted-foreground"></p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/30 dark:bg-[hsl(270,30%,20%)]">
              <CardHeader className="items-center sm:items-start">
                <DraftingCompass size={32} className="text-accent mb-2" />
                <CardTitle 
                  className="text-lg font-headline text-primary dark:text-foreground"
                  style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                >
                  {projectsCardTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p 
                  className="text-2xl font-bold text-accent"
                  style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                >
                  {projectsCardDetailNumber}
                </p>
                <p 
                  className="text-sm text-muted-foreground"
                  style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                >
                  {projectsCardDetailText}
                </p>
              </CardContent>
            </Card>
             <Card className="bg-secondary/30 dark:bg-[hsl(270,30%,20%)]">
              <CardHeader className="items-center sm:items-start">
                <Sparkles size={32} className="text-accent mb-2" />
                <CardTitle 
                  className="text-lg font-headline text-primary dark:text-foreground"
                  style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                >
                  {focusCardTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p 
                  className="text-lg font-semibold text-accent"
                  style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
                >
                  {focusCardDetail}
                </p>
                <p className="text-sm text-muted-foreground"></p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 
              className="font-headline text-2xl font-semibold text-primary mb-4 dark:text-foreground"
              style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
            >
              {skillsTitle}
            </h3>
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
