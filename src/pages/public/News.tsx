import { motion } from 'motion/react';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatThaiDate, getShortThaiDateParts } from '../../utils/date';
import DetailModal from '../../components/ui/DetailModal';

export default function News() {
  const { news = [], activities = [] } = useStore();
  const [activeTab, setActiveTab] = useState<'news' | 'activities'>('news');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for filtering
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('ทั้งหมด');
  const [selectedActivityType, setSelectedActivityType] = useState<string>('ทั้งหมด');

  // Extract distinct categories/types
  const newsCategories = Array.from(new Set(news.map(item => item.category || 'ข่าวสาร').filter(Boolean)));
  const activityTypes = Array.from(new Set(activities.map(item => item.type || 'กิจกรรมทั่วไป').filter(Boolean)));

  // Filter lists based on selection
  const filteredNews = (selectedNewsCategory === 'ทั้งหมด'
    ? news
    : news.filter(item => (item.category || 'ข่าวสาร') === selectedNewsCategory)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredActivities = (selectedActivityType === 'ทั้งหมด'
    ? activities
    : activities.filter(item => (item.type || 'กิจกรรมทั่วไป') === selectedActivityType)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">ข่าวสารและกิจกรรม</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            ติดตามข่าวสาร กิจกรรม และงานบุญต่างๆ ของทางวัดดอนสว่างธรรมเจริญศรัทธา
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12 border-b border-stone-200">
            <button
              onClick={() => setActiveTab('news')}
              className={`pb-4 px-6 font-serif font-semibold text-base md:text-lg transition-all border-b-2 ${
                activeTab === 'news'
                  ? 'border-accent-gold text-accent-deep'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              ข่าวสารประชาสัมพันธ์
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`pb-4 px-6 font-serif font-semibold text-base md:text-lg transition-all border-b-2 ${
                activeTab === 'activities'
                  ? 'border-accent-gold text-accent-deep'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              ปฏิทินกิจกรรม<br />และงานบุญ
            </button>
          </div>

          {activeTab === 'news' ? (
            news.length === 0 ? (
              <div className="text-center py-20 text-stone-500">
                ไม่มีข่าวสารในขณะนี้
              </div>
            ) : (
              <>
                {/* News Category Filter Buttons if more than 1 category */}
                {newsCategories.length >= 1 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-10">
                    <button
                      onClick={() => setSelectedNewsCategory('ทั้งหมด')}
                      className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 border cursor-pointer ${
                        selectedNewsCategory === 'ทั้งหมด'
                          ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-sm'
                          : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
                      }`}
                    >
                      ทั้งหมด
                    </button>
                    {newsCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedNewsCategory(cat)}
                        className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 border cursor-pointer ${
                          selectedNewsCategory === cat
                            ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-sm'
                            : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {filteredNews.length === 0 ? (
                  <div className="text-center py-20 text-stone-500 bg-white rounded-2xl border border-stone-100 p-8 max-w-md mx-auto luxury-shadow">
                    ไม่มีข่าวสารในหมวดหมู่นี้
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNews.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => {
                          setSelectedItem(item);
                          setIsModalOpen(true);
                        }}
                        className="bg-white rounded-2xl overflow-hidden luxury-shadow border border-sep group cursor-pointer flex flex-col"
                      >
                        <div className="h-48 bg-stone-200 w-full overflow-hidden relative shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                          {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                          <span className="absolute bottom-4 left-4 z-20 text-xs font-bold bg-accent-gold text-white px-3 py-1 rounded-full uppercase tracking-wider">
                            {item.category || 'ข่าวสาร'}
                          </span>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center text-xs text-stone-500 mb-3 font-medium">
                            <Calendar className="w-4 h-4 mr-2 text-accent-gold" />
                            {formatThaiDate(item.date)}
                          </div>
                          <h3 className="text-lg font-bold text-accent-deep mb-3 line-clamp-2 group-hover:text-accent-brown transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-stone-600 text-sm mb-6 line-clamp-3 flex-1">
                            {item.excerpt}
                          </p>
                          <span className="inline-flex items-center text-sm font-bold text-accent-brown uppercase tracking-wider group-hover:text-accent-gold transition-colors mt-auto">
                            อ่านเพิ่มเติม <ChevronRight className="w-4 h-4 ml-1" />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )
          ) : (
            activities.length === 0 ? (
              <div className="text-center py-20 text-stone-500">
                ไม่มีกิจกรรมหรือกำหนดการในขณะนี้
              </div>
            ) : (
              <>
                {/* Activity Type Filter Buttons if more than 1 type */}
                {activityTypes.length >= 1 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-10">
                    <button
                      onClick={() => setSelectedActivityType('ทั้งหมด')}
                      className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 border cursor-pointer ${
                        selectedActivityType === 'ทั้งหมด'
                          ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-sm'
                          : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
                      }`}
                    >
                      ทั้งหมด
                    </button>
                    {activityTypes.map(type => {
                      const isPractice = type === 'ปฏิบัติธรรม';
                      const isTradition = type === 'งานบุญประเพณี';
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedActivityType(type)}
                          className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 border cursor-pointer ${
                            selectedActivityType === type
                              ? isPractice 
                                ? 'bg-[#10B981]/15 text-emerald-800 border-emerald-300/50 shadow-xs'
                                : isTradition
                                ? 'bg-amber-600/15 text-amber-800 border-amber-300/50 shadow-xs'
                                : 'bg-[#1B3022] text-white border-[#1B3022] shadow-xs'
                              : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                )}

                {filteredActivities.length === 0 ? (
                  <div className="text-center py-20 text-stone-500 bg-white rounded-2xl border border-stone-100 p-8 max-w-md mx-auto luxury-shadow">
                    ไม่มีกิจกรรมในประเภทนี้
                  </div>
                ) : (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    {filteredActivities.map((item, i) => {
                      const { day, month } = getShortThaiDateParts(item.date);
                      const isPractice = item.type === 'ปฏิบัติธรรม';
                      const isTradition = item.type === 'งานบุญประเพณี';
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => {
                            setSelectedItem(item);
                            setIsModalOpen(true);
                          }}
                          className="bg-white rounded-3xl p-6 border border-stone-200/60 hover:border-accent-gold/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-6 luxury-shadow group cursor-pointer relative overflow-hidden"
                        >
                          {/* Left elegant gold line accent visible on hover */}
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

                          {/* Date Badge */}
                          <div className="flex flex-col items-center justify-center bg-stone-50 border border-stone-200/80 rounded-2xl w-24 h-24 shrink-0 overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-accent-gold/30">
                            <div className="bg-accent-gold w-full text-center py-1.5 text-xs font-bold text-white uppercase tracking-widest">
                              {month}
                            </div>
                            <div className="flex-1 flex items-center justify-center w-full bg-white">
                              <span className="text-3xl font-serif font-black text-accent-deep leading-none group-hover:scale-110 transition-transform duration-300">{day}</span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 sm:pl-2">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                isPractice 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100/80' 
                                  : isTradition
                                  ? 'bg-amber-50 text-amber-800 border-amber-100/80'
                                  : 'bg-stone-50 text-stone-700 border-stone-100'
                              }`}>
                                {item.type || 'กิจกรรมทั่วไป'}
                              </span>
                              <span className="inline-flex items-center text-xs text-stone-500 font-medium bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-100">
                                <Clock className="w-3.5 h-3.5 mr-1.5 text-accent-gold shrink-0" />
                                เวลา {item.time ? `${item.time} น.` : 'ตลอดวัน'}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-accent-deep group-hover:text-accent-brown transition-colors leading-snug">
                              {item.name}
                            </h3>
                            <p className="text-stone-500 text-xs mt-2 flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                              วันที่ {formatThaiDate(item.date)}
                            </p>
                          </div>

                          {/* Elegant Interactive indicator */}
                          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-stone-50 border border-stone-100 text-stone-400 group-hover:bg-accent-gold group-hover:text-white group-hover:border-transparent transition-all duration-300 shrink-0">
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </>
            )
          )}

          {/* Details Modal */}
          <DetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={selectedItem}
          />

        </div>
      </section>
    </div>
  );
}
