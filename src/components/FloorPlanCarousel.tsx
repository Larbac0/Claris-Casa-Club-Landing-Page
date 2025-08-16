import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Home, Maximize2, Bed } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ImageWithFallback } from './ui/ImageWithFallback';

const floorPlans = [
  {
    id: 1,
    title: 'Studio Garden - 45m²',
    description: 'Ambiente integrado com varanda gourmet e vista para o jardim.',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    bedrooms: 1,
    bathrooms: 1,
    area: '45m²',
    features: ['Varanda gourmet', 'Ar-condicionado', 'Piso porcelanato', 'Vista jardim']
  },
  {
    id: 2,
    title: 'Apartamento Premium - 75m²',
    description: 'Dois quartos com suíte master e living ampliado.',
    image: 'https://images.unsplash.com/photo-1600566752229-450c087191cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    bedrooms: 2,
    bathrooms: 2,
    area: '75m²',
    features: ['Suíte master', 'Living ampliado', 'Varanda premium', 'Closet']
  },
  {
    id: 3,
    title: 'Cobertura Duplex - 120m²',
    description: 'Cobertura exclusiva com terraço privativo e piscina.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    bedrooms: 3,
    bathrooms: 3,
    area: '120m²',
    features: ['Terraço privativo', 'Piscina privativa', 'Churrasqueira', 'Vista panorâmica']
  },
  {
    id: 4,
    title: 'Penthouse Luxury - 180m²',
    description: 'O mais exclusivo: 4 suítes com área de lazer completa.',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    bedrooms: 4,
    bathrooms: 4,
    area: '180m²',
    features: ['4 suítes', 'Home theater', 'Spa privativo', 'Heliponto']
  }
];

interface FloorPlanCarouselProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FloorPlanCarousel({ isOpen, onClose }: FloorPlanCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || !isOpen) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % floorPlans.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isOpen]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + floorPlans.length) % floorPlans.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % floorPlans.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!isOpen) return null;

  const currentPlan = floorPlans[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black/95 border-none">
        <DialogTitle className="sr-only">Plantas Privativas - Claris Casa & Club</DialogTitle>
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-serif">Plantas Privativas</h2>
              <p className="text-white/80">Conheça nossos layouts exclusivos</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full p-2 w-10 h-10"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative w-full h-full flex">
          {/* Image Section */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <ImageWithFallback
                  src={currentPlan.image}
                  alt={currentPlan.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <Button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm"
              size="sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm"
              size="sm"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {floorPlans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-[#D4AF37] scale-125'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-80 bg-white p-8 overflow-y-auto">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-serif text-gray-800 mb-2">
                  {currentPlan.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentPlan.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Especificações</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                    <div className="text-lg font-semibold text-gray-800">
                      {currentPlan.bedrooms}
                    </div>
                    <div className="text-xs text-gray-600">Quartos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                    <div className="text-lg font-semibold text-gray-800">
                      {currentPlan.bathrooms}
                    </div>
                    <div className="text-xs text-gray-600">Banheiros</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Maximize2 className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                    <div className="text-lg font-semibold text-gray-800">
                      {currentPlan.area}
                    </div>
                    <div className="text-xs text-gray-600">Área</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Características</h4>
                <div className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#D4AF37]/10 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2">Interessou?</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Agende uma visita e conheça pessoalmente este layout exclusivo.
                </p>
                <Button 
                  className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold"
                  onClick={() => {
                    window.open('https://wa.me/5521999999999?text=Olá! Gostaria de agendar uma visita para conhecer o ' + currentPlan.title, '_blank');
                  }}
                >
                  Agendar Visita
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Auto-play Indicator */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`text-xs px-3 py-1 rounded-full backdrop-blur-sm transition-colors ${
              isAutoPlaying 
                ? 'bg-[#D4AF37]/80 text-black' 
                : 'bg-white/20 text-white'
            }`}
          >
            {isAutoPlaying ? 'Pausar' : 'Play'} Auto
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}