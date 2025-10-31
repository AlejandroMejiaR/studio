
"use client";

import type { Project } from '@/types';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Map technology name from DB to shields.io params
const getShieldsIoParams = (tech: string): { displayName: string, logoName: string, bgColor?: string, logoColor?: string } => {
    const lowerCaseTech = tech.toLowerCase();
    const defaultParams = { logoName: lowerCaseTech, displayName: tech, bgColor: '1E1E1E', logoColor: 'white' };

    switch (lowerCaseTech) {
        case 'next.js': return { ...defaultParams, logoName: 'nextdotjs' };
        case 'c#': return { ...defaultParams, logoName: 'csharp' };
        case 'p5.js': return { ...defaultParams, logoName: 'p5dotjs' };
        case 'vercel': return { ...defaultParams, logoColor: 'black' }; // Vercel logo is black, text should be white
        case 'react': return { ...defaultParams, logoColor: '61DAFB' };
        case 'firebase': return { ...defaultParams, logoColor: 'FFCA28' };
        case 'unity': return { ...defaultParams, bgColor: '000000' };
        default: return defaultParams;
    }
};

const getTechBadgeUrl = (tech: string) => {
    const params = getShieldsIoParams(tech);
    const { displayName, logoName, bgColor, logoColor } = params;
    return `https://img.shields.io/badge/${encodeURIComponent(displayName)}-${bgColor}?style=flat-square&logo=${logoName}&logoColor=${logoColor}`;
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
             <DialogClose asChild>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onClose}
                    className="absolute -top-2 -right-2 md:-top-3 md:-right-3 h-10 w-10 rounded-full z-20 border-2 border-accent bg-background/80 backdrop-blur-sm hover:bg-accent group flex items-center justify-center transition-colors duration-200"
                    aria-label="Close image viewer"
                >
                    <X className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
                </Button>
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
                className="w-full"
            >
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
                    {/* Left Column: Details */}
                    <div className="w-full lg:w-[30%] lg:max-w-md flex-shrink-0">
                         <Card className="relative h-full p-6 md:p-8 bg-card/80 backdrop-blur-sm border-border/50">
                            <CardContent className="p-0 flex h-full flex-col">
                                <div className="flex items-center gap-4 mb-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={onClose}
                                        className="h-12 w-12 rounded-full border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground flex-shrink-0"
                                        aria-label="Go back to projects"
                                    >
                                        <ArrowLeft className="h-6 w-6" />
                                    </Button>
                                    <h3 className="font-headline text-3xl font-bold text-primary dark:text-foreground">
                                        {content.title}
                                    </h3>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-4">
                                    <strong className="font-semibold text-primary/90 dark:text-foreground/90">{translationsForLanguage.projectDetails.myRole}:</strong> {content.myRole}
                                </p>

                                <p className="text-foreground/80 leading-relaxed flex-grow">
                                    {content.summary}
                                </p>

                                <div className="mt-6">
                                    <h4 className="font-semibold text-primary/90 dark:text-foreground/90 mb-3">{translationsForLanguage.projectDetails.technologies}:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map(tech => (
                                            <Image 
                                                key={tech}
                                                src={getTechBadgeUrl(tech)} 
                                                alt={`${tech} logo`} 
                                                width={90} // Approximate width, can be adjusted
                                                height={20} // Standard height for shields.io badges
                                                className="object-contain"
                                                unoptimized // Recommended for SVGs/external images that are already optimized
                                            />
                                        ))}
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

            </motion.div>
            
            {isModalOpen && <ImageCarouselModal images={galleryImages} initialIndex={modalInitialIndex} altText={content.title} onClose={handleModalClose} />}
        </Dialog>
    );
};

export default ProjectDetailView;
