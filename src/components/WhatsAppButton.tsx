import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { createLead } from '../lib/leadsApi';


const WHATSAPP_NUMBER = '5521971875960';
const WHATSAPP_MESSAGE = 'Olá! Gostaria de agendar uma consultoria privada para conhecer o Claris Casa & Clube. Tenho interesse em explorar as oportunidades disponíveis e entender como este projeto pode se alinhar ao meu estilo de vida.';


const WhatsAppButtonComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipShown, setTooltipShown] = useState(false);

  // Show button after user scrolls a bit
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show tooltip only once automatically
  useEffect(() => {
    if (!isVisible || tooltipShown) return;
    const initialTimeout = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
        setTooltipShown(true);
      }, 3000);
    }, 2000);
    return () => clearTimeout(initialTimeout);
  }, [isVisible, tooltipShown]);

  // Show tooltip on hover
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleWhatsAppClick = () => {
    // Record lead with whatsapp consent (best-effort)
    try {
      createLead({
        name: null,
        email: null,
        phone: WHATSAPP_NUMBER,
        message: WHATSAPP_MESSAGE,
        whatsappConsent: true,
        source: 'whatsapp_button',
        page_url: typeof window !== 'undefined' ? window.location.href : null,
        page_title: typeof document !== 'undefined' ? document.title : null,
      });
    } catch (err) {
      // swallow errors, still open WhatsApp
      // eslint-disable-next-line no-console
      console.warn('[leadsApi] failed to create whatsapp lead', err);
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(whatsappUrl, '_blank');
    
    // Track WhatsApp click if analytics available
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: 'floating_button',
        value: 1
      });
    }

    setShowTooltip(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-30 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-20 bottom-1/2 translate-y-1/2 flex items-center"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-3 w-[400px] border border-gray-100 relative flex items-center min-h-[80px]">
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute top-2 right-2 w-10 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
              <div className="pr-7">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Fale com nosso atendimento exclusivo
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Tire suas dúvidas e agende sua visita ao Claris Casa & Clube — com discrição, agilidade e sofisticação.
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-[#25D366] hover:bg-[#1FAD54] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Fale com o corretor Tegra
                </button>
              </div>
              {/* Tooltip arrow horizontal */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 rotate-45 w-3 h-3 bg-white border-t border-l border-gray-100"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWhatsAppClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-16 h-16 bg-[#25D366] hover:bg-[#1FAD54] rounded-full shadow-2xl flex items-center justify-center transition-colors duration-200 group"
      >
        {/* Pulsing animation */}
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-[#25D366] rounded-full opacity-30"
        />
        {/* WhatsApp Icon */}
        <MessageCircle className="w-8 h-8 text-white z-10" />
        {/* Notification badge */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-xs text-white font-bold">1</span>
        </motion.div>
      </motion.button>

      {/* Status indicator */}
      <div className="absolute -bottom-1 -left-1 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-lg border border-gray-100">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-600 font-medium">Online</span>
      </div>
    </div>
  );
}

export const WhatsAppButton = React.memo(WhatsAppButtonComponent);