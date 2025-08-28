import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Camera,
} from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";

interface GalleryImage {
  src: string;
  alt: string;
}

interface GallerySection {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
}

const gallerySections: GallerySection[] = [
  {
    id: "vista-externa",
    title: "Vista Externa",
    description: "Fachada moderna e elegante",
    images: [
      {
        src: "./img/Vista Externa 1_resultado.webp",
        alt: "Vista Externa Principal",
      },
      {
        src: "./img/Vista Externa 2_resultado.webp",
        alt: "Vista Externa Lateral",
      },
      {
        src: "./img/Vista Externa 3_resultado.webp",
        alt: "Vista Externa Noturna",
      },
    ],
  },
  {
    id: "sala-estar",
    title: "Sala de Estar",
    description: "Ambiente amplo e sofisticado",
    images: [
      {
        src: "./img/Sala de estar 4_resultado.webp",
        alt: "Sala de Estar Principal",
      },
            {
        src: "./img/Sala de estar 5_resultado.webp",
        alt: "Sala de Estar Ângulo 2",
      },
    ],
  },
  {
    id: "cozinha",
    title: "Cozinha Gourmet",
    description: "Equipada com os melhores acabamentos",
    images: [
      {
        src: "./img/Cozinha 2_resultado.webp",
        alt: "Cozinha Gourmet Principal",
      },
      {
        src: "./img/Cozinha 3_resultado.webp",
        alt: "Cozinha Gourmet Detalhes",
      },
      {
        src: "./img/Cozinha 4_resultado.webp",
        alt: "Cozinha Gourmet Ilha",
      },
    ],
  },
  {
    id: "piscina",
    title: "Área da Piscina",
    description: "Área de lazer exclusiva",
    images: [
      {
        src: "./img/Piscina_resultado.webp",
        alt: "Piscina Principal",
      },
      {
        src: "./img/Piscina 2_resultado.webp",
        alt: "Piscina Vista Aérea",
      },
    ],
  },
  {
    id: "quarto-master",
    title: "Quarto Master",
    description: "Suíte principal com vista para o mar",
    images: [
      {
        src: "./img/Suiter master 4_resultado.webp",
        alt: "Quarto Master Principal",
      },
      {
        src: "./img/Suiter master 5_resultado.webp",
        alt: "Quarto Master Closet",
      },
      {
        src: "./img/Suiter master 6_resultado.webp",
        alt: "Quarto Master Closet",
      },
    ],
  },
  {
    id: "varanda",
    title: "Varanda Gourmet",
    description: "Espaço gourmet com vista panorâmica",
    images: [
      {
        src: "./img/Varanda 4_resultado.webp",
        alt: "Varanda Gourmet Principal",
      },
      {
        src: "./img/Varanda 5_resultado.webp",
        alt: "Varanda Vista Mar",
      },
    ],
  },
  {
    id: "garagem",
    title: "Garagem Subterrânea",
    description: "Garagem subterrânea privativa",
    images: [
      {
        src: "./img/Garegem 3_resultado.webp",
        alt: "Garagem Subterrânea Entrada",
      },
      {
        src: "./img/Garegem 4_resultado.webp",
        alt: "Garagem Subterrânea Vagas",
      },
      {
        src: "./img/Garegem 5_resultado.webp",
        alt: "Garagem Subterrânea Segurança",
      },
    ],
  },
];

