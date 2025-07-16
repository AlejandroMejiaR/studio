
"use client";

import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from '@/lib/utils';

const AboutClientPage = () => {
    
  const educationItems = [
    {
      course: "Multimedia Engineering",
      institution: "Universidad Militar Nueva Granada",
      date: "(2020 - Present)",
      description: "Relevant coursework in interactive design, application development, and user experience."
    },
    {
      course: "High School Diploma",
      institution: "Gimnasio Campestre La Fontana",
      date: "(2006 - 2019)",
      description: "Graduated with an emphasis on sciences and technology."
    }
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
    src: "https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents//Profile.jpeg",
    alt: "Alejandro Mejia Rojas Portrait",
    rotation: "rotate-2",
    hint: "professional portrait"
  };

  return (
    <div className="container">
      
      {/* Section 1: Intro Text and Single Image */}
      <div className="pt-32 pb-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-16">
          {/* Left Column - Intro Text */}
          <div className="w-full max-w-lg text-left text-lg text-foreground/80 leading-relaxed flex-shrink-0">
            <h2 className="font-headline text-5xl font-bold text-primary dark:text-foreground mb-6">Hello Again!</h2>
            <p>
              I am an aspiring Multimedia Engineer, currently in my 10th semester in Bogotá, Colombia. I specialize in the development of interactive applications and interaction design (UX). My journey in technology is driven by a passion for problem-solving and for creating digital solutions that are both functional and visually appealing.
            </p>
            <br />
            <p>
              I'm always learning, open to new challenges and collaborations.
            </p>
            <p className="mt-4">
              <a href="mailto:alejandro197mejia@gmail.com" className="font-bold text-accent hover:text-accent/90 no-underline transition-colors">
                Let’s Work Together.
              </a>
            </p>
          </div>

          {/* Right Column - Single Image */}
          <div className="w-full max-w-xs flex-shrink-0">
            <div
              className={cn(
                'relative w-full aspect-[4/5] transition-all duration-300 ease-in-out group hover:z-10 hover:scale-105',
                profileImage.rotation
              )}
            >
              <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={profileImage.src}
                  alt={profileImage.alt}
                  fill
                  className="object-cover"
                  data-ai-hint={profileImage.hint}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Centered Skills, Tech, and Education */}
      <div className="pb-24 mb-24">
        <div className="flex flex-col items-center gap-16 md:gap-20">

          <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between gap-12">
            {/* Skills */}
            <div>
              <h3 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-8 text-left">Skills</h3>
              <div className="flex justify-start gap-8">
                <div className="text-left">
                  <h4 className="font-semibold text-xl text-accent mb-4">UX</h4>
                  <ul className="space-y-1 text-foreground/80">
                    {skills.ux.map(skill => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-xl text-accent mb-4">Game Design</h4>
                  <ul className="space-y-1 text-foreground/80">
                    {skills.gameDesign.map(skill => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-8 text-left">Technologies</h3>
              <div className="flex justify-start gap-8 flex-wrap">
                <div className="text-left">
                  <h4 className="font-semibold text-xl text-accent mb-4">Design</h4>
                  <ul className="space-y-2 text-foreground/80">
                    {technologies.design.map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-xl text-accent mb-4">Develop</h4>
                  <ul className="space-y-2 text-foreground/80">
                    {technologies.develop.map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-xl text-accent mb-4">Management</h4>
                  <ul className="space-y-2 text-foreground/80">
                    {technologies.management.map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>


          {/* Education */}
          <div className="w-full max-w-4xl">
            <h2 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-8 text-left">Education</h2>
            <Accordion type="single" collapsible className="w-full">
              {educationItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full text-left">
                      <span className="font-semibold text-lg">{item.course}</span>
                      <span className="text-muted-foreground text-right">{item.institution} <span className="text-sm">{item.date}</span></span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AboutClientPage;
