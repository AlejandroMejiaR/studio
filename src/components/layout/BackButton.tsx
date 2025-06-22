
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const { getEnglishTranslation, isClientReady, translationsForLanguage } = useLanguage();

  const goBackText = isClientReady 
    ? translationsForLanguage.nav.goBack 
    : getEnglishTranslation(t => t.nav.goBack) || "Go Back";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.back()}
      className={className}
      aria-label={goBackText}
    >
      <ArrowLeft className="h-6 w-6" />
    </Button>
  );
}
