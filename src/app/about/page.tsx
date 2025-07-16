
"use client";

import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import WordRevealAnimation from '@/components/effects/WordRevealAnimation';
import * as React from 'react';
import { SectionContainer } from '@/components/layout/SectionContainer';

const AboutPage = () => {
    
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

  return (
    <SectionContainer>
      
      {/* Section 1: Introduction */}
      <section className="py-5">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="md:w-1/2 text-left text-lg text-foreground/80 leading-relaxed">
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
          {/* Image */}
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-sm h-96">
               <Image
                src="https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents//Profile.jpeg"
                alt="Alejandro Mejia Rojas Portrait"
                fill
                className="object-cover rounded-lg shadow-lg"
                data-ai-hint="professional portrait"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Skills & Technologies */}
      <section className="py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
      </section>

      {/* Section 3: Education */}
      <section className="py-5">
        <h2 className="font-headline text-4xl font-bold text-primary dark:text-foreground mb-12 text-center">Education</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
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
      </section>

      {/* Section 4: Get In Touch */}
      <section className="text-center py-5">
         <WordRevealAnimation
            text="Get In Touch"
            className="font-headline text-6xl md:text-8xl font-extrabold"
        />
      </section>
    </SectionContainer>
  );
};

export default AboutPage;
