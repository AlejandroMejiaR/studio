
"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutClientPage = () => {
  const { translationsForLanguage } = useLanguage();
    
  const educationItems = [
    {
      course: "UX Design Professional Certificate",
      institution: "Google",
      date: "(2025)",
      logo: "https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Logos/Google.webp",
    },
    {
      course: translationsForLanguage.aboutMe.education.course1,
      institution: "Universidad Militar Nueva Granada",
      date: "(2020 - Present)",
      logo: "https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Logos/UMNG.webp",
    },
  ];

  const skills = {
    ux: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
    gameDesign: ["Game Mechanics", "Level Design", "Narrative Design", "Playtesting"]
  }

  const technologies = {
    design: ["Figma", "Adobe XD", "Photoshop"],
    develop: ["Unity", "Unreal Engine", "React", "JavaScript"],
    management: ["Jira", "Trello", "Git"]
  }

  const profileImage = {
    src: "https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents//MeS.webp",
    alt: "Alejandro Mejia Rojas Portrait",
    rotation: "-rotate-1",
    hint: "professional portrait"
  };

  return (
    <div className="container">
      
      {/* Section 1: Intro Text and Single Image */}
      <div className="pt-32 pb-32">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-16">
          {/* Left Column - Intro Text */}
          <div className="w-full max-w-lg text-left text-lg text-foreground/80 leading-relaxed flex-shrink-0">
            <h2 className="font-headline text-5xl font-bold text-primary dark:text-foreground mb-6">{translationsForLanguage.aboutMe.title}</h2>
            <p>
              {translationsForLanguage.aboutMe.paragraph1}
            </p>
            <br />
            <p>
              {translationsForLanguage.aboutMe.paragraph2}
            </p>
            <div className="mt-6">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Link href="mailto:alejandro197mejia@gmail.com">
                  {translationsForLanguage.aboutMe.workTogether}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Single Image */}
          <div className="w-full max-w-xs flex-shrink-0">
             <div className={cn("relative w-full aspect-[4/5] rounded-lg overflow-hidden transition-all duration-300 ease-in-out group-hover:scale-105", profileImage.rotation)}>
              <Image
                src={profileImage.src}
                alt={profileImage.alt}
                fill
                className={cn('object-cover')}
                data-ai-hint={profileImage.hint}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Skills and Technologies */}
      <div className="w-full max-w-4xl mx-auto pb-32">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Skills */}
          <div className="mb-12 md:mb-0">
            <h3 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-8 text-center md:text-left">{translationsForLanguage.aboutMe.skillsTitle}</h3>
            <div className="flex justify-center md:justify-start gap-8">
              <div className="text-left">
                <h4 className="font-semibold text-xl text-accent mb-4">UX</h4>
                <ul className="space-y-1 text-foreground/80">
                  {skills.ux.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-xl text-accent mb-4">{translationsForLanguage.aboutMe.skills.gameDesign}</h4>
                <ul className="space-y-1 text-foreground/80">
                  {skills.gameDesign.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="md:ml-auto">
            <h3 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-8 text-center md:text-left">{translationsForLanguage.aboutMe.technologiesTitle}</h3>
            <div className="flex justify-center md:justify-start gap-8 flex-wrap">
              <div className="text-left">
                <h4 className="font-semibold text-xl text-accent mb-4">{translationsForLanguage.aboutMe.tech_areas.design}</h4>
                <ul className="space-y-1 text-foreground/80">
                  {technologies.design.map(tech => <li key={tech}>{tech}</li>)}
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-xl text-accent mb-4">{translationsForLanguage.aboutMe.tech_areas.develop}</h4>
                <ul className="space-y-1 text-foreground/80">
                  {technologies.develop.map(tech => <li key={tech}>{tech}</li>)}
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-xl text-accent mb-4">{translationsForLanguage.aboutMe.tech_areas.management}</h4>
                <ul className="space-y-1 text-foreground/80">
                  {technologies.management.map(tech => <li key={tech}>{tech}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section 3: Education */}
      <div className="w-full max-w-4xl mx-auto pb-24 mb-24">
        <h2 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-8 text-left">{translationsForLanguage.aboutMe.education.title}</h2>
        <div className="w-full space-y-4">
          {educationItems.map((item, index) => (
            <div key={index} className="flex items-center w-full text-left border-b py-4 gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={item.logo}
                  alt={`${item.institution} logo`}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="font-semibold text-lg">{item.course}</span>
                <span className="text-muted-foreground text-left sm:text-right mt-1 sm:mt-0">
                  {item.institution} <span className="text-sm">{item.date}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AboutClientPage;
