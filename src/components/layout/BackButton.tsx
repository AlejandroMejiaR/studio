
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function BackButton({ className }: { className?: string }) {
  const { getInitialServerTranslation, isClientReady, translationsForLanguage } = useLanguage();

  const goBackText = isClientReady 
    ? translationsForLanguage.nav.goBack 
    : getInitialServerTranslation(t => t.nav.goBack) || "Regresar";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-16 w-16 flex-shrink-0", className)}
      aria-label={goBackText}
      asChild
    >
      <Link href="/#projects">
        <ArrowLeft className="h-10 w-10" strokeWidth={2.5} />
      </Link>
    </Button>
  );
}