export function VisualTour() {
  const [selectedSection, setSelectedSection] = useState<
    number | null
  >(null);
  const [selectedImageInSection, setSelectedImageInSection] =
    useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [sliderPosition, setSliderPosition] = useState(50);

  // Get current image for each section
  const getCurrentImage = (sectionIndex: number) => {
    const sectionId = gallerySections[sectionIndex].id;
    const currentIndex = currentImageIndex[sectionId] || 0;
    return gallerySections[sectionIndex].images[currentIndex];
  };

  // Navigate to next image in a section
  const nextImageInSection = (sectionIndex: number) => {
    const sectionId = gallerySections[sectionIndex].id;
    const section = gallerySections[sectionIndex];
    const currentIndex = currentImageIndex[sectionId] || 0;

    // Se chegou na última imagem da seção, vai para a próxima seção
    if (currentIndex === section.images.length - 1) {
      const nextSectionIndex =
        (sectionIndex + 1) % gallerySections.length;
      const nextSectionId =
        gallerySections[nextSectionIndex].id;

      // Reset do índice da nova seção para 0
      setCurrentImageIndex((prev) => ({
        ...prev,
        [nextSectionId]: 0,
      }));
    } else {
      // Continua na mesma seção
      const nextIndex =
        (currentIndex + 1) % section.images.length;
      setCurrentImageIndex((prev) => ({
        ...prev,
        [sectionId]: nextIndex,
      }));
    }
  };

  // Navigate to previous image in a section
  const prevImageInSection = (sectionIndex: number) => {
    const sectionId = gallerySections[sectionIndex].id;
    const section = gallerySections[sectionIndex];
    const currentIndex = currentImageIndex[sectionId] || 0;

    // Se está na primeira imagem da seção, vai para a seção anterior
    if (currentIndex === 0) {
      const prevSectionIndex =
        (sectionIndex - 1 + gallerySections.length) %
        gallerySections.length;
      const prevSectionId =
        gallerySections[prevSectionIndex].id;
      const prevSection = gallerySections[prevSectionIndex];

      // Vai para a última imagem da seção anterior
      setCurrentImageIndex((prev) => ({
        ...prev,
        [prevSectionId]: prevSection.images.length - 1,
      }));
    } else {
      // Continua na mesma seção
      const prevIndex =
        (currentIndex - 1 + section.images.length) %
        section.images.length;
      setCurrentImageIndex((prev) => ({
        ...prev,
        [sectionId]: prevIndex,
      }));
    }
  };

  // Handle section click to open lightbox
  const handleSectionClick = (sectionIndex: number) => {
    const sectionId = gallerySections[sectionIndex].id;
    const currentIndex = currentImageIndex[sectionId] || 0;
    setSelectedSection(sectionIndex);
    setSelectedImageInSection(currentIndex);
  };

  // Navigate in lightbox
  const nextInLightbox = () => {
    if (selectedSection !== null) {
      // Se chegou na última imagem da seção, vai para a próxima seção
      if (
        selectedImageInSection ===
        gallerySections[selectedSection].images.length - 1
      ) {
        const nextSectionIndex =
          (selectedSection + 1) % gallerySections.length;
        setSelectedSection(nextSectionIndex);
        setSelectedImageInSection(0);

        // Atualiza o estado da grade também
        const nextSectionId =
          gallerySections[nextSectionIndex].id;
        setCurrentImageIndex((prev) => ({
          ...prev,
          [nextSectionId]: 0,
        }));
      } else {
        // Continua na mesma seção
        const nextImage = selectedImageInSection + 1;
        setSelectedImageInSection(nextImage);

        // Atualiza o estado da grade também
        const sectionId = gallerySections[selectedSection].id;
        setCurrentImageIndex((prev) => ({
          ...prev,
          [sectionId]: nextImage,
        }));
      }
    }
  };

  const prevInLightbox = () => {
    if (selectedSection !== null) {

      // Se está na primeira imagem da seção, vai para a seção anterior
      if (selectedImageInSection === 0) {
        const prevSectionIndex =
          (selectedSection - 1 + gallerySections.length) %
          gallerySections.length;
        const prevSection = gallerySections[prevSectionIndex];
        const lastImageIndex = prevSection.images.length - 1;

        setSelectedSection(prevSectionIndex);
        setSelectedImageInSection(lastImageIndex);

        // Atualiza o estado da grade também
        const prevSectionId =
          gallerySections[prevSectionIndex].id;
        setCurrentImageIndex((prev) => ({
          ...prev,
          [prevSectionId]: lastImageIndex,
        }));
      } else {
        // Continua na mesma seção
        const prevImage = selectedImageInSection - 1;
        setSelectedImageInSection(prevImage);

        // Atualiza o estado da grade também
        const sectionId = gallerySections[selectedSection].id;
        setCurrentImageIndex((prev) => ({
          ...prev,
          [sectionId]: prevImage,
        }));
      }
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-gray-800 mb-6 font-serif"
          >
            Tour <span className="text-[#D4AF37]">Virtual</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Conheça cada detalhe do seu futuro lar através de
            nossa galeria exclusiva
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {gallerySections.map((section, sectionIndex) => {
            const currentImage = getCurrentImage(sectionIndex);
            const hasMultipleImages = section.images.length > 1;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: sectionIndex * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg"
              >
                <ImageWithFallback
                  src={currentImage.src}
                  alt={currentImage.alt}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Image counter indicator */}
                {hasMultipleImages && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>
                      {(currentImageIndex[section.id] || 0) + 1}
                      /{section.images.length}
                    </span>
                  </div>
                )}

                {/* Navigation dots for multiple images */}
                {hasMultipleImages && (
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {section.images.map((_, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => ({
                            ...prev,
                            [section.id]: imgIndex,
                          }));
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          (currentImageIndex[section.id] ||
                            0) === imgIndex
                            ? "bg-[#D4AF37] w-4"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Section navigation arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImageInSection(sectionIndex);
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImageInSection(sectionIndex);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Section info overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">
                      {section.title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Play button overlay */}
                <div
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  onClick={() =>
                    handleSectionClick(sectionIndex)
                  }
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Before/After Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl text-gray-800 mb-4 font-serif">
              Antes & Depois
            </h3>
            <p className="text-lg text-gray-600">
              Veja a transformação do terreno em um
              empreendimento de luxo
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl h-80 md:h-96">
              {/* Before Image */}
              <ImageWithFallback
                src="./img/Entrada_resultado.webp"
                alt="Antes - Terreno"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
              />

              {/* After Image */}
              <ImageWithFallback
                src="./img/Entrada_resultado_1.webp"
                alt="Depois - Claris Casa & Clube"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                }}
              />

              {/* Slider */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-1 h-4 bg-gray-400 rounded mx-0.5"></div>
                  <div className="w-1 h-4 bg-gray-400 rounded mx-0.5"></div>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                Antes
              </div>
              <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                Depois
              </div>
            </div>

            {/* Slider Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) =>
                setSliderPosition(Number(e.target.value))
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
            />
          </div>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedSection !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedSection(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithFallback
                  src={
                    gallerySections[selectedSection].images[
                      selectedImageInSection
                    ].src
                  }
                  alt={
                    gallerySections[selectedSection].images[
                      selectedImageInSection
                    ].alt
                  }
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />

                <button
                  onClick={() => setSelectedSection(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <button
                  onClick={prevInLightbox}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextInLightbox}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image info and thumbnails */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/70 text-white px-4 py-2 rounded-t-lg text-center">
                    <h3 className="font-semibold">
                      {gallerySections[selectedSection].title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {
                        gallerySections[selectedSection]
                          .description
                      }
                    </p>
                  </div>

                  {/* Thumbnail navigation */}
                  {gallerySections[selectedSection].images
                    .length > 1 && (
                    <div className="bg-black/70 px-4 py-2 rounded-b-lg flex gap-2 justify-center">
                      {gallerySections[
                        selectedSection
                      ].images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setSelectedImageInSection(index)
                          }
                          className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                            selectedImageInSection === index
                              ? "border-[#D4AF37]"
                              : "border-transparent hover:border-white/50"
                          }`}
                        >
                          <ImageWithFallback
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}