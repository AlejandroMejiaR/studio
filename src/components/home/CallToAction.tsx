
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
        <div className="flex flex-col items-center justify-center text-center gap-4 my-8">
            <Button
                size="icon"
                asChild
                className="h-20 w-20 rounded-full border-2 border-accent bg-transparent text-accent animate-bounce-subtle hover:bg-accent hover:text-accent-foreground [&_svg]:size-8"
                aria-label={translationsForLanguage.home.buttons.exploreMiniProjects}
            >
                <Link href="/#mini-projects" onClick={handleSmoothScroll}>
                    <ArrowDown />
                </Link>
            </Button>
            <p className="text-sm font-medium text-foreground/80">
                {translationsForLanguage.home.buttons.exploreMiniProjects}
            </p>
        </div>
    );
};

export default CallToAction;
