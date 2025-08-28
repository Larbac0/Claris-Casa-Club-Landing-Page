import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Award, Users, MapPin, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { YouTubeVideoModal } from './VideoInstitutional';
import { ImageWithFallback } from './ui/ImageWithFallback';

export function InstitutionalVideo() {
  const [showVideo, setShowVideo] = useState(false);

  const highlights = [
    {
      icon: Award,
      title: "Qualidade Comprovada",
      description: "Mais de 30 anos de tradição em empreendimentos de luxo"
    },
    {
      icon: MapPin,
      title: "Localização Premium",
      description: "Barra da Tijuca, próximo às melhores praias e centros comerciais"
    },
    {
      icon: Users,
      title: "Atendimento Personalizado",
      description: "Equipe especializada para realizar seus sonhos imobiliários"
    },
    {
      icon: Calendar,
      title: "Entrega Garantida",
      description: "Pontualidade e transparência em todas as etapas do projeto"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-full blur-3xl transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-l from-[#B8941F]/10 to-transparent rounded-full blur-3xl transform translate-x-32 translate-y-32"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-gray-800 mb-6 font-serif">
            Claris Casa & Clube
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Um Novo Conceito de Viver com <span className="text-[#D4AF37] font-semibold">Exclusividade e Sofisticação</span>
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Video Thumbnail */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="/img/Consultoria personalizada.jpeg"
                alt="Claris Casa & Clube - Vídeo Institucional"
                className="w-full h-80 md:h-96 object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
              
              {/* Play Button */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Button
                  onClick={() => setShowVideo(true)}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#D4AF37] hover:bg-[#B8941F] text-black shadow-2xl hover:shadow-[#D4AF37]/25 transition-all duration-300 group-hover:scale-110"
                >
                  <Play className="w-10 h-10 md:w-12 md:h-12 ml-1" />
                </Button>
              </motion.div>

              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full">
                <span className="text-sm">0:47</span>
              </div>
            </div>

            {/* Video Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-6 text-center"
            >
              <h3 className="text-xl font-serif text-gray-800 mb-2">
                Conheça Cada Detalhe do Claris
              </h3>
              <p className="text-gray-600">
                Um tour completo pelos ambientes e diferenciais que fazem do Claris Casa & Clube único
              </p>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl md:text-4xl font-serif text-gray-800 mb-6">
                Mais que um <span className="text-[#D4AF37]">Empreendimento</span>,
                <br />uma Nova Forma de Viver
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                O Claris Casa & Clube representa a evolução do conceito de moradia de luxo na Barra da Tijuca. 
                Cada elemento foi cuidadosamente planejado para proporcionar uma experiência única de 
                conforto, segurança e sofisticação.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <highlight.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {highlight.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {highlight.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <Button
                onClick={() => {
                  const contactForm = document.getElementById('contact-form');
                  contactForm?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-black px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Agende sua Visita e Conheça Mais Detalhes
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-200">
            <blockquote className="text-xl md:text-2xl font-serif text-gray-800 italic mb-6">
              "No Claris Casa & Clube, transformamos sonhos em realidade, oferecendo não apenas um lar, 
              mas um estilo de vida exclusivo e sofisticado."
            </blockquote>
            <div className="text-[#D4AF37] font-semibold text-lg">
              — Tegra Incorporadora, 3 décadas de tradição
            </div>
          </div>
        </motion.div>
      </div>
      {/* Video Modal */}
      <YouTubeVideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
    </section>
  );
};