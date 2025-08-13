import React from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Briefcase } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

const personas = [
  {
    icon: Heart,
    image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "Família",
    subtitle: "Pais e filhos",
    question: "Quer mais espaço e segurança para sua família?",
    description: "O Claris oferece o ambiente perfeito para criar memórias especiais, com áreas de lazer seguras e próximo às melhores escolas da região.",
    benefits: ["Área de lazer infantil", "Segurança 24h", "Proximidade de escolas", "Ambiente familiar"]
  },
  {
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "Investidor",
    subtitle: "Visão de futuro",
    question: "Busca investimento seguro e rentável?",
    description: "Localização premium na Barra da Tijuca garante valorização constante. Um investimento inteligente com retorno garantido.",
    benefits: ["Alta valorização", "Região em crescimento", "Demanda constante", "ROI atrativo"]
  },
  {
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    title: "Executivo",
    subtitle: "Profissional de sucesso",
    question: "Busca praticidade e status no dia a dia?",
    description: "Para quem valoriza tempo e qualidade de vida. Localização estratégica com fácil acesso aos principais centros empresariais.",
    benefits: ["Localização central", "Mobilidade urbana", "Status e prestígio", "Conforto premium"]
  }
];

export function TargetAudience() {
  return (
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
            O <span className="text-[#D4AF37]">Claris</span> é para você
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Diferentes perfis, um mesmo sonho: viver com qualidade e exclusividade
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {personas.map((persona, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Image with overlay */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={persona.image}
                  alt={persona.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <persona.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-semibold">{persona.title}</h3>
                    <p className="text-sm opacity-90">{persona.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <motion.h4
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-xl font-semibold text-[#B8941F] mb-4 leading-tight"
                >
                  {persona.question}
                </motion.h4>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-gray-600 mb-6 leading-relaxed"
                >
                  {persona.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h5 className="font-semibold text-gray-800 mb-3">Por que escolher o Claris:</h5>
                  <ul className="space-y-2">
                    {persona.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3 flex-shrink-0"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B8941F]/10 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl text-gray-800 mb-4 font-serif">
              Independente do seu perfil, o <span className="text-[#D4AF37]">Claris</span> é a escolha certa
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Venha descobrir como podemos tornar seus sonhos realidade
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={() => {
                  const formElement = document.getElementById('contact-form');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/25"
              >
                Quero conhecer o Claris
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}