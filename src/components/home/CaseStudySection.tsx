
"use client";

import type { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {projects.map((project) => {
          const currentLangKey = language.toLowerCase() as 'en' | 'es';
          const content = project[currentLangKey] || project.en;

          return (
            <Link key={project.id} href={`/projects/${project.slug}`} className="block h-full group">
              <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-transform duration-300 group-hover:scale-105">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={project.thumbnailUrl}
                    alt={content.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    data-ai-hint="portfolio project"
                  />
                </div>

                <div className="flex flex-col flex-grow p-6">
                  <Badge variant="outline" className="mb-4 text-foreground/80 border-current w-fit">
                    {project.category}
                  </Badge>
                  <h3 className="font-headline text-2xl font-bold text-primary dark:text-foreground mb-3">
                    {content.title}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed flex-grow">
                    {content.shortDescription}
                  </p>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Button size="lg" variant="outline" className="w-full text-lg border-accent text-accent group-hover:bg-accent group-hover:text-accent-foreground pointer-events-none">
                      {translationsForLanguage.projectDetails.viewCaseStudy}
                      <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
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
