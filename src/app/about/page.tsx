"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import AboutPageContent from './AboutPageContent';

// This client component now only acts as a wrapper to provide the language context
// to the server component that renders the actual content.
const AboutPageWrapper = () => {
  const { translationsForLanguage } = useLanguage();

  return <AboutPageContent t={translationsForLanguage} />;
};

export default AboutPageWrapper;
