
"use client";

// import type { Metadata } from 'next'; // Metadata cannot be exported from Client Component
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { FooterProvider, useFooter } from '@/contexts/FooterContext';
import { NavbarVisibilityProvider, useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import LoadingSpinnerOverlay from '@/components/layout/LoadingSpinnerOverlay';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react'; // Added useState
import { useLoading } from '@/contexts/LoadingContext';
import { cn } from '@/lib/utils';


function LayoutClientLogic({ children }: { children: React.ReactNode }) {
  const { isPageLoading, loadingText, hideLoading } = useLoading();
  const { isClientReady } = useLanguage();
  const { isFooterVisible } = useFooter();
  const { isNavbarVisible, isNavbarReadyToAnimateIn } = useNavbarVisibility(); // Added isNavbarReadyToAnimateIn
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isClientReady) {
        hideLoading();
    }
  }, [pathname, searchParams, hideLoading, isClientReady]);

  if (!isClientReady) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {isNavbarVisible && (
          <div className={cn(pathname === '/' && isNavbarReadyToAnimateIn && 'animate-fadeInNavbarDelayed')}>
            <Navbar />
          </div>
        )}
        <main className="flex-grow">
          <Suspense fallback={<div></div>}>
            {children}
          </Suspense>
        </main>
        {isFooterVisible && <Footer />}
      </div>
      <ScrollToTopButton />
      <Toaster />
      <LoadingSpinnerOverlay isLoading={isPageLoading} loadingText={loadingText} />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  const themeKey = 'portfolio-ace-theme';
  try {
    const storedTheme = localStorage.getItem(themeKey);
    if (storedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else { // Default to dark if 'dark' is stored OR no theme is stored at all
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    console.warn('Initial theme application error:', e);
  }
})();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning={true}>
        <LanguageProvider>
          <LoadingProvider>
            <FooterProvider>
              <NavbarVisibilityProvider>
                <LayoutClientLogic>
                  {children}
                </LayoutClientLogic>
              </NavbarVisibilityProvider>
            </FooterProvider>
          </LoadingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
