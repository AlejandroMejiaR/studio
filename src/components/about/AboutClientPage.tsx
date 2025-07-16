
"use client";

import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionContainer } from '@/components/layout/SectionContainer';
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

  const imageStack = [
    {
      src: "https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents//Profile.jpeg",
      alt: "Alejandro Mejia Rojas Portrait",
      rotation: "rotate-2",
      hint: "professional portrait"
    },
    {
      src: "https://placehold.co/600x400.png",
      alt: "Workspace with design tools",
      rotation: "-rotate-2",
      hint: "workspace design"
    },
    {
      src: "https://placehold.co/600x400.png",
      alt: "Videogame development on screen",
      rotation: "rotate-1",
      hint: "game development"
    },
  ];


  return (
    <SectionContainer>
      
      {/* Section 1: Two-column layout with Intro, Skills, Tech, and Image Stack */}
      <section className="py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-10">
            {/* Intro Text */}
            <div className="text-left text-lg text-foreground/80 leading-relaxed">
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

            {/* Skills */}
            <div>
              <h3 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-8">Skills</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-xl text-accent mb-4">UX</h4>
                  <ul className="space-y-2 text-foreground/80">
                    {skills.ux.map(skill => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-accent mb-4">Game Design</h4>
                  <ul className="space-y-2 text-foreground/80">
                    {skills.gameDesign.map(skill => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-8">Technologies</h3>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-xl text-accent mb-4">Design</h4>
                  <ul className="space-y-2 text-foreground/80">
                    {technologies.design.map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-accent mb-4">Develop</h4>
                  <ul className="space-y-2 text-foreground/80">
                    {technologies.develop.map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-accent mb-4">Management</h4>
                  <ul className="space-y-2 text-foreground/80">
                    {technologies.management.map(tech => <li key={tech}>{tech}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Stack */}
          <div className="relative h-full flex items-center justify-center pt-10 md:pt-0">
            <div className="relative w-full h-[500px]">
              {imageStack.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    'absolute w-[70%] aspect-[4/5] transition-all duration-300 ease-in-out group hover:z-10',
                    image.rotation
                  )}
                  style={{
                    top: `${index * 20}%`,
                    left: `${(index % 2) * 10}%`,
                  }}
                >
                  <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      data-ai-hint={image.hint}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Education */}
      <section className="py-5">
        <div className="max-w-4xl">
          <h2 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-12 text-left">Education</h2>
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
      </section>
    </SectionContainer>
  );
};

export default AboutClientPage;
