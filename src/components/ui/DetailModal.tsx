import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { formatThaiDate } from '../../utils/date';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title?: string;
    name?: string;
    date?: string;
    time?: string;
    type?: string;
    category?: string;
    image?: string;
    excerpt?: string;
    content?: string;
  } | null;
}

export default function DetailModal({ isOpen, onClose, data }: DetailModalProps) {
  useEffect(() => {
    if (isOpen && data) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, data]);

  if (!data) return null;

  const displayTitle = data.title || data.name || '';
  const displayCategory = data.category || data.type || '';
  const displayDesc = data.content || data.excerpt || '';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/65 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200/60 z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header Image or Gold Banner */}
            {data.image ? (
              <div className="h-56 sm:h-72 w-full overflow-hidden relative shrink-0">
                <img
                  src={data.image}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  {displayCategory && (
                    <span className="inline-block px-3 py-1 bg-accent-gold text-white text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                      {displayCategory}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                    {displayTitle}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="p-6 pb-4 border-b border-stone-100 shrink-0 relative bg-stone-50">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 rounded-full p-1.5 hover:bg-stone-100 transition-all"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                {displayCategory && (
                  <span className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                    {displayCategory}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-accent-deep leading-tight pr-10">
                  {displayTitle}
                </h3>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-stone-600 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                {data.date && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-accent-gold mr-2 shrink-0" />
                    <span className="font-medium">วันที่: {formatThaiDate(data.date)}</span>
                  </div>
                )}
                {data.time && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-accent-gold mr-2 shrink-0" />
                    <span className="font-medium">เวลา: {data.time} น.</span>
                  </div>
                )}
                {displayCategory && !data.image && (
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 text-accent-gold mr-2 shrink-0" />
                    <span className="font-medium">ประเภท: {displayCategory}</span>
                  </div>
                )}
              </div>

              {/* Description / Content text */}
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line font-normal">
                  {displayDesc || 'ไม่มีคำอธิบายเพิ่มเติมสำหรับรายการนี้'}
                </p>
              </div>
            </div>

            {/* Footer action button */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-accent-deep text-white hover:bg-accent-brown transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
