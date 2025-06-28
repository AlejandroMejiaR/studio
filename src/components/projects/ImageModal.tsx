
"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { X } from "lucide-react";

interface ImageModalProps {
  children: React.ReactNode;
  imageUrl: string;
  altText: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ children, imageUrl, altText }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-0 shadow-none">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-contain rounded-lg"
          />
        </div>
         <DialogClose className="absolute -top-2 -right-2 md:-top-4 md:-right-4 rounded-full bg-background/80 p-1 text-foreground opacity-80 backdrop-blur-sm transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
