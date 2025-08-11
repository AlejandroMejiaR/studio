
"use client";

import type { Project } from '@/types';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Map technology names to Supabase image URLs
const getTechIconUrl = (tech: string) => {
    const lowerCaseTech = tech.toLowerCase();
    const baseUrl = "https://xtuifrsvhbydeqtmibbt.supabase.co/storage/v1/object/public/documents/Logos/";

    switch (lowerCaseTech) {
        case 'next.js': return `${baseUrl}next-js.png`;
        case 'react': return `${baseUrl}React.png`;
        case 'tailwindcss': return `${baseUrl}Tailwind.png`;
        case 'firebase': return `${baseUrl}Firebase.png`;
        case 'vercel': return `${baseUrl}Vercel.png`;
        case 'unity': return `${baseUrl}UnityClaro.png`;
        case 'figma': return `${baseUrl}Figma.png`;
        case 'p5.js': return `${baseUrl}p5js.png`;
        case 'javascript': return `${baseUrl}javascript.png`;
        case 'c#': return `${baseUrl}c-sharp.png`;
        case 'blender': return `${baseUrl}Blender.png`;
        default: return null; // Fallback for unmapped tech
    }
};

const ImageCarouselModal = ({ images, initialIndex, altText, onClose }: { images: string[], initialIndex: number, altText: string, onClose: () => void }) => {
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
             <DialogClose
                onClick={onClose}
                className="absolute -top-2 -right-2 md:-top-3 md:-right-3 h-10 w-10 rounded-full z-20 border-2 border-accent bg-background/80 backdrop-blur-sm hover:bg-accent group flex items-center justify-center transition-colors duration-200"
                aria-label="Close image viewer"
            >
                <X className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
            </DialogClose>
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

    const handleModalClose = () => {
        setIsModalOpen(false);
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
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
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
                                            {project.technologies.map(tech => {
                                                const iconUrl = getTechIconUrl(tech);
                                                if (!iconUrl) return null;

                                                return (
                                                    <Tooltip key={tech}>
                                                        <TooltipTrigger asChild>
                                                            <div className="p-2 rounded-md bg-muted/50 border border-border/50 h-10 w-10 flex items-center justify-center">
                                                                <Image src={iconUrl} alt={tech} width={24} height={24} className="object-contain" />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{tech}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                );
                                            })}
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
                    className="absolute top-0 right-0 h-10 w-10 rounded-full z-20 -mt-2 -mr-2 border-2 border-accent bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-center group"
                    aria-label="Close project details"
                >
                    <X className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
                </Button>
            </motion.div>
            
            {isModalOpen && <ImageCarouselModal images={galleryImages} initialIndex={modalInitialIndex} altText={content.title} onClose={handleModalClose} />}
        </Dialog>
    );
};

export default ProjectDetailView;
