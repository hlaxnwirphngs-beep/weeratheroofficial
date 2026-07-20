cat << 'INNER_EOF' > src/pages/public/Home.tsx
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Calendar, ChevronRight, MapPin, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useState, useEffect } from 'react';

export default function Home() {
  const { news, popups, announcements } = useStore();
  const [showPopup, setShowPopup] = useState(false);

  const activePopups = popups.filter(p => p.status === 'Active');
  const activeAnnouncements = announcements.filter(a => a.status === 'Active');

  useEffect(() => {
    if (activePopups.length > 0) {
      setShowPopup(true);
    }
  }, [popups]);

  const recentNews = news.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Marquee Announcements */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-accent-gold text-white text-xs py-2 overflow-hidden relative z-40 mt-20 border-b border-white/20">
          <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] inline-block">
            {activeAnnouncements.map((ann, i) => (
              <span key={i} className="mx-8 font-medium">
                {ann.link ? (
                  <a href={ann.link} className="hover:underline">{ann.text}</a>
                ) : (
                  <span>{ann.text}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className={`relative pb-24 md:py-32 flex items-center justify-center overflow-hidden bg-[#7C8577] ${activeAnnouncements.length > 0 ? 'pt-24' : 'pt-32'}`}>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[#C5A059] font-bold tracking-[0.2em] uppercase mb-6 text-xs md:text-sm">
              FEATURED
            </h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-light leading-tight mb-6 text-balance">
              จิตวิญญาณแห่งธรรม สู่<br className="hidden md:block"/>ความสงบอันเป็นนิรันดร์
            </h1>
            <p className="text-sm md:text-base text-white/90 mb-10 max-w-2xl mx-auto font-light text-balance">
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
      <section className="py-20 bg-white">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.length > 0 ? recentNews.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden luxury-shadow border border-gray-50 transition-shadow group flex flex-col"
              >
                <div className="aspect-[4/3] bg-stone-200 relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-deep/50 to-transparent z-10" />
                  <span className="absolute bottom-4 left-4 z-20 text-[10px] font-bold bg-accent-gold text-white px-2 py-1 rounded-full uppercase tracking-wider">
                    {item.category || 'ข่าวสาร'}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-text-main mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-[10px] opacity-50 mt-4 block">
                    {item.date || '-'}
                  </span>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-3 text-center py-10 text-stone-500">ไม่มีข่าวสารในขณะนี้</div>
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/news" className="inline-flex items-center text-xs text-accent-brown underline underline-offset-4">
              ดูทั้งหมด
            </Link>
          </div>
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden luxury-shadow relative"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {activePopups[0].image && (
                <div className="w-full h-48 bg-stone-100">
                  <img src={activePopups[0].image} alt={activePopups[0].title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-accent-deep mb-4">{activePopups[0].title}</h3>
                <p className="text-stone-600 text-sm mb-6 whitespace-pre-line leading-relaxed">
                  {activePopups[0].content}
                </p>
                <button 
                  onClick={() => setShowPopup(false)}
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
INNER_EOF
