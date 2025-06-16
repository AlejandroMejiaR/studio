
"use client";

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerOverlayProps {
  isLoading: boolean;
}

const LoadingSpinnerOverlay = ({ isLoading }: LoadingSpinnerOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 p-8 bg-card rounded-lg shadow-2xl">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">Loading Project...</p>
      </div>
    </div>
  );
};

export default LoadingSpinnerOverlay;
