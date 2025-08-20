import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Play, UserCheck } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { VideoModal } from './VideoModal';

const services = [
  {
    icon: FileText,
    title: 'Plantas Privativas',
    description: 'Acesse o memorial completo com todas as plantas e layouts exclusivos.',
    image: '/img/plantas/Planta condomínio.jpg'
  },
  {
    icon: Play,
    title: 'Tour Imersivo',
    description: 'Vídeo institucional com experiência virtual envolvente.',
    image: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    hasModal: true
  },
  {
    icon: UserCheck,
    title: 'Consultoria Personalizada',
    description: 'Um especialista dedicado aos seus objetivos e preferências.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  }
];

export function ExclusiveServices() {
  const [showVideo, setShowVideo] = useState(false);

  const handleServiceClick = (index: number) => {
    if (index === 0) {
      // Plantas Privativas - Open PDF
      const pdfPath = '/assets/Book Plantas.pdf';
      // Verificar se o arquivo existe antes de abrir
      fetch(pdfPath, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            window.open(pdfPath, '_blank');
          } else {
            alert('PDF das plantas não encontrado. Por favor, adicione o arquivo "plantas-claris.pdf" na pasta public/assets/');
          }
        })
        .catch(() => {
          alert('PDF das plantas não encontrado. Por favor, adicione o arquivo "plantas-claris.pdf" na pasta public/assets/');
        });
    } else if (index === 1) {
      // Tour Imersivo - Open video modal
      setShowVideo(true);
    } else if (index === 2) {
      // Consultoria Personalizada - Open WhatsApp
      const whatsappMessage = encodeURIComponent(
        'Olá! Gostaria de agendar uma consultoria personalizada para conhecer o Claris Casa & Club. Tenho interesse em receber informações exclusivas sobre o empreendimento.'
      );
      window.open(`https://wa.me/5521999999999?text=${whatsappMessage}`, '_blank');
    }
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl text-gray-800 mb-6 font-serif"
            >
              Receba com <span className="text-[#D4AF37]">Exclusividade</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Acesso privilegiado aos melhores recursos e atendimento personalizado
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -10 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => handleServiceClick(index)}
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-6 right-6">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg">
                      <service.icon className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  
                  {/* PDF Button for Plants */}
                  {index === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:bg-white transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(0);
                        }}
                      >
                        <FileText className="w-8 h-8 text-[#D4AF37]" />
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Play Button for Video */}
                  {service.hasModal && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:bg-white transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowVideo(true);
                        }}
                      >
                        <Play className="w-8 h-8 text-[#D4AF37] ml-1" />
                      </motion.div>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-8">
                  <h3 className="text-2xl text-gray-800 mb-4 font-serif">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                      <span className="text-sm text-[#D4AF37] font-medium">Exclusivo</span>
                    </div>
                    
                    {service.hasModal ? (
                      <button 
                        className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowVideo(true);
                        }}
                      >
                        Assistir →
                      </button>
                    ) : (
                      <button className="text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-300">
                        {index === 0 ? 'Ver Plantas →' : 'Saiba mais →'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="inline-block bg-[#D4AF37]/10 px-8 py-4 rounded-full">
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-[#B8941F]">Atendimento VIP:</span> Seu sonho merece atenção exclusiva
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal 
        isOpen={showVideo} 
        onClose={() => setShowVideo(false)} 
      />
    </>
  );
}