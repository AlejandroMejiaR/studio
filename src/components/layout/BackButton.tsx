
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLoading } from '@/contexts/LoadingContext';

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const { getEnglishTranslation, isClientReady, translationsForLanguage } = useLanguage();
  const { showLoading } = useLoading();

  const goBackText = isClientReady 
    ? translationsForLanguage.nav.goBack 
    : getEnglishTranslation(t => t.nav.goBack) || "Go Back";

  const returningHomeText = isClientReady
    ? translationsForLanguage.loadingScreen.returningHome
    : getEnglishTranslation(t => t.loadingScreen.returningHome) || ["Returning to Home..."];

  const handleGoHome = () => {
    showLoading(returningHomeText);
    router.push('/');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleGoHome}
      className={className}
      aria-label={goBackText}
    >
      <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
    </Button>
  );
}
