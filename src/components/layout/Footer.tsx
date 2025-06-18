
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

  const handleNavigationToHomeSection = () => {
    if (pathname.startsWith('/projects/')) {
      showLoading(returningHomeText);
    }
    // Navigation will be handled by the Link component's href
  };

  return (
    <footer className="bg-footer-bg text-footer-fg py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <h3 className="font-headline text-xl font-semibold mb-2">Portfolio</h3>
            <p className="text-sm">&copy; {currentYear} Alejandro Mejia Rojas. All rights reserved.</p>
          </div>
          
          <nav className="flex flex-col items-center space-y-2 md:items-start">
            <h4 className="font-headline text-lg font-medium mb-1">Quick Links</h4>
            <Link 
              href="/#projects" 
              className="hover:text-accent transition-colors"
              onClick={handleNavigationToHomeSection}
            >
              Projects
            </Link>
            <Link 
              href="/#about" 
              className="hover:text-accent transition-colors"
              onClick={handleNavigationToHomeSection}
            >
              About Me
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
