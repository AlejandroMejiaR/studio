
"use client";

import type { Project } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useEffect } from 'react';

// This component is now a lightweight wrapper responsible for client-side effects
// that need to happen on the project page, like smooth scrolling.
// The actual static content is passed as `children` from the Server Component.

const ProjectClientContent = ({ project, children }: { project: Project, children: React.ReactNode }) => {
  // We still need useLanguage to trigger a re-render on the client when the language changes,
  // which makes React replace the server-rendered children with client-rendered ones.
  const { language } = useLanguage();

  const handleSmoothScroll = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    const scrollButton = document.getElementById('scroll-down-button');
    if (scrollButton) {
      scrollButton.addEventListener('click', handleSmoothScroll as EventListener);
    }
    return () => {
      if (scrollButton) {
        scrollButton.removeEventListener('click', handleSmoothScroll as EventListener);
      }
    };
  }, []);

  // The key={language} part is crucial. It tells React to treat the content as
  // a completely new component when the language changes, forcing a re-render
  // with the correctly translated content from the server component structure.
  return (
    <div key={language}>
      {children}
    </div>
  );
};

export default ProjectClientContent;
