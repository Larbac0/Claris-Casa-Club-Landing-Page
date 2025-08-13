import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Phone, Mail, User, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { projectId, publicAnonKey } from './utils/supabase/info';

export function FinalCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    whatsappConsent: false
  });
  
  const [unitsAvailable, setUnitsAvailable] = useState(12);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Fetch initial stats
  useEffect(() => {
    fetchStats();
    // Initialize server data
    initializeServer();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const initializeServer = async () => {
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-17b725d2/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log('Error initializing server:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-17b725d2/stats`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnitsAvailable(data.stats.unitsAvailable);
      }
    } catch (error) {
      console.log('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-17b725d2/submit-contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Obrigado! Entraremos em contato em breve.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          whatsappConsent: false
        });

        // Refresh stats to show updated units
        setTimeout(() => {
          fetchStats();
        }, 1000);

      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Erro ao enviar formulário. Tente novamente.');
      }
    } catch (error) {
      console.log('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
          alt="Claris Casa & Club"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Urgency Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl text-white mb-6 font-serif">
            Unidades <span className="text-[#D4AF37]">Limitadas</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Garanta seu contato exclusivo antes que as unidades se esgotem
          </p>

          {/* Units Counter */}
          <div className="inline-flex items-center gap-4 bg-[#D4AF37] text-black px-6 py-3 rounded-full mb-6">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">
              Apenas {unitsAvailable} unidades disponíveis
            </span>
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white min-w-[80px]">
              <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-sm opacity-75">Horas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white min-w-[80px]">
              <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-sm opacity-75">Min</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white min-w-[80px]">
              <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-sm opacity-75">Seg</div>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Benefits Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h3 className="text-3xl font-serif mb-6">
                Receba <span className="text-[#D4AF37]">gratuitamente:</span>
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Plantas Exclusivas</h4>
                    <p className="text-white/80 text-sm">Layouts detalhados de todos os tipos</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Vídeo Institucional</h4>
                    <p className="text-white/80 text-sm">Tour virtual completo do empreendimento</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Atendimento Personalizado</h4>
                    <p className="text-white/80 text-sm">Consultor especializado para seus objetivos</p>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <p className="text-white/90 italic mb-4">
                  "Com mais de 30 anos no mercado, garantimos a qualidade e pontualidade que você merece."
                </p>
                <div className="text-[#D4AF37] font-semibold">
                  - Construtora Premium
                </div>
              </div>
            </motion.div>

            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              id="contact-form"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif text-gray-800 mb-2">
                    Agende agora sua <span className="text-[#D4AF37]">apresentação privada</span>
                  </h3>
                  <p className="text-gray-600">
                    Preencha os dados e receba seu material exclusivo
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      type="tel"
                      placeholder="WhatsApp com DDD"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                      required
                    />
                  </div>

                  <div>
                    <Textarea
                      placeholder="Como podemos ajudar? (opcional)"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whatsapp-consent"
                      checked={formData.whatsappConsent}
                      onCheckedChange={(checked) => handleInputChange('whatsappConsent', checked as boolean)}
                      className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37]"
                    />
                    <label htmlFor="whatsapp-consent" className="text-sm text-gray-600">
                      Quero receber novidades pelo WhatsApp
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#D4AF37] hover:bg-[#B8941F] disabled:bg-gray-400 disabled:cursor-not-allowed text-black text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {isSubmitting ? 'Enviando...' : 'Quero conhecer o Claris! 🏠'}
                  </Button>

                  {/* Submit Status Messages */}
                  {submitStatus !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                        submitStatus === 'success' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {submitStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span className="text-sm">{submitMessage}</span>
                    </motion.div>
                  )}

                  <p className="text-xs text-gray-500 text-center mt-4">
                    🔒 Privacidade garantida – Seus dados estão protegidos.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-block bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full border border-white/20">
            <p className="text-white">
              <span className="text-[#D4AF37] font-semibold">Atenção:</span> Promoção válida apenas para os primeiros interessados
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}