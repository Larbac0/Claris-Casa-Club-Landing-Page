import { motion } from 'framer-motion';
import { Award, Clock, Shield, Users } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

const highlights = [
  {
    icon: Clock,
    title: 'Pontualidade',
    description: 'Entregas no prazo prometido'
  },
  {
    icon: Award,
    title: 'Qualidade',
    description: 'Padrão premium em cada detalhe'
  },
  {
    icon: Shield,
    title: 'Discrição',
    description: 'Atendimento reservado e exclusivo'
  },
  {
    icon: Users,
    title: 'Excelência',
    description: 'Satisfação garantida'
  }
];

export function ExcellenceSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Excellence Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-block mb-8"
          >
            <div className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-3xl font-bold text-black">30+</span>
            </div>
            <div className="w-32 h-1 bg-[#D4AF37] rounded-full mx-auto"></div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl text-white mb-8 font-serif leading-tight"
          >
            Mais de <span className="text-[#D4AF37]">30 anos</span><br />
            de excelência
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto font-serif italic"
          >
            "Pontualidade, qualidade e discrição para quem valoriza o melhor."
          </motion.p>
        </div>

        {/* Excellence Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="text-center group"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20 group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-all duration-300"
                >
                  <highlight.icon className="w-10 h-10 text-[#D4AF37]" />
                </motion.div>
                
                {/* Connecting Line */}
                {index < highlights.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-[#D4AF37]/30 to-transparent"></div>
                )}
              </div>
              
              <h3 className="text-xl text-white mb-3 font-serif font-medium">
                {highlight.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl text-[#D4AF37] font-bold mb-2">500+</div>
              <p className="text-white/80 text-sm">Unidades entregues</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl text-[#D4AF37] font-bold mb-2">98%</div>
              <p className="text-white/80 text-sm">Satisfação dos clientes</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl text-[#D4AF37] font-bold mb-2">30+</div>
              <p className="text-white/80 text-sm">Anos de experiência</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}