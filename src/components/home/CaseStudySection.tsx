
"use client";

import type { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CaseStudySectionProps {
  projects: Project[];
}

const CaseStudySection = ({ projects }: CaseStudySectionProps) => {
  const { language, translationsForLanguage } = useLanguage();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left">
        {translationsForLanguage.home.caseStudiesTitle}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => {
          const currentLangKey = language.toLowerCase() as 'en' | 'es';
          const content = project[currentLangKey] || project.en;

          return (
            <Link key={project.id} href={`/projects/${project.slug}`} className="block group">
              <Card className="relative aspect-square overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {/* Background Image */}
                <Image
                  src={project.thumbnailUrl}
                  alt={content.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-in-out"
                  data-ai-hint="portfolio project"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <Badge variant="secondary" className="mb-3 w-fit bg-white/20 text-white border-0">
                    {project.category}
                  </Badge>
                  <h3 className="font-headline text-2xl font-bold mb-2">
                    {content.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed text-sm flex-grow overflow-hidden max-h-12">
                    {content.shortDescription}
                  </p>
                  
                  {/* Button visible on hover */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <Button size="lg" variant="outline" className="w-full text-lg bg-transparent text-white border-white hover:bg-white hover:text-black pointer-events-none">
                        {translationsForLanguage.projectDetails.viewCaseStudy}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CaseStudySection;
