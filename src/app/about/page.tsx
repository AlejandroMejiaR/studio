
"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { translationsForLanguage, isClientReady, getInitialServerTranslation } = useLanguage();

  const aboutMeTitle = isClientReady 
    ? translationsForLanguage.aboutMe.title 
    : getInitialServerTranslation(t => t.aboutMe.title) || "Sobre Mí";

  const placeholderText = isClientReady
    ? "New content for the about page will be added here."
    : "El nuevo contenido para la página sobre mí se agregará aquí.";

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <h2 
        className="font-headline text-4xl md:text-5xl font-bold text-primary mb-12 dark:text-foreground text-center"
        style={{ visibility: isClientReady ? 'visible' : 'hidden' }}
      >
        {aboutMeTitle}
      </h2>
      
      {/* Placeholder for new content */}
      <div className="text-center text-muted-foreground">
        <p style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
          {placeholderText}
        </p>
      </div>
    </section>
  );
}
