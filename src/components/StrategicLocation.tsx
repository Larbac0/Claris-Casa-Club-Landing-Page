import { motion } from 'framer-motion';
import { MapPin, Car, Clock, Waves } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

const locationHighlights = [
  {
    icon: Waves,
    title: "Praia",
    distance: "200m",
    time: "2 min a pé"
  },
  {
    icon: Car,
    title: "Barra Shopping",
    distance: "1.5km",
    time: "5 min de carro"
  },
  {
    icon: Car,
    title: "BRT Jardim Oceânico",
    distance: "800m",
    time: "8 min a pé"
  },
  {
    icon: MapPin,
    title: "Via Parque Shopping",
    distance: "2km",
    time: "7 min de carro"
  }
];

export function StrategicLocation() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
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
            Dentro do tradicional Parque das Rosas, próximo ao Barra Shopping, Carrefour, BRT e Av. das Américas. Região nobre com alta valorização e liquidez.
          </motion.p>
        </div>

        {/* Split Screen Images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="relative h-64 md:h-80 lg:h-96">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
              alt="Praia da Barra"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">Vista para o Mar</h3>
                <p className="text-lg opacity-90">A apenas 200 metros da praia</p>
              </div>
            </div>
          </div>
          
          <div className="relative h-64 md:h-80 lg:h-96">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
              alt="Claris Casa & Club"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">Seu Novo Lar</h3>
                <p className="text-lg opacity-90">Luxo e sofisticação</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {locationHighlights.map((location, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-50 p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <location.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{location.title}</h3>
              <p className="text-[#D4AF37] font-semibold mb-1">{location.distance}</p>
              <p className="text-sm text-gray-600">{location.time}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl text-gray-800 mb-4 font-serif">Parque das Rosas - Localização Privilegiada</h3>
            <p className="text-lg text-gray-600">Explore a região e descubra as conveniências ao seu redor</p>
          </div>
          
          {/* Interactive Google Map */}
          <div className="relative h-96 bg-white rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.092454276147!2d-43.36468844885236!3d-23.012952584948207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bda2c8c2f8b7d%3A0x8e5c0f5f7b0a6c5d!2sAv.%20Pref.%20Dulc%C3%ADdio%20Cardoso%2C%202900%20-%20Barra%20da%20Tijuca%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022631-052!5e0!3m2!1spt!2sbr!4v1642684400000!5m2!1spt!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            ></iframe>
            
            {/* Overlay with project information */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">📍 Claris Casa & Club</h4>
                <p className="text-gray-600 text-sm">Av. Pref. Dulcídio Cardoso, 2900</p>
                <p className="text-gray-600 text-xs">Barra da Tijuca, Rio de Janeiro - RJ, 22631-052</p>
                <p className="text-[#D4AF37] text-sm font-semibold mt-2">A 200m da praia • Região nobre</p>
              </div>
            </div>

            {/* Points of Interest Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="bg-[#D4AF37]/95 backdrop-blur-sm rounded-xl p-4 text-black shadow-lg">
                <h5 className="font-semibold mb-2">🏖️ Principais Pontos de Interesse:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• Praia da Barra (200m)</div>
                  <div>• Barra Shopping (1.5km)</div>
                  <div>• BRT Jardim Oceânico (800m)</div>
                  <div>• Via Parque Shopping (2km)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Features and Direct Link */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600 text-sm">
              💡 <strong>Dica:</strong> Clique e arraste no mapa para explorar a região. Use os controles para zoom e visualização por satélite.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.google.com/maps/place/Av.+Pref.+Dulc%C3%ADdio+Cardoso,+2900+-+Barra+da+Tijuca,+Rio+de+Janeiro+-+RJ,+22631-052"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#B8941F] transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <MapPin className="w-5 h-5" />
                Abrir no Google Maps
              </a>
              <div className="text-gray-600 text-sm">
                📍 <strong>Endereço:</strong> Av. Pref. Dulcídio Cardoso, 2900
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transportation Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-[#D4AF37]/10 px-8 py-4 rounded-full">
            <Clock className="w-6 h-6 text-[#B8941F]" />
            <span className="text-lg text-gray-700">
              <span className="font-semibold text-[#B8941F]">Mobilidade urbana:</span> BRT, metrô e principais vias de acesso
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}