
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function BackButton({ className }: { className?: string }) {
  const { getEnglishTranslation, isClientReady, translationsForLanguage } = useLanguage();

  const goBackText = isClientReady 
    ? translationsForLanguage.nav.goBack 
    : getEnglishTranslation(t => t.nav.goBack) || "Go Back";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("flex-shrink-0", className)}
      aria-label={goBackText}
      asChild
    >
      <Link href="/#projects">
        <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
      </Link>
    </Button>
  );
}
