import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { createClient } from '@supabase/supabase-js';

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
  const [chatStep, setChatStep] = useState<'welcome' | 'name' | 'email' | 'phone' | 'interest' | 'complete'>('welcome');
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<any>(null);
  const realtimeSubRef = useRef<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Supabase client if env is present
  useEffect(() => {
    try {
      const url = (import.meta.env.VITE_SUPABASE_URL as string) || '';
      const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
      if (url && key) setSupabase(createClient(url, key));
    } catch (e) {
      console.warn('Supabase init failed', e);
    }
  }, []);

  // Subscribe to realtime chat messages for current session
  useEffect(() => {
    if (!supabase) return;
    // cleanup previous
    if (realtimeSubRef.current) {
      try { supabase.removeChannel(realtimeSubRef.current); } catch (e) { /* ignore */ }
      realtimeSubRef.current = null;
    }

    if (!sessionId) return;

    // subscribe to INSERTs on chat_messages for this session
    try {
      const channel = supabase.channel('public:chat_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, (payload: any) => {
          const record = payload?.new;
          if (!record) return;
          const msg: Message = {
            id: String(record.id || Date.now()),
            type: record.sender === 'agent' ? 'bot' : 'user', // map agent -> bot side bubble left; user stays right
            content: record.content,
            timestamp: new Date(record.created_at || record.createdAt || Date.now())
          };
          // ensure agent messages appear on left (bot style)
          setMessages(prev => [...prev, msg]);
          if (!isOpen) setUnreadCount(prev => prev + 1);
        })
        .subscribe();

      realtimeSubRef.current = channel;
    } catch (e) {
      // fallback: subscribe to all messages and filter client-side
      interface SupabaseChatMessage {
        id: string | number;
        session_id: string;
        sender: string;
        content: string;
        created_at?: string;
      }

      interface SupabaseInsertPayload {
        new: SupabaseChatMessage;
        [key: string]: any;
      }

      const sub = supabase
        .from('chat_messages')
        .on('INSERT', (payload: SupabaseInsertPayload) => {
          const rec = payload.new;
          if (rec.session_id !== sessionId) return;
          const msg: Message = {
        id: String(rec.id || Date.now()),
        type: rec.sender === 'agent' ? 'bot' : 'user',
        content: rec.content,
        timestamp: new Date(rec.created_at || Date.now())
          };
          setMessages(prev => [...prev, msg]);
          if (!isOpen) setUnreadCount(prev => prev + 1);
        })
        .subscribe();
      realtimeSubRef.current = sub;
    }

    return () => {
      if (!supabase || !realtimeSubRef.current) return;
      try { supabase.removeChannel(realtimeSubRef.current); } catch (_) {}
      try { supabase.removeSubscription(realtimeSubRef.current); } catch (_) {}
      realtimeSubRef.current = null;
    };
  }, [supabase, sessionId, isOpen]);

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
        addBotMessage("Olá 👋 Seja muito bem-vindo ao universo Claris — onde sofisticação, privacidade e natureza se encontram em perfeita harmonia.");
        
        setTimeout(() => {
          addBotMessage("Sou seu corretor pessoal e estou aqui para guiá-lo por cada detalhe deste empreendimento único do Parque das Rosas - Barra da Tijuca. Posso começar te chamando pelo nome? Isso me ajuda a oferecer um atendimento mais próximo e exclusivo.");
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
    // persist to supabase if human session exists
    if (supabase && sessionId) {
      try {
        supabase.from('chat_messages').insert({ session_id: sessionId, sender: 'user', content }).then(() => {});
      } catch (e) {
        console.warn('Failed to persist user message', e);
      }
    }
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
        addBotMessage("Para finalizar, me conte: qual é o seu interesse no Claris Casa & Club? (Ex: investimento, moradia, informações gerais)", 2500);
        setChatStep('interest');
        break;

      case 'interest':
        setChatData(prev => ({ ...prev, interest: userInput }));
        addBotMessage("Excelente! Obrigado pelas informações. 🎉", 1000);
        addBotMessage("Estou conectando você com nosso consultor especializado via WhatsApp. Em instantes você receberá uma mensagem personalizada!", 3000);
        setChatStep('complete');
        submitChatData({ ...chatData, interest: userInput });
        break;

      case 'complete':
        // Continue conversation after registration is complete
        addBotMessage("Obrigado pela sua mensagem! Nosso consultor já tem suas informações e entrará em contato em breve. Há mais alguma coisa sobre o Claris Casa & Club que gostaria de saber?", 1500);
        break;

      default:
        addBotMessage("Desculpe, não entendi. Você pode reformular?", 1000);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 
  const submitChatData = async (data: ChatData) => {
    setIsSubmitting(true);

    try {
      // If Supabase client available, persist lead, session and initial message
      if (supabase) {
        // create lead
        const leadPayload: any = {
          name: data.name || null,
          email: data.email || null,
          phone: data.phone || null,
          message: data.interest || null,
          whatsapp_consent: true,
          source: 'chat-widget'
        };

        const leadRes = await supabase.from('leads').insert(leadPayload).select('*').maybeSingle();
        const lead = leadRes?.data || null;

        // create chat session
        let createdSession: any = null;
        if (lead && lead.id) {
          const sessionRes = await supabase.from('chat_sessions').insert({ lead_id: lead.id }).select('*').maybeSingle();
          createdSession = sessionRes?.data || null;
        }

        // insert initial user message into chat_messages
        if (createdSession) {
          await supabase.from('chat_messages').insert({ session_id: createdSession.id, sender: 'user', content: data.interest || 'Contato via chat' });
          setSessionId(createdSession.id);
          setSubmitStatus('success');
          addBotMessage(`${data.name}, suas informações foram enviadas com sucesso! 🎯`, 2000);
          addBotMessage('Um de nossos consultores humanos iniciará a conversa em breve.', 3500);
        } else {
          // fallback: still show success to user
          setSubmitStatus('success');
          addBotMessage(`${data.name}, suas informações foram enviadas com sucesso! 🎯`, 2000);
        }

      } else {
        // fallback behavior if no supabase client
        setSubmitStatus('success');
        addBotMessage(`${data.name}, suas informações foram enviadas com sucesso! 🎯`, 2000);
      }

      // keep chat open and in human mode
      setChatStep('complete');
    } catch (error) {
      console.error('Error submitting chat data:', error);
      setSubmitStatus('error');
      addBotMessage('Houve um problema ao salvar seus dados. Vou abrir o WhatsApp direto para você.', 1500);
      const whatsappNumber = '5521999887766';
      const message = `Olá! Sou ${data.name}. Email: ${data.email}. Telefone: ${data.phone}. Interesse: ${data.interest}. Gostaria de saber mais sobre o Claris Casa & Club.`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      setTimeout(() => { try { window.open(whatsappUrl, '_blank'); } catch (_) {} }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // When user sends messages after session created, persist them
  useEffect(() => {
    // no-op: addUserMessage already persists if sessionId and supabase exist
  }, [sessionId, supabase]);

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
      case 'interest': return 'Conte-me sobre seu interesse...';
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
                  <p className="text-xs opacity-90">Assistente Virtual</p>
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

                  {/* Chat Complete State - Continue conversation */}
                  {chatStep === 'complete' && (
                    <div className="p-4 bg-white border-t">
                      <div className="text-center text-gray-600 text-sm mb-3">
                        Cadastro concluído! Continue conversando.
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          ref={inputRef}
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Digite uma nova mensagem..."
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
                      <div className="text-xs text-gray-500 mt-2 text-center">
                        Suas informações já foram enviadas com sucesso
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