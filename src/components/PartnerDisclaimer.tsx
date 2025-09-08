import { motion } from 'framer-motion';
import { Info, Shield } from 'lucide-react';

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
        </motion.div>
      </div>
    </section>
  );
}