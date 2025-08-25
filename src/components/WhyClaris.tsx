import { motion } from 'framer-motion';
import { Car, Shield, Waves, TreePine, Users, Home, Wrench, Calendar, DollarSign, Bed } from 'lucide-react';

const benefits = [
  {
    icon: Home,
    title: "Casas de 318 m² a 580 m²",
    description: "Arquitetura moderna com espaços generosos."
  },
  {
    icon: Users,
    title: "Apenas 99 unidades",
    description: "Condomínio fechado com exclusividade garantida situado em uma das áreas mais nobres da Zona Oeste do Rio."
  },
  {
    icon: Car,
    title: "Garagem Subterrânea Privativa",
    description: "Com segurança e ótimo espaço para até 3 veículos"
  },
  {
    icon: TreePine,
    title: "Jardins Privativos",
    description: " Opções com gardens de 40 até 250 m²."
  },
  {
    icon: Waves,
    title: "Piscina Exclusiva",
    description: "Lazer aquático com design sofisticado"
  },
  {
    icon: Users,
    title: "Área de Lazer Completa",
    description: "Piscina, sauna, academia e brinquedoteca"
  },
  {
    icon: Wrench,
    title: "Serviços Internos",
    description: "Jardineiro, piscineiro e manutenção"
  },
  {
    icon: Shield,
    title: "Segurança 24h",
    description: "Portaria e monitoramento total"
  },
  {
    icon: DollarSign,
    title: "R$ 12.500 a R$ 13.500/m²",
    description: "Valor abaixo da média da região"
  },
  {
    icon: Calendar,
    title: "Entregas Programadas",
    description: "Agosto/2026 (fase 1) • Julho/2027 (fase 2)"
  },
  {
    icon: Bed,
    title: "Suítes",
    description: "Casas de 3 e 4 suítes para conforto e privacidade"
  }
];

export function WhyClaris() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-gray-800 mb-6 font-serif"
          >
            Por que escolher o <span className="text-[#D4AF37]">Claris?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Não é apenas um lugar para morar, é um estilo de vida exclusivo onde cada detalhe foi pensado para o seu bem-estar
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start gap-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl text-gray-800 mb-3 font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>

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
              <span className="font-semibold text-[#B8941F]">Mais que um investimento,</span> é a realização de um sonho
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}