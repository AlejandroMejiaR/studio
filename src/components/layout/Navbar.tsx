
"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Gamepad2 } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/#projects', label: 'Projects' },
    { href: '/#about', label: 'About' },
    // Add more links as needed, e.g., Blog, Contact
  ];

  return (
    <header className="w-full border-b border-border/40 bg-background z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity duration-300 ease-in-out hover:opacity-80" prefetch={false}>
          <Gamepad2 className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">Portfolio Ace</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300 ease-in-out"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background">
              <div className="p-6">
                <Link href="/" className="flex items-center gap-2 mb-8 transition-opacity duration-300 ease-in-out hover:opacity-80" onClick={() => setIsMobileMenuOpen(false)}>
                  <Gamepad2 className="h-7 w-7 text-primary" />
                  <span className="font-headline text-xl font-bold text-primary">Portfolio Ace</span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors duration-300 ease-in-out"
                      onClick={() => setIsMobileMenuOpen(false)}
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
