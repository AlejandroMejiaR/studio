
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
import { NavbarVisibilityProvider } from '@/contexts/NavbarVisibilityContext'; // Removed useNavbarVisibility
import LoadingSpinnerOverlay from '@/components/layout/LoadingSpinnerOverlay';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react'; 
import { useLoading } from '@/contexts/LoadingContext';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});


function LayoutClientLogic({ children }: { children: React.ReactNode }) {
  const { isPageLoading, loadingText, hideLoading } = useLoading();
  const { isClientReady } = useLanguage();
  const { isFooterVisible } = useFooter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // This effect runs on every route change.

    // 1. Hide the loading overlay once the page has re-rendered on the client.
    if (isClientReady) {
        hideLoading();
    }

    // 2. Manage scroll position.
    // If the new URL has a hash (e.g., /#projects), let the browser handle scrolling to it.
    // Otherwise, scroll to the top of the page. This is the standard behavior for new page loads.
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, searchParams, hideLoading, isClientReady]); // Rerun when navigation completes.

  if (!isClientReady) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar /> {/* Navbar is always rendered; its internal content visibility is managed */}
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
    <html lang="en" suppressHydrationWarning={true}>
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
        <meta name="google" content="notranslate" />
      </head>
      <body className={cn("font-body antialiased bg-background text-foreground", inter.variable, spaceGrotesk.variable)} suppressHydrationWarning={true}>
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
