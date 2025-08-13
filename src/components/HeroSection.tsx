import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ImageWithFallback } from './ui/ImageWithFallback';
// Update the path below to the correct location of your hero image
// Use the image URL directly as a string
const heroImage = 'https://lancamento.invexo.com.br/wp-content/uploads/2025/02/claris-casa-e-clube-barra-da-tijuca-rio-de-janeiro-rj-2-2048x1152.jpg';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={heroImage}
          alt="Claris Casa & Club - Luxury Condominium"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl text-white mb-6 font-serif leading-tight">
              <span className="text-[#D4AF37]">Claris</span> Casa & Club
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Casas de alto padrão com lazer completo e localização privilegiada. Parque das Rosas – A apenas 520 metros da praia.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <Button 
              onClick={scrollToForm}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-black px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-2xl hover:shadow-[#D4AF37]/25 hover:scale-105"
            >
              Tenha uma apresentação privada
            </Button>
            <p className="text-white/80 text-sm mt-4">
              Experimente o Claris com exclusividade e atenção personalizada.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
}