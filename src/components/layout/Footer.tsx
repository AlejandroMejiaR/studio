"use client";

import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const { showLoading } = useLoading();
  const { translationsForLanguage, isClientReady, getEnglishTranslation } = useLanguage();

  const returningHomeText = isClientReady
    ? translationsForLanguage.loadingScreen.returningHome
    : getEnglishTranslation(t => t.loadingScreen.returningHome) || "Returning to Home...";

  const portfolioTitleText = isClientReady
    ? translationsForLanguage.footer.portfolioTitle
    : getEnglishTranslation(t => t.footer.portfolioTitle) || "Portfolio";

  const rightsReservedText = isClientReady
    ? translationsForLanguage.footer.rightsReservedText
    : getEnglishTranslation(t => t.footer.rightsReservedText) || "All rights reserved.";

  const quickLinksTitleText = isClientReady
    ? translationsForLanguage.footer.quickLinksTitle
    : getEnglishTranslation(t => t.footer.quickLinksTitle) || "Quick Links";
  
  const projectsLinkText = isClientReady
    ? translationsForLanguage.footer.projectsLink
    : getEnglishTranslation(t => t.footer.projectsLink) || "Projects";

  const aboutMeLinkText = isClientReady
    ? translationsForLanguage.footer.aboutMeLink
    : getEnglishTranslation(t => t.footer.aboutMeLink) || "About Me";


  const handleNavigationToHomeSection = () => {
    // No-op. Navigation is handled by Link's href.
    // The goal is a seamless transition back to the homepage sections
    // without showing a loading indicator.
  };

  return (
    <footer className="bg-footer-bg text-footer-fg py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <h3 className="font-headline text-xl font-semibold mb-2" style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
              {portfolioTitleText}
            </h3>
            <p className="text-sm" style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
              &copy; {currentYear} Alejandro Mejia Rojas. {rightsReservedText}
            </p>
          </div>
          
          <nav className="flex flex-col items-center space-y-2 md:items-start">
            <h4 className="font-headline text-lg font-medium mb-1" style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
              {quickLinksTitleText}
            </h4>
            <Link 
              href="/#projects" 
              className="hover:text-accent transition-colors"
              onClick={handleNavigationToHomeSection}
            >
              <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                {projectsLinkText}
              </span>
            </Link>
            <Link 
              href="/#about" 
              className="hover:text-accent transition-colors"
              onClick={handleNavigationToHomeSection}
            >
              <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                {aboutMeLinkText}
              </span>
            </Link>
            {/* <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link> */}
          </nav>

          <div className="flex justify-center md:justify-end space-x-4">
            <a href="https://github.com/AlejandroMejiaR" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-accent transition-colors">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/alejandro-mejia-rojas-4643991b2/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-accent transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:alejandro197mejia@gmail.com" aria-label="Email" className="hover:text-accent transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
