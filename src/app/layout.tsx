
"use client";

// import type { Metadata } from 'next'; // Metadata cannot be exported from Client Component
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { FooterProvider, useFooter } from '@/contexts/FooterContext';
import { NavbarVisibilityProvider } from '@/contexts/NavbarVisibilityContext'; // Removed useNavbarVisibility
import { Suspense, useEffect } from 'react'; 
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';


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
  const { isFooterVisible } = useFooter();
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo(0, 0);
  }, [pathname]);

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
          <FooterProvider>
            <NavbarVisibilityProvider>
              <LayoutClientLogic>
                {children}
              </LayoutClientLogic>
            </NavbarVisibilityProvider>
          </FooterProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
