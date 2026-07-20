import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function Gallery() {
  const { gallery = [] } = useStore();
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');

  // Lightbox state
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Lock body scroll when selectedAlbum is active
  useEffect(() => {
    if (selectedAlbum) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedAlbum]);

  // get unique categories
  const categories = ['ทั้งหมด', ...Array.from(new Set((gallery || []).map(g => g.category).filter(Boolean)))];

  const filteredImages = (gallery || []).filter(img => activeCategory === 'ทั้งหมด' || img.category === activeCategory);

  const openAlbum = (album: any) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedAlbum) return;
    const imagesList = selectedAlbum.images && selectedAlbum.images.length > 0 ? selectedAlbum.images : [selectedAlbum.url];
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedAlbum) return;
    const imagesList = selectedAlbum.images && selectedAlbum.images.length > 0 ? selectedAlbum.images : [selectedAlbum.url];
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const albumImages = selectedAlbum 
    ? (selectedAlbum.images && selectedAlbum.images.length > 0 ? selectedAlbum.images : [selectedAlbum.url])
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-bg-base pt-20">
      {/* Page Header */}
      <section className="relative py-20 md:py-28 text-center px-4 overflow-hidden bg-[#7C8577]">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/temple_hero.jpg" 
            alt="Temple Background" 
            className="w-full h-full object-cover opacity-35 filter brightness-90 contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B3022]/40 via-transparent to-[#1B3022]/20" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">แกลเลอรี่</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            ประมวลภาพกิจกรรมและงานบุญต่างๆ ของวัดดอนสว่างธรรมเจริญศรัทธา
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Categories */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as string)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-accent-deep text-white shadow-md'
                      : 'bg-white border border-sep text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat as string}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredImages.map((img, i) => {
              const imageCount = img.images && img.images.length > 0 ? img.images.length : (img.url ? 1 : 0);
              const displayCover = img.images && img.images.length > 0 ? img.images[0] : img.url;

              return (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  onClick={() => openAlbum(img)}
                  className="aspect-square rounded-2xl overflow-hidden bg-stone-200 group relative cursor-pointer shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Photo Count Tag */}
                  {imageCount > 0 && (
                    <div className="absolute top-3 right-3 z-10 bg-black/55 backdrop-blur-md text-white px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 border border-white/10 shadow-sm">
                      <ImageIcon className="w-3 h-3 text-accent-gold" />
                      {imageCount} รูป
                    </div>
                  )}

                  <img 
                    src={displayCover} 
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                    <div className="min-w-0 w-full">
                      <p className="text-white font-bold text-sm truncate">{img.title}</p>
                      <p className="text-accent-gold text-xs font-semibold mt-0.5">{img.category}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredImages.length === 0 && (
             <div className="text-center py-20 text-stone-500">
               ไม่พบรูปภาพในหมวดหมู่นี้
             </div>
          )}
        </div>
      </section>

      {/* Lightbox / Slider Modal */}
      <AnimatePresence>
        {selectedAlbum && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAlbum}
              className="fixed inset-0 bg-stone-950/90 backdrop-blur-md"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative bg-[#1C1A18] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-stone-800 z-10 flex flex-col md:flex-row max-h-[85vh] md:max-h-[80vh]"
            >
              {/* Left Side: Photo Slider / Active Image */}
              <div className="flex-1 bg-black relative flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <button
                  onClick={closeAlbum}
                  className="absolute top-4 right-4 md:hidden z-30 bg-black/50 text-white hover:bg-black/80 rounded-full p-2 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {albumImages.length > 0 && (
                  <img
                    src={albumImages[currentImageIndex]}
                    alt={`${selectedAlbum.title} - ${currentImageIndex + 1}`}
                    className="max-w-full max-h-[50vh] md:max-h-[70vh] object-contain select-none transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Navigation Arrows */}
                {albumImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-accent-gold text-white hover:text-white p-2 sm:p-3 rounded-full transition-all focus:outline-none backdrop-blur-sm"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-accent-gold text-white hover:text-white p-2 sm:p-3 rounded-full transition-all focus:outline-none backdrop-blur-sm"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter Badge */}
                <div className="absolute bottom-4 left-4 bg-black/55 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm font-semibold">
                  {currentImageIndex + 1} / {albumImages.length}
                </div>
              </div>

              {/* Right Side: Info and Thumbnails Grid */}
              <div className="w-full md:w-80 bg-[#262422] p-6 border-t md:border-t-0 md:border-l border-stone-800 flex flex-col justify-between shrink-0 overflow-y-auto max-h-[35vh] md:max-h-full">
                <div>
                  <div className="hidden md:flex justify-end mb-4">
                    <button
                      onClick={closeAlbum}
                      className="text-stone-400 hover:text-white hover:bg-stone-800/80 rounded-full p-1.5 transition-all"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 bg-accent-gold text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">
                    {selectedAlbum.category}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white mb-4 leading-snug">
                    {selectedAlbum.title}
                  </h3>

                  {albumImages.length > 1 && (
                    <div className="space-y-2">
                      <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
                        รูปภาพในอัลบั้ม ({albumImages.length})
                      </p>
                      {/* Thumbnail Strip Grid */}
                      <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
                        {albumImages.map((thumbUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                              idx === currentImageIndex
                                ? 'border-accent-gold scale-95 shadow-md shadow-accent-gold/20'
                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-stone-600'
                            }`}
                          >
                            <img
                              src={thumbUrl}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {idx === currentImageIndex && (
                              <div className="absolute inset-0 bg-accent-gold/10" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/60 flex items-center justify-between text-xs text-stone-500 shrink-0">
                  <span>วัดดอนสว่างธรรมเจริญศรัทธา</span>
                  <span>แกลเลอรี่</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
