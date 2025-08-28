import { motion } from 'framer-motion';
import { Briefcase, Heart, Target } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

const personas = [
  {
    id: 'executives',
    icon: Briefcase,
    title: 'Executivos e Empresários',
    subtitle: 'Profissionais de Alto Nível',
    description: 'Líderes que valorizam localização estratégica, proximidade aos centros de negócios e um endereço de prestígio.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
    characteristics: [
      'Idade: 35-55 anos',
      'Renda: Acima de R$ 20.000',
      'Busca praticidade e status',
      'Valoriza proximidade ao trabalho'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'families',
    icon: Heart,
    title: 'Famílias Modernas',
    subtitle: 'Casais com Filhos',
    description: 'Famílias que priorizam segurança, qualidade de vida, proximidade a escolas e áreas de lazer para as crianças.',
    image: '/public/img/Familia.jpg',
    characteristics: [
      'Idade: 28-45 anos',
      'Renda familiar: R$ 15.000+',
      'Prioriza segurança e educação',
      'Busca espaços amplos e lazer'
    ],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'investors',
    icon: Target,
    title: 'Investidores Imobiliários',
    subtitle: 'Foco em Rentabilidade',
    description: 'Investidores experientes que reconhecem o potencial de valorização da região e buscam ativos de qualidade.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    characteristics: [
      'Perfil: Investidor experiente',
      'Foco em ROI e valorização',
      'Conhece o mercado da Barra',
      'Busca diferencial competitivo'
    ],
    color: 'from-[#D4AF37] to-[#B8941F]'
  }
];

export function TargetAudience() {
  return (
    <section className="py-20 bg-white">
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
            Feito para <span className="text-[#D4AF37]">Você</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            O Claris Casa & Club foi pensado para atender aos sonhos e necessidades 
            de quem busca o melhor da vida na Barra da Tijuca
          </motion.p>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={persona.image}
                    alt={persona.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Icon */}
                  <div className="absolute top-6 right-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${persona.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <persona.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{persona.title}</h3>
                    <p className="text-sm opacity-90">{persona.subtitle}</p>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {persona.description}
                  </p>
                  
                  {/* Characteristics */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 mb-3">Perfil:</h4>
                    {persona.characteristics.map((char, charIndex) => (
                      <div key={charIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{char}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      const formElement = document.getElementById('contact-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="mt-6 w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-[#D4AF37] hover:to-[#B8941F] text-gray-700 hover:text-black py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    Saiba mais →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}