import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { FooterProvider } from '@/contexts/FooterContext';
import { NavbarVisibilityProvider } from '@/contexts/NavbarVisibilityContext';
import { cn } from '@/lib/utils';
import LayoutClientLogic from '@/components/layout/LayoutClientLogic';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Portfolio Ace',
  description: 'The portfolio of Alejandro Mejia Rojas, a Multimedia Engineer specializing in UX and Game Design.',
};

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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preload" href="https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Model/Final.glb" as="fetch" crossOrigin="anonymous" />
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
      <body className={cn("font-body antialiased bg-background text-foreground")} suppressHydrationWarning={true}>
        <LanguageProvider>
          <FooterProvider>
            <NavbarVisibilityProvider>
                <LayoutClientLogic>
                    {children}
                </LayoutClientLogic>
            </NavbarVisibilityProvider>
          </FooterProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
