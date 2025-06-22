
"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherTooltipProps {
  show: boolean;
  onClose: () => void;
}

const LanguageSwitcherTooltip = ({ show, onClose }: LanguageSwitcherTooltipProps) => {
  const { translationsForLanguage } = useLanguage();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500); // 3s display + 0.5s fade out
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute z-[100] flex w-max max-w-xs items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-lg whitespace-nowrap",
        "animate-fadeInThenOut",
        "bottom-full left-1/2 mb-2 -translate-x-1/2" // Centered above
      )}
    >
      <span>{translationsForLanguage.nav.changeLanguageHint}</span>
      <div className="absolute top-full left-1/2 -translate-x-1/2 h-0 w-0 border-x-8 border-x-transparent border-t-[8px] border-t-primary"></div>
    </div>
  );
};

export default LanguageSwitcherTooltip;
