
"use client";

import type { Project } from '@/types';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Code2, Component, Bot, Gamepad2, BrainCircuit, Wind, Database, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import React, { useState, useCallback, useEffect } from 'react';

// Map technology names to Lucide icons
const getTechIcon = (tech: string) => {
    const lowerCaseTech = tech.toLowerCase();
    switch (lowerCaseTech) {
        case 'next.js': return <BrainCircuit className="h-5 w-5" />;
        case 'react': return <Component className="h-5 w-5" />;
        case 'tailwindcss': return <Wind className="h-5 w-5" />;
        case 'firebase': return <Database className="h-5 w-5" />;
        case 'vercel': return <Cloud className="h-5 w-5" />;
        case 'unity': return <Gamepad2 className="h-5 w-5" />;
        case 'figma': return <Bot className="h-5 w-5" />;
        default: return <Code2 className="h-5 w-5" />;
    }
};

const ImageCarouselModal = ({ images, initialIndex, altText }: { images: string[], initialIndex: number, altText: string }) => {
    return (
        <DialogContent className="max-w-5xl w-full p-4 bg-transparent border-0 shadow-none flex items-center justify-center">
            <Carousel opts={{ loop: true, startIndex: initialIndex }} className="w-full">
                <CarouselContent>
                    {images.map((img, index) => (
                        <CarouselItem key={index}>
                            <div className="relative aspect-[16/9] w-full">
                                <Image
                                    src={img}
                                    alt={`${altText} - image ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    sizes="90vw"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white border-0" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white border-0" />
            </Carousel>
        </DialogContent>
    );
};

const ProjectDetailView = ({ project, onClose }: { project: Project; onClose: () => void; }) => {
    const { language, translationsForLanguage } = useLanguage();
    const content = project[language.toLowerCase() as 'en' | 'es'] || project.en;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialIndex, setModalInitialIndex] = useState(0);

    const openModal = (index: number) => {
        setModalInitialIndex(index);
        setIsModalOpen(true);
    };

    const galleryImages = project.galleryImages && project.galleryImages.length > 0
        ? project.galleryImages
        : [project.thumbnailUrl];

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full rounded-lg"
            >
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                    {/* Left Column: Details */}
                    <div className="w-full lg:w-[30%] lg:max-w-md flex-shrink-0">
                         <Card className="h-full p-6 md:p-8 bg-card/80 backdrop-blur-sm border-border/50">
                            <CardContent className="p-0 flex flex-col h-full">
                                <h3 className="font-headline text-3xl font-bold text-primary dark:text-foreground mb-2">
                                    {content.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    <strong className="font-semibold text-primary/90 dark:text-foreground/90">{translationsForLanguage.projectDetails.myRole}:</strong> {content.myRole}
                                </p>
                                <p className="text-foreground/80 leading-relaxed flex-grow">
                                    {content.summary}
                                </p>
                                <div className="mt-6">
                                    <h4 className="font-semibold text-primary/90 dark:text-foreground/90 mb-3">{translationsForLanguage.projectDetails.technologies}:</h4>
                                    <div className="flex flex-wrap gap-3">
                                        <TooltipProvider>
                                            {project.technologies.map(tech => (
                                                <Tooltip key={tech}>
                                                    <TooltipTrigger asChild>
                                                        <div className="p-2 rounded-md bg-muted/50 border border-border/50">
                                                            {getTechIcon(tech)}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{tech}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Image Carousel */}
                    <div className="w-full lg:w-[70%]">
                        <Carousel opts={{ loop: true }} className="w-full">
                            <CarouselContent>
                                {galleryImages.map((img, index) => (
                                    <CarouselItem key={index}>
                                        <DialogTrigger asChild onClick={() => openModal(index)}>
                                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg cursor-pointer bg-muted group">
                                                <Image
                                                    src={img}
                                                    alt={`${content.title} - image ${index + 1}`}
                                                    fill
                                                    sizes="(max-width: 768px) 90vw, 60vw"
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    data-ai-hint="project gallery image"
                                                />
                                            </div>
                                        </DialogTrigger>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                             <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white border-0" />
                            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white border-0" />
                        </Carousel>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-0 right-0 h-10 w-10 rounded-full z-20 -mt-2 -mr-2 border-2 border-accent bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
                    aria-label="Close project details"
                >
                    <X className="h-5 w-5" />
                </Button>
            </motion.div>
            
            {isModalOpen && <ImageCarouselModal images={galleryImages} initialIndex={modalInitialIndex} altText={content.title} />}
        </Dialog>
    );
};

export default ProjectDetailView;
