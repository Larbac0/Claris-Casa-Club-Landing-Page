import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Volume1, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const volumeSliderRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const volumeTimeoutRef = useRef<NodeJS.Timeout>();

  const videoUrl = 'assets/videos/Tegra apresenta_ Claris Casa & Clube.mp4';

  // Reset video when modal opens/closes
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.volume = volume;
      setCurrentTime(0);
      setIsPlaying(false);
      setVideoError(false);
      setIsLoading(true);
    }
    
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, [isOpen, volume]);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  // Auto-hide volume slider
  useEffect(() => {
    if (showVolumeSlider) {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
      volumeTimeoutRef.current = setTimeout(() => {
        setShowVolumeSlider(false);
      }, 2000);
    }

    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, [showVolumeSlider]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(-0.1);
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          } else {
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          setVideoError(true);
        });
      }
      setIsPlaying(!isPlaying);
      setShowControls(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setShowVolumeSlider(true);
    }
  };

  const changeVolume = (delta: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
    setShowVolumeSlider(true);
  };

  const handleVolumeSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (volumeSliderRef.current) {
      const rect = volumeSliderRef.current.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const newVolume = Math.max(0, Math.min(1, 1 - (clickY / rect.height)));
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        if (newVolume === 0) {
          setIsMuted(true);
          videoRef.current.muted = true;
        } else if (isMuted) {
          setIsMuted(false);
          videoRef.current.muted = false;
        }
      }
    }
  };

  const seekRelative = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setShowControls(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsLoading(false);
    console.error('Erro ao carregar o vídeo. Verifique se o arquivo existe em:', videoUrl);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (playerRef.current) {
      playerRef.current.requestFullscreen().catch(() => {
        // Fallback for older browsers
        document.documentElement.requestFullscreen();
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const VolumeIcon = getVolumeIcon();

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
            ref={playerRef}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`relative w-full bg-black rounded-lg overflow-hidden shadow-2xl ${
              isFullscreen ? 'max-w-none h-screen' : 'max-w-4xl aspect-video'
            }`}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Video Element */}
            {!videoError ? (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain cursor-pointer"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onError={handleVideoError}
                onLoadStart={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onClick={togglePlayPause}
                poster="https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              />
            ) : (
              // Error State
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center p-8">
                  <div className="mb-6">
                    <Play className="w-20 h-20 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">Vídeo não encontrado</h3>
                  <p className="text-gray-400 mb-6 text-lg">
                    Por favor, adicione o arquivo de vídeo em:<br />
                    <code className="text-[#D4AF37] bg-black/50 px-2 py-1 rounded text-sm">
                      public/assets/videos/claris-institucional.mp4
                    </code>
                  </p>
                  <p className="text-gray-500">
                    Ou modifique a URL no arquivo VideoModal.tsx
                  </p>
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

            {/* Center Play Button */}
            {!isPlaying && duration > 0 && !videoError && !isLoading && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlayPause}
                  className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-2xl hover:bg-[#B8941F] transition-colors"
                >
                  <Play className="w-12 h-12 text-black ml-1" />
                </motion.button>
              </motion.div>
            )}

            {/* Controls Overlay */}
            <AnimatePresence>
              {(showControls || !isPlaying) && !videoError && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {/* Header */}
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-auto">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <h3 className="text-xl font-serif">Vídeo Institucional</h3>
                        <p className="text-white/80 text-sm">Claris Casa & Club - Barra da Tijuca</p>
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

                  {/* Bottom Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-auto">
                    {/* Progress Bar */}
                    <div 
                      className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer group relative"
                      onClick={handleProgressClick}
                    >
                      <div 
                        className="h-full bg-[#D4AF37] rounded-full transition-all duration-150 group-hover:bg-[#B8941F] relative"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        {/* Skip Back 10s */}
                        <Button
                          onClick={() => seekRelative(-10)}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 rounded-full p-2"
                          title="Voltar 10s (← )"
                        >
                          <SkipBack className="w-5 h-5" />
                        </Button>

                        {/* Play/Pause */}
                        <Button
                          onClick={togglePlayPause}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 rounded-full p-2"
                          title="Play/Pause (Espaço)"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6 ml-0.5" />
                          )}
                        </Button>

                        {/* Skip Forward 10s */}
                        <Button
                          onClick={() => seekRelative(10)}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 rounded-full p-2"
                          title="Avançar 10s (→)"
                        >
                          <SkipForward className="w-5 h-5" />
                        </Button>

                        {/* Volume Control */}
                        <div 
                          className="relative flex items-center"
                          onMouseEnter={() => setShowVolumeSlider(true)}
                          onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                          <Button
                            onClick={toggleMute}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 rounded-full p-2"
                            title="Mute/Unmute (M)"
                          >
                            <VolumeIcon className="w-5 h-5" />
                          </Button>

                          {/* Volume Slider */}
                          <AnimatePresence>
                            {showVolumeSlider && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="absolute left-full bottom-0 ml-2 bg-black/80 p-3 rounded-lg"
                              >
                                <div
                                  ref={volumeSliderRef}
                                  className="w-3 h-20 bg-white/30 rounded-full cursor-pointer relative"
                                  onClick={handleVolumeSliderChange}
                                >
                                  <div
                                    className="absolute bottom-0 w-full bg-[#D4AF37] rounded-full transition-all"
                                    style={{ height: `${volume * 100}%` }}
                                  />
                                  <div
                                    className="absolute w-4 h-4 bg-[#D4AF37] rounded-full transform -translate-x-0.5 transition-all"
                                    style={{ bottom: `${volume * 100 - 2}%` }}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="text-sm ml-2">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={toggleFullscreen}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 rounded-full p-2"
                          title="Tela cheia (F)"
                        >
                          {isFullscreen ? (
                            <Minimize className="w-5 h-5" />
                          ) : (
                            <Maximize className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close button always visible for error state */}
            {videoError && (
              <div className="absolute top-6 right-6">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2 w-10 h-10"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            )}

            {/* Keyboard shortcuts hint */}
            {!isFullscreen && showControls && !videoError && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-6 left-6 text-white/60 text-xs pointer-events-none"
              >
                <p>Espaço: Play/Pause • F: Tela cheia • M: Mute • ←→: Buscar • ↑↓: Volume</p>
              </motion.div>
            )}

            {/* Video Title Overlay */}
            {!videoError && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showControls ? 0 : 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute bottom-6 left-6 right-6 text-white pointer-events-none"
              >
                <h4 className="text-2xl font-serif mb-2">Conheça o Claris Casa & Club</h4>
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