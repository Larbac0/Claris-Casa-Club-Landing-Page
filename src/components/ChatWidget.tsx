import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatData {
  name: string;
  email: string;
  phone: string;
  interest: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [chatStep, setChatStep] = useState<'welcome' | 'name' | 'email' | 'phone' | 'complete'>('welcome');
  const [chatData, setChatData] = useState<ChatData>({
    name: '',
    email: '',
    phone: '',
    interest: ''
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, chatStep]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage("Olá 👋 Seja muito bem-vindo ao universo Claris — onde sofisticação, privacidade e natureza se encontram em perfeita harmonia. Sou seu corretor pessoal e estou aqui para guiá-lo por cada detalhe deste empreendimento único do Parque das Rosas - Barra da Tijuca.");
        
        setTimeout(() => {
          addBotMessage("Posso começar te chamando pelo nome? Isso me ajuda a oferecer um atendimento mais próximo e exclusivo.");
          setChatStep('name');
        }, 2000);
      }, 1000);
    }
  }, [isOpen]);

  const addBotMessage = (content: string, delay = 0) => {
    if (delay > 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'bot',
          content,
          timestamp: new Date()
        }]);
        if (!isOpen) setUnreadCount(prev => prev + 1);
      }, delay);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date()
      }]);
      if (!isOpen) setUnreadCount(prev => prev + 1);
    }
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    addUserMessage(currentInput);
    const userInput = currentInput.trim();
    setCurrentInput('');

    // Process based on current step
    switch (chatStep) {
      case 'name':
        setChatData(prev => ({ ...prev, name: userInput }));
        addBotMessage(`Prazer em conhecê-lo, ${userInput}! 😊`, 1000);
        addBotMessage("Agora, para que eu possa enviar informações exclusivas sobre o Claris, qual é o seu melhor e-mail?", 2500);
        setChatStep('email');
        break;

      case 'email':
        if (!isValidEmail(userInput)) {
          addBotMessage("Por favor, digite um e-mail válido (exemplo: joao@email.com)", 1000);
          return;
        }
        setChatData(prev => ({ ...prev, email: userInput }));
        addBotMessage("Perfeito! ✅", 1000);
        addBotMessage("Qual é o seu WhatsApp com DDD? (Ex: 11 99999-9999)", 2000);
        setChatStep('phone');
        break;

      case 'phone':
        setChatData(prev => ({ ...prev, phone: userInput }));
        addBotMessage("Ótimo! 📱", 1000);

        setChatData(prev => ({ ...prev, interest: userInput }));
        addBotMessage("Excelente! Obrigado pelas informações. 🎉", 1000);
        addBotMessage("Estou conectando você com nosso consultor especializado via WhatsApp. Em instantes você receberá uma mensagem personalizada!", 3000);
        setChatStep('complete');
        submitChatData({ ...chatData, interest: userInput });
        break;

      default:
        addBotMessage("Desculpe, não entendi. Você pode reformular?", 1000);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ...existing code...

const submitChatData = async (data: ChatData) => {
  setIsSubmitting(true);

  try {
    // 1. Enviar para HubSpot
    const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/50401797/ec59b695-8d5a-46a2-a55a-8b97816bcce7`;

    const hubspotPayload = {
      fields: [
        { name: 'firstname', value: data.name },
        { name: 'email', value: data.email },
        { name: 'phone', value: data.phone },
        { name: 'message', value: data.interest },
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title,
      },
    };

    const hubspotResponse = await fetch(hubspotUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hubspotPayload),
    });

    if (!hubspotResponse.ok) {
      throw new Error('Erro ao enviar para HubSpot');
    }

    // 2. Enviar para Supabase
    const baseUrl = `https://pezerzeepjrmzsfpoegi.supabase.co/functions/v1/make-server-17b725d2`;
    const response = await fetch(`${baseUrl}/chat-submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlemVyemVlcGpybXpzZnBvZWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTY0MjIsImV4cCI6MjA3MDI3MjQyMn0.LY4ju-QBzeOOxG_KZnSm24ut9t_PcuyOoVumQptCBdo`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      setSubmitStatus('success');
      addBotMessage(`${data.name}, suas informações foram enviadas com sucesso! 🎯`, 2000);
      addBotMessage("Nosso consultor entrará em contato pelo WhatsApp em alguns minutos. Enquanto isso, continue explorando nossa landing page!", 4000);
      setTimeout(() => { setIsMinimized(true); }, 8000);
    } else {
      throw new Error(result.error || 'Erro no envio');
    }
  } catch (error) {
    console.error('Error submitting chat data:', error);
    setSubmitStatus('error');
    // ...fallback para WhatsApp...
  } finally {
    setIsSubmitting(false);
  }
};

// ...existing code...

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const getPlaceholderText = () => {
    switch (chatStep) {
      case 'name': return 'Digite seu nome...';
      case 'email': return 'Digite seu e-mail...';
      case 'phone': return 'Digite seu WhatsApp...';
      default: return 'Digite sua mensagem...';
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#9A7B1A] shadow-2xl hover:shadow-[#D4AF37]/25 text-black relative overflow-hidden group"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.div>
          
          {/* Unread badge */}
          {unreadCount > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium"
            >
              {unreadCount}
            </motion.div>
          )}

          {/* Pulse animation */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-[#D4AF37] animate-ping opacity-20"></div>
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-26 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Claris Casa & Club</h3>
                  <p className="text-xs opacity-90">Corretor Virtual Exclusivo</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMinimize}
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-white/20 rounded-full p-1 w-8 h-8"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                </Button>
                <Button
                  onClick={toggleChat}
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-white/20 rounded-full p-1 w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Body */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="flex flex-col flex-1"
                >
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.type === 'user'
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-white text-gray-800 shadow-sm border'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-60 mt-1">
                              {message.timestamp.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-white text-gray-800 shadow-sm border p-3 rounded-lg">
                            <div className="flex items-center space-x-1">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Submit status */}
                      {submitStatus !== 'idle' && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg border ${
                            submitStatus === 'success' 
                              ? 'bg-green-50 text-green-800 border-green-200' 
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              {submitStatus === 'success' ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <AlertCircle className="w-4 h-4" />
                              )}
                              <p className="text-sm">
                                {submitStatus === 'success' 
                                  ? 'Dados enviados com sucesso!' 
                                  : 'Erro no envio. Tentando WhatsApp direto...'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  {chatStep !== 'complete' && (
                    <div className="p-4 bg-white border-t">
                      <div className="flex items-center gap-2">
                        <Input
                          ref={inputRef}
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={getPlaceholderText()}
                          disabled={isSubmitting}
                          className="flex-1 border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!currentInput.trim() || isSubmitting}
                          className="bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-full p-2 w-10 h-10"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mt-3 flex items-center justify-center">
                        <div className="flex space-x-2">
                          {['name', 'email', 'phone', 'interest'].map((step, index) => (
                            <div
                              key={step}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                ['name', 'email', 'phone', 'interest'].indexOf(chatStep) >= index
                                  ? 'bg-[#D4AF37]'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}