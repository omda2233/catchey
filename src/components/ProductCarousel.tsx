
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCarouselProps {
  images: string[];
  productName: string;
}

export function ProductCarousel({ images, productName }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { language } = useLanguage();
  
  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);
  
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const handleDotClick = (index: number) => {
    if (isTransitioning || currentIndex === index) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  return (
    <div className="relative w-full overflow-hidden rounded-lg aspect-square">
      <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent z-10"></div>
      
      {/* Main image */}
      <img
        src={images[currentIndex]}
        alt={productName}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isTransitioning ? "opacity-80" : "opacity-100"
        )}
      />
      
      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-2 z-20">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-navy-dark/50 border-gold/30 text-gold hover:bg-navy hover:text-gold hover:border-gold"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline" 
          size="icon"
          className="h-8 w-8 rounded-full bg-navy-dark/50 border-gold/30 text-gold hover:bg-navy hover:text-gold hover:border-gold"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === currentIndex
                ? "w-4 bg-gold"
                : "w-1.5 bg-gold/30 hover:bg-gold/50"
            )}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
