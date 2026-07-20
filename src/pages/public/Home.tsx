import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Calendar, ChevronRight, MapPin, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useState, useEffect } from 'react';
import { formatThaiDate, getShortThaiDateParts } from '../../utils/date';
import DetailModal from '../../components/ui/DetailModal';

// Store the state of popup dismissal globally in memory so it survives routing but resets on refresh.
let hasDismissedPopup = false;

export default function Home() {
  const { news = [], popups = [], announcements = [], activities = [] } = useStore();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activePopups = (popups || []).filter(p => p.status === 'Active');
  const activeAnnouncements = (announcements || []).filter(a => a.status === 'Active');

  useEffect(() => {
    if (activePopups.length > 0 && !hasDismissedPopup) {
      setShowPopup(true);
    }
  }, [popups]);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPopup]);

  const handleDismissPopup = () => {
    setShowPopup(false);
    hasDismissedPopup = true;
  };

  const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedActivities = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const recentNews = sortedNews.slice(0, 3);
  const recentActivities = sortedActivities.slice(0, 3);

  return (
    <div className="flex flex-col">
      
      {/* Marquee Announcements */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-accent-gold text-white text-xs py-2 overflow-hidden relative z-40 border-b border-white/20">
          <div className="whitespace-nowrap animate-marquee inline-flex">
            <div className="inline-flex">
              {activeAnnouncements.map((ann, i) => (
                <span key={`a-${i}`} className="mx-8 font-medium shrink-0">
                  {ann.link ? (
                    <a href={ann.link} className="hover:underline">{ann.text}</a>
                  ) : (
                    <span>{ann.text}</span>
                  )}
                </span>
              ))}
            </div>
            <div className="inline-flex">
              {activeAnnouncements.map((ann, i) => (
                <span key={`b-${i}`} className="mx-8 font-medium shrink-0">
                  {ann.link ? (
                    <a href={ann.link} className="hover:underline">{ann.text}</a>
                  ) : (
                    <span>{ann.text}</span>
                  )}
                </span>
              ))}
            </div>
            <div className="inline-flex">
              {activeAnnouncements.map((ann, i) => (
                <span key={`c-${i}`} className="mx-8 font-medium shrink-0">
                  {ann.link ? (
                    <a href={ann.link} className="hover:underline">{ann.text}</a>
                  ) : (
                    <span>{ann.text}</span>
                  )}
                </span>
              ))}
            </div>
            <div className="inline-flex">
              {activeAnnouncements.map((ann, i) => (
                <span key={`d-${i}`} className="mx-8 font-medium shrink-0">
                  {ann.link ? (
                    <a href={ann.link} className="hover:underline">{ann.text}</a>
                  ) : (
                    <span>{ann.text}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 pb-8 md:pt-20 md:pb-12 flex items-center justify-center overflow-hidden bg-white">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/temple_hero.jpg" 
            alt="Temple Background" 
            className="w-full h-full object-cover opacity-45 filter brightness-50 contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[#C5A059] font-bold tracking-[0.2em] uppercase mb-4 text-xs md:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
              ยินดีต้อนรับ สาธุชนทุกท่าน
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-white font-light leading-tight mb-4 whitespace-nowrap drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
              วัดดอนสว่างธรรมเจริญศรัทธา
            </h1>
            <p className="text-sm md:text-base text-white/95 mb-6 max-w-2xl mx-auto font-normal text-balance drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              ขอเชิญพุทธศาสนิกชนร่วมทำบุญและปฏิบัติธรรมในบรรยากาศ<br className="hidden md:block"/>ที่โอบล้อมด้วยธรรมชาติ ณ วัดดอนสว่างธรรมเจริญศรัทธา
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/about"
                className="px-8 py-3 bg-[#715D43]/90 hover:bg-[#5E4C36] text-white rounded-full font-medium text-sm transition-all shadow-lg w-full sm:w-auto text-center backdrop-blur-sm border border-white/10"
              >
                ประวัติวัด
              </Link>
              <Link 
                to="/donate"
                className="px-8 py-3 bg-white/90 hover:bg-white text-[#715D43] rounded-full font-medium text-sm transition-all shadow-lg w-full sm:w-auto text-center backdrop-blur-sm border border-white/20"
              >
                ร่วมทำบุญ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick News & Events */}
      <section className="pt-4 pb-16 md:pt-6 md:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-semibold text-accent-deep">ข่าวสาร & กิจกรรม</h2>
              <div className="w-16 h-1 bg-accent-gold mt-4"></div>
            </div>
            <Link to="/news" className="hidden md:flex items-center text-xs text-accent-brown underline underline-offset-4 transition-colors">
              ดูทั้งหมด
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* News Column */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-accent-deep flex items-center">
                <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block mr-2"></span>
                ข่าวสารล่าสุด
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentNews.length > 0 ? recentNews.slice(0, 2).map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                    }}
                    className="bg-white rounded-2xl overflow-hidden luxury-shadow border border-gray-50 transition-shadow group flex flex-col cursor-pointer"
                  >
                    <div className="aspect-[16/10] bg-stone-200 relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-accent-deep/50 to-transparent z-10" />
                      {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                      <span className="absolute bottom-4 left-4 z-20 text-[10px] font-bold bg-accent-gold text-white px-2 py-1 rounded-full uppercase tracking-wider">
                        {item.category || 'ข่าวสาร'}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-text-main mb-2 line-clamp-2 group-hover:text-accent-gold transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[10px] opacity-50 mt-4 block">
                        {formatThaiDate(item.date)}
                      </span>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-10 text-stone-500 col-span-2">ไม่มีข่าวสารในขณะนี้</div>
                )}
              </div>
            </div>

            {/* Activities Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-accent-deep flex items-center">
                <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block mr-2"></span>
                กิจกรรมและกำหนดการธรรมะ
              </h3>
              <div className="space-y-4">
                {recentActivities.length > 0 ? recentActivities.map((item, index) => {
                  const { day, month } = getShortThaiDateParts(item.date);
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                      className="bg-white rounded-2xl p-4 border border-sep hover:border-accent-gold/30 transition-all flex items-center gap-4 luxury-shadow group cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center bg-stone-50 border border-stone-200/80 rounded-xl w-14 h-14 shrink-0 overflow-hidden shadow-sm transition-all duration-300">
                        <div className="bg-accent-gold w-full text-center py-0.5 text-[8px] font-bold text-white uppercase tracking-wider">
                          {month}
                        </div>
                        <div className="flex-1 flex items-center justify-center w-full bg-white">
                          <span className="text-base font-serif font-extrabold text-accent-deep leading-none">{day}</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-accent-gold uppercase tracking-wider block mb-0.5">
                          {item.type || 'กิจกรรม'}
                        </span>
                        <h4 className="text-xs font-bold text-accent-deep truncate group-hover:text-accent-brown transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-[10px] opacity-50 block mt-0.5">
                          เวลา {item.time ? `${item.time} น.` : 'ตลอดวัน'}
                        </span>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className="text-stone-500 py-10 text-center">ไม่มีกิจกรรมในขณะนี้</div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link to="/news" className="inline-flex items-center text-xs text-accent-brown underline underline-offset-4">
              ดูทั้งหมด
            </Link>
          </div>

          {/* Details Modal */}
          <DetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={selectedItem}
          />
        </div>
      </section>

      {/* Popups */}
      <AnimatePresence>
        {showPopup && activePopups.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden luxury-shadow relative"
            >
              <button 
                onClick={handleDismissPopup}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {activePopups[0].image && (
                <div className="w-full bg-white flex items-center justify-center overflow-hidden pt-4 px-4">
                  <img 
                    src={activePopups[0].image} 
                    alt={activePopups[0].title} 
                    className="max-w-full max-h-[50vh] w-auto h-auto object-contain rounded-2xl" 
                  />
                </div>
              )}
              
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-accent-deep mb-4">{activePopups[0].title}</h3>
                <p className="text-stone-600 text-sm mb-6 whitespace-pre-line leading-relaxed">
                  {activePopups[0].content}
                </p>
                <button 
                  onClick={handleDismissPopup}
                  className="px-8 py-3 bg-accent-deep text-white rounded-full font-medium text-sm hover:bg-stone-800 transition-colors"
                >
                  รับทราบ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
