import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [videoError, setVideoError] = useState(false);

	const videoUrl = "./assets/videos/Video institucional.webm";

	// Pause/cleanup when modal closes
	useEffect(() => {
		if (!isOpen && videoRef.current) {
			videoRef.current.pause();
			if (document.fullscreenElement) {
				document.exitFullscreen().catch(() => {/* ignore */});
			}
			setIsLoading(true);
		}
	}, [isOpen]);

	// Simple keyboard: Escape closes modal
	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (!isOpen) return;
			if (e.code === 'Escape') {
				onClose();
			}
		};
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [isOpen, onClose]);

	const handleLoadedMetadata = () => {
		setIsLoading(false);
	};

	const handleVideoError = () => {
		setVideoError(true);
		setIsLoading(false);
		console.error('Erro ao carregar o vídeo:', videoUrl);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
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

						{/* Local Video (nativo com controles) */}
						{!videoError ? (
							<video
								ref={videoRef}
								src={videoUrl}
								className="w-full h-full object-contain bg-black"
								controls
								autoPlay
								playsInline
								onLoadedMetadata={handleLoadedMetadata}
								onError={handleVideoError}
								poster="https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
							/>
						) : (
							// Error State
							<div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
								<div className="text-center p-8">
									<h3 className="text-2xl font-serif mb-4">Vídeo não encontrado</h3>
									<p className="text-gray-400 mb-6 text-lg">
										Por favor, adicione o arquivo de vídeo em:<br />
										<code className="text-[#D4AF37] bg-black/50 px-2 py-1 rounded text-sm">
											public/assets/videos/claris-institucional.mp4
										</code>
									</p>
									<p className="text-gray-500">Ou modifique a URL no arquivo VideoModal.tsx</p>
								</div>
							</div>
						)}

						{/* Loading Overlay */}
						{isLoading && !videoError && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/50">
								<motion.div
									animate={{ rotate: 360 }}
									transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
									className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full"
								/>
							</div>
						)}

						{/* Video Title Overlay */}
						{!videoError && !isLoading && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.3 }}
								className="absolute bottom-6 left-6 right-6 text-white pointer-events-none"
							>
								<h4 className="text-2xl font-serif mb-2">Conheça o Claris Casa & Clube</h4>
								<p className="text-white/90 text-lg">
									Um novo conceito em moradia de luxo na Barra da Tijuca
								</p>
							</motion.div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}