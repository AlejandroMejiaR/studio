
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import { LoadingProvider } from '@/contexts/LoadingContext'; // New
import LoadingSpinnerOverlay from '@/components/layout/LoadingSpinnerOverlay'; // New
import { usePathname, useSearchParams } from 'next/navigation'; // New
import { useEffect, Suspense } from 'react'; // New
import { useLoading } from '@/contexts/LoadingContext'; // New

// Metadata cannot be exported from a Client Component.
// It has been removed from this file.
// Global metadata (like favicons) can be handled by Next.js file conventions
// or by exporting metadata from Server Component pages.

// Client Component to handle loading state consumption and effects
function LayoutClientLogic({ children }: { children: React.ReactNode }) {
  const { isPageLoading, hideLoading } = useLoading();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Hide loading whenever pathname or searchParams change (i.e., navigation completes)
    hideLoading();
  }, [pathname, searchParams, hideLoading]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {/* Suspense for Next.js's own loading.tsx files */}
          <Suspense fallback={<div>{/* Minimal global fallback, or none if route specific loading.tsx is preferred */}</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </div>
      <ScrollToTopButton />
      <Toaster />
      <LoadingSpinnerOverlay isLoading={isPageLoading} />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <LoadingProvider>
          <LayoutClientLogic>
            {children}
          </LayoutClientLogic>
        </LoadingProvider>
      </body>
    </html>
  );
}
