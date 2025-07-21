
"use client";

import type { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CaseStudySectionProps {
  projects: Project[];
}

const CaseStudySection = ({ projects }: CaseStudySectionProps) => {
  const { language, translationsForLanguage } = useLanguage();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-20 md:space-y-28">
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left">
        {translationsForLanguage.home.caseStudiesTitle}
      </h2>
      {projects.map((project, index) => {
        const isReversed = index % 2 === 0; // Starts with Text-Image layout
        const currentLangKey = language.toLowerCase() as 'en' | 'es';
        const content = project[currentLangKey] || project.en;

        return (
          <div key={project.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image Column */}
            <div className={cn("relative aspect-[4/3] rounded-lg overflow-hidden group", isReversed && "md:order-last")}>
              <Image
                src={project.thumbnailUrl}
                alt={content.title}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint="portfolio project"
              />
            </div>

            {/* Text Column */}
            <div className={cn("flex flex-col items-start text-left", isReversed && "md:order-first")}>
              <Badge variant="secondary" className="mb-4">
                {project.category}
              </Badge>
              <h3 className="font-headline text-3xl md:text-4xl font-bold text-primary dark:text-foreground mb-4">
                {content.title}
              </h3>
              <p className="text-foreground/80 mb-8 text-lg leading-relaxed">
                {content.shortDescription}
              </p>
              <Button asChild size="lg" variant="link" className="p-0 text-lg text-accent hover:text-accent/90">
                <Link href={`/projects/${project.slug}`}>
                  {translationsForLanguage.projectDetails.viewCaseStudy}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CaseStudySection;
