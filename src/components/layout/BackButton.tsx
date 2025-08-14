
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
      variant="outline"
      size="icon"
      className={cn(
        "h-16 w-16 flex-shrink-0 rounded-full border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground",
        "[&_svg]:size-8",
        className
      )}
      aria-label={goBackText}
      asChild
    >
      <Link href="/#projects">
        <ArrowLeft strokeWidth={2.5} />
      </Link>
    </Button>
  );
}
