
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface CreativeProjectsSectionProps {
  projects: Project[];
}

const CreativeProjectsSection = ({ projects }: CreativeProjectsSectionProps) => {
  const { language, translationsForLanguage } = useLanguage();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-foreground text-left mb-12">
        {translationsForLanguage.home.creativeProjectsTitle}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project) => {
          const content = project[language.toLowerCase() as 'en' | 'es'] || project.en;
          
          return (
            <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
              <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <Image
                    src={project.thumbnailUrl}
                    alt={content.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    data-ai-hint="creative project screenshot"
                  />
                </div>
                <CardContent className="p-4">
                  <CardTitle className="font-headline text-xl font-semibold text-primary dark:text-foreground mb-2 truncate">
                    {content.title}
                  </CardTitle>
                  <CardDescription className="text-foreground/80 text-sm leading-relaxed">
                    {content.shortDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CreativeProjectsSection;
