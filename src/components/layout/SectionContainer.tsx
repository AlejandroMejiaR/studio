
"use client";

import { cn } from '@/lib/utils';
import type React from 'react';

export const SectionContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("container", className)}>
    {children}
  </div>
);
