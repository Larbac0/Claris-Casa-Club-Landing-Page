import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, Plane, ShoppingBag, GraduationCap, Building2, ExternalLink, Navigation } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

const locationFeatures = [
  {
    icon: MapPin,
    title: '520m da Praia',
    description: 'Acesso rápido à praia da Barra da Tijuca',
    distance: '5 min caminhando'
  },
  {
    icon: ShoppingBag,
    title: 'Shopping Centers',
    description: 'BarraShopping e Downtown próximos',
    distance: '10 min'
  },
  {
    icon: Car,
    title: 'Principais Vias',
    description: 'Av. das Américas e Av. Ayrton Senna',
    distance: '2 min'
  },
  {
    icon: GraduationCap,
    title: 'Escolas Premium',
    description: 'Melhores instituições de ensino',
    distance: '15 min'
  },
  {
    icon: Plane,
    title: 'Aeroportos',
    description: 'Acesso aos aeroportos Santos Dumont e Galeão',
    distance: '30-45 min'
  },
  {
    icon: Building2,
    title: 'Centro Empresarial',
    description: 'Região de negócios da Barra',
    distance: '20 min'
  }
];

export function StrategicLocation() {
  const [mapLoaded, setMapLoaded] = useState(false);

  const latitude = -23.005366;
  const longitude = -43.349973;

  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1836.244285630652!2d-43.34935677196368!3d-23.005826730378967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bdb3947dc7871%3A0x6bb1f36364ef1573!2sClaris%20Casa%20%26%20Clube%20-%20Tegra!5e0!3m2!1spt-BR!2sbr!4v1755377337041!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade`;

  const openInGoogleMaps = () => {
    window.open(
      `https://maps.google.com/?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=20`,
      '_blank'
    );
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-gray-800 mb-6 font-serif"
          >
            Localização <span className="text-[#D4AF37]">Estratégica</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            No coração da Barra da Tijuca, com acesso privilegiado a tudo o que você precisa
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Google Maps Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Interactive Google Map */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-4 border border-gray-100">
              <div className="aspect-square relative overflow-hidden rounded-2xl">
                {/* Loading Placeholder */}
                {!mapLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-3"
                      />
                      <p className="text-gray-600 text-sm">Carregando mapa...</p>
                    </div>
                  </div>
                )}
                
                {/* Google Maps Embed */}
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '1rem' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Claris Casa & Club - Barra da Tijuca"
                  onLoad={() => setMapLoaded(true)}
                  className="absolute inset-0 w-full h-full"
                />
                
                {/* Map Overlay Controls */}
                <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                </div>

                {/* Interactive Map Button */}
                <div className="absolute bottom-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openInGoogleMaps}
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-black px-4 py-2 rounded-full font-medium text-sm shadow-lg flex items-center gap-2 transition-colors duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir no Maps
                  </motion.button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Claris Casa & Club</h3>
                <p className="text-gray-600 mb-3">Av. Pref. Dulcídio Cardoso, 2900 - Barra da Tijuca - RJ</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-4 h-4" />
                    GPS: {latitude}, {longitude}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Address Card */}
          </motion.div>

          {/* Features Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {locationFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {feature.title}
                        </h3>
                        <span className="text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-full">
                          {feature.distance}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8941F]/10 rounded-2xl border border-[#D4AF37]/20"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Viva onde tudo acontece
                </h3>
                <p className="text-gray-600 mb-4">
                  A localização perfeita para quem busca praticidade, 
                  qualidade de vida e valorização imobiliária.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={openInGoogleMaps}
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-black px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Rotas no Google Maps
                  </button>
                  <button
                    onClick={() => {
                      const formElement = document.getElementById('contact-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="bg-white hover:bg-gray-50 text-[#D4AF37] border-2 border-[#D4AF37] px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Agendar Visita
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}