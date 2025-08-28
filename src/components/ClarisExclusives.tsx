import { motion } from 'framer-motion';
import { Shield, Wifi, Zap, Car, Waves, Truck, Users, Sparkles } from 'lucide-react';

export function ClarisExclusives() {
  const exclusives = [
    {
      category: "Segurança e Tecnologia de Última Geração",
      icon: Shield,
      color: "from-[#D4AF37] to-[#B8941F]",
      features: [
        {
          icon: Shield,
          title: "Sistema de Segurança Perimetral",
          description: "Proteção máxima com monitoramento 24h e controle de acesso inteligente"
        },
        {
          icon: Sparkles,
          title: "Câmeras com Monitoramento Inteligente",
          description: "Tecnologia de reconhecimento facial e análise comportamental"
        },
        {
          icon: Zap,
          title: "Tomadas USB em Todos os Ambientes",
          description: "Praticidade moderna nas áreas comuns e unidades residenciais"
        },
        {
          icon: Wifi,
          title: "Infraestrutura Wi-Fi Corporativa",
          description: "Internet de alta velocidade nas áreas comuns com cobertura total"
        }
      ]
    },
    {
      category: "Comodidades Exclusivas",
      icon: Sparkles,
      color: "from-[#D4AF37] to-[#B8941F]",
      features: [
        {
          icon: Truck,
          title: "Espaço Delivery Premium",
          description: "Recebimento de encomendas com total conveniência e segurança"
        },
        {
          icon: Waves,
          title: "Beach Facilities Completas",
          description: "Cadeiras, guarda-sóis, ducha e lava-pés/patas para pets"
        },
        {
          icon: Zap,
          title: "Gerador de Energia Elétrica",
          description: "Energia ininterrupta para máximo conforto e segurança"
        },
        {
          icon: Users,
          title: "Serviços Pay-per-Use",
          description: "Piscineiro, jardineiro, limpeza, reparos e passeador de cães"
        }
      ]
    },
    {
      category: "Mobilidade Privilegiada – AMA Rosas",
      icon: Car,
      color: "from-[#D4AF37] to-[#B8941F]",
      features: [
        {
          icon: Car,
          title: "Ônibus Exclusivo para Condôminos",
          description: "Rotas diretas para Barra, Centro e Zona Sul com horários regulares"
        },
        {
          icon: Waves,
          title: "Balsa Privativa",
          description: "Travessia direta e exclusiva para a praia com total comodidade"
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
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
            Exclusividades do <span className="text-[#D4AF37]">Claris</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Exclusividade, Conforto e Sofisticação em Cada Detalhe
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] mx-auto mt-8"></div>
        </motion.div>

        {/* Exclusives Grid */}
        <div className="space-y-16">
          {exclusives.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Category Header */}
              <div className="text-center mb-12">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${category.color} text-white mb-4 shadow-lg`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-gray-800 mb-4">
                  {category.category}
                </h3>
              </div>

              {/* Features Grid */}
              <div className={`grid grid-cols-1 ${category.features.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : category.features.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: featureIndex * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                      {/* Feature Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6" />
                      </div>

                      {/* Feature Content */}
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-[#B8941F]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B8941F]/10 rounded-3xl p-8 md:p-12 border border-[#D4AF37]/20 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-serif text-gray-800 mb-6">
                Um Novo Conceito de <span className="text-[#D4AF37]">Viver com Exclusividade</span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                No Claris Casa & Club, cada detalhe foi pensado para proporcionar uma experiência única de moradia. 
                Combinamos tecnologia de ponta, comodidades excepcionais e localização privilegiada para criar 
                o ambiente perfeito para quem busca o melhor da vida na Barra da Tijuca.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}