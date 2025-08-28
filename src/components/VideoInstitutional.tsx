import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface LocalVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
}

export function YouTubeVideoModal({ isOpen, onClose, videoSrc = "./assets/videos/Vídeo-sem-título-‐-Feito-com-o-Clipchamp-_1_.webm" }: LocalVideoModalProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl font-serif">Vídeo Institucional</h3>
                  <p className="text-white/80 text-sm">Claris Casa & Clube - Barra da Tijuca</p>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2 w-10 h-10"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Local Video */}
            <video
              src={videoSrc}
              className="w-full h-full"
              controls
              autoPlay
              playsInline
              title="Vídeo Institucional Claris Casa & Clube"
            />

            {/* Video Title Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute bottom-6 left-6 right-6 text-white pointer-events-none z-10"
            >
              <h4 className="text-2xl font-serif mb-2">Conheça o Claris Casa & Clube</h4>
              <p className="text-white/90 text-lg">
                Um novo conceito em moradia de luxo na Barra da Tijuca
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}