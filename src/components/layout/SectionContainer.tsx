
"use client";

import { cn } from '@/lib/utils';
import type React from 'react';

export const SectionContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}>
    {children}
  </div>
);
