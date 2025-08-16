import { motion } from 'framer-motion';
import { Award, Shield, Clock, Star } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';

const excellenceFeatures = [
  {
    icon: Award,
    title: '30 Anos de Mercado',
    description: 'Experiência consolidada em empreendimentos de alto padrão',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Shield,
    title: 'Garantia Total',
    description: 'Cobertura completa com assistência técnica especializada',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Clock,
    title: 'Pontualidade',
    description: 'Entregas rigorosamente dentro do prazo estabelecido',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Star,
    title: 'Excelência',
    description: 'Padrão de qualidade superior em todos os detalhes',
    color: 'from-[#D4AF37] to-[#B8941F]'
  }
];

export function ExcellenceSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl text-gray-800 mb-6 font-serif">
                Compromisso com a <span className="text-[#D4AF37]">Excelência</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Mais que uma construtora, somos parceiros na realização do seu sonho. 
                Nossa reputação foi construída com base na confiança e na entrega de resultados excepcionais.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {excellenceFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-700 font-medium mb-2">
                    Certificação de Qualidade ISO 9001
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Processos padronizados e auditados garantem a máxima qualidade 
                    em todas as etapas da construção, desde o planejamento até a entrega das chaves.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
                alt="Construção de Qualidade"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">98%</p>
                    <p className="text-sm text-gray-600">Satisfação dos clientes</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gray-200/50 rounded-full blur-2xl"></div>
          </motion.div>
        </div>

        {/* Bottom Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {[
            { number: '500+', label: 'Unidades entregues' },
            { number: '30', label: 'Anos de experiência' },
            { number: '15', label: 'Prêmios recebidos' },
            { number: '99%', label: 'Entregas no prazo' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}