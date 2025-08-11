
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const CallToAction = () => {
    const { translationsForLanguage } = useLanguage();

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const href = e.currentTarget.getAttribute('href');
        if (href && href.startsWith('/#')) {
            e.preventDefault();
            const targetId = href.substring(2);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }
    };

    return (
        <div className="flex items-center justify-center mt-16">
            <Button
                size="lg"
                asChild
                className="w-full max-w-xs h-16 text-lg rounded-lg border-2 border-accent bg-transparent text-accent animate-bounce-subtle hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-4 px-6"
                aria-label={translationsForLanguage.home.buttons.exploreMiniProjects}
            >
                <Link href="/#mini-projects" onClick={handleSmoothScroll}>
                    <span>
                        {translationsForLanguage.home.buttons.exploreMiniProjects}
                    </span>
                    <ArrowDown className="h-6 w-6" />
                </Link>
            </Button>
        </div>
    );
};

export default CallToAction;
