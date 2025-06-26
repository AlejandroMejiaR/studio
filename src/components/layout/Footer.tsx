
"use client";

import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { translationsForLanguage, isClientReady, getInitialServerTranslation } = useLanguage();
  const pathname = usePathname();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (pathname === '/' && href?.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.substring(2);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const portfolioTitleText = isClientReady
    ? translationsForLanguage.footer.portfolioTitle
    : getInitialServerTranslation(t => t.footer.portfolioTitle) || "Portafolio";

  const rightsReservedText = isClientReady
    ? translationsForLanguage.footer.rightsReservedText
    : getInitialServerTranslation(t => t.footer.rightsReservedText) || "Todos los derechos reservados.";

  const quickLinksTitleText = isClientReady
    ? translationsForLanguage.footer.quickLinksTitle
    : getInitialServerTranslation(t => t.footer.quickLinksTitle) || "Enlaces Rápidos";
  
  const projectsLinkText = isClientReady
    ? translationsForLanguage.footer.projectsLink
    : getInitialServerTranslation(t => t.footer.projectsLink) || "Proyectos";

  const aboutMeLinkText = isClientReady
    ? translationsForLanguage.footer.aboutMeLink
    : getInitialServerTranslation(t => t.footer.aboutMeLink) || "Sobre Mí";

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
              onClick={handleSmoothScroll}
            >
              <span style={{ visibility: isClientReady ? 'visible' : 'hidden' }}>
                {projectsLinkText}
              </span>
            </Link>
            <Link 
              href="/#about" 
              className="hover:text-accent transition-colors"
              onClick={handleSmoothScroll}
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
