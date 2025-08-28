import { motion } from 'framer-motion';
import { Info, Shield, User, Building } from 'lucide-react';

export function PartnerDisclaimer() {
  return (
    <section className="py-8 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-gray-800 mb-3">
                Nota de Esclarecimento
              </h3>
              
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Este conteúdo é apresentado por um <strong className="text-[#D4AF37]">corretor parceiro da Tegra Incorporadora</strong>, 
                  especializado em imóveis de alto padrão na Barra da Tijuca.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-sm">
                      <strong>Importante:</strong> Este canal não representa a administração do condomínio, 
                      mas sim um ponto de contato direto para quem deseja adquirir uma unidade no 
                      <strong> Claris Casa & Clube</strong>, com atendimento personalizado e total discrição.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h4 className="font-semibold text-gray-800">Parceria Oficial</h4>
              </div>
              <p className="text-sm text-gray-600">
                Corretor credenciado pela Tegra Incorporadora com acesso direto às informações e condições especiais.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h4 className="font-semibold text-gray-800">Atendimento Especializado</h4>
              </div>
              <p className="text-sm text-gray-600">
                Experiência exclusiva em imóveis de luxo na Barra da Tijuca, com conhecimento profundo do mercado.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h4 className="font-semibold text-gray-800">Discrição Total</h4>
              </div>
              <p className="text-sm text-gray-600">
                Atendimento confidencial e personalizado, respeitando a privacidade de cada cliente.
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img 
                    src="/img/tegra transparente_resultado.webp" 
                    alt="Tegra Incorporadora" 
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-sm text-gray-600">Tegra Incorporadora</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Corretor Parceiro Damião José - CRECI/RJ nº 23.559
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}