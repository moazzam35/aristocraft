"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import Maximize2 from "lucide-react/dist/esm/icons/maximize-2";
import X from "lucide-react/dist/esm/icons/x";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const galleryImages = images && images.length > 0 ? images : ["/images/placeholder.jpg"];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape" && lightboxOpen) {
        setLightboxOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryImages.length, lightboxOpen]);

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  }, [galleryImages.length]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  }, [galleryImages.length]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        className="relative w-full h-[340px] sm:h-[440px] md:h-[520px] rounded-2xl overflow-hidden group cursor-zoom-in"
        style={{ backgroundColor: "#F4F0E8" }}
        onClick={() => setLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={galleryImages[activeIndex]}
              alt={`${title} - Image ${activeIndex + 1}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 45vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md pointer-events-auto transition-transform active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md pointer-events-auto transition-transform active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Zoom image"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1 scrollbar-none">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                idx === activeIndex ? "border-emerald-800 scale-95" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: "#F4F0E8" }}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
              aria-label="Close zoom view"
            >
              <X size={24} />
            </button>

            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="relative w-full max-w-4xl h-[70vh] md:h-[80vh]">
              <Image
                src={galleryImages[activeIndex]}
                alt={title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {activeIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(ProductGallery);
