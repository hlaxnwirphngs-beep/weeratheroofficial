import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  {
    category: 'การเข้าชมวัดและปฏิบัติธรรม',
    question: 'วัดดอนสว่างธรรมเจริญศรัทธา เปิด-ปิดกี่โมง?',
    answer: 'วัดเปิดให้พุทธศาสนิกชนและประชาชนทั่วไปเข้าเยี่ยมชม สักการะ และปฏิบัติธรรมได้ทุกวัน ตั้งแต่เวลา 05:00 น. ถึง 20:00 น. สำหรับพื้นที่ปฏิบัติธรรมกรุณาติดต่อเจ้าหน้าที่ล่วงหน้าเพื่อความสงบเรียบร้อย'
  },
  {
    category: 'การเข้าชมวัดและปฏิบัติธรรม',
    question: 'หากต้องการเดินทางมาปฏิบัติธรรมค้างคืน ต้องดำเนินการอย่างไร?',
    answer: 'ผู้มีความประสงค์จะปฏิบัติธรรมค้างคืน (บวชชีพราหมณ์/เนกขัมมะ) กรุณาติดต่อเจ้าอาวาสล่วงหน้า อย่างน้อย 3 วัน โดยนำบัตรประชาชนตัวจริงมาแสดง พร้อมเตรียมชุดปฏิบัติธรรมสีขาวสุภาพเรียบร้อยและของใช้ส่วนตัวที่จำเป็น'
  },
  {
    category: 'การเข้าชมวัดและปฏิบัติธรรม',
    question: 'การแต่งกายที่เหมาะสมในการมาวัดคืออย่างไร?',
    answer: 'กรุณาแต่งกายด้วยชุดสุภาพเรียบร้อย มิดชิด งดเว้นเสื้อสายเดี่ยว เสื้อแขนกุด กางเกงขาสั้นเหนือเข่า หรือกระโปรงสั้น เพื่อเป็นการแสดงความเคารพต่อศาสนสถาน'
  },
  {
    category: 'การทำบุญและบริจาค',
    question: 'ช่องทางการร่วมทำบุญออนไลน์ปลอดภัยหรือไม่?',
    answer: 'การทำบุญออนไลน์ผ่านทางเว็บไซต์ของวัดใช้การสแกน QR Code (Thai QR Payment) ของบัญชีเงินฝากในนามวัดโดยตรง เงินทำบุญจะเข้าสู่บัญชีของทางวัดทันที ปลอดภัยและโปร่งใสสูงสุด'
  },
  {
    category: 'การทำบุญและบริจาค',
    question: 'สามารถขอใบอนุโมทนาบัตรเพื่อลดหย่อนภาษีได้ทางใดบ้าง?',
    answer: 'หลังจากโอนเงินทำบุญแล้ว ท่านสามารถส่งสลิปหลักฐานการโอนเงิน พร้อมชื่อ-นามสกุล และเลขประจำตัวผู้เสียภาษี (ถ้ามี) ผ่านหน้าระบบ "ช่องทางการร่วมทำบุญ" บนเว็บไซต์ หรือติดต่อเจ้าหน้าที่ทางกล่องข้อความเพจวัด เพื่อให้ออกใบอนุโมทนาบัตรอิเล็กทรอนิกส์หรือจัดส่งทางไปรษณีย์'
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('ทั้งหมด');

  const categories = ['ทั้งหมด', ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFaq = activeTab === 'ทั้งหมด' 
    ? faqData 
    : faqData.filter(item => item.category === activeTab);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/10 text-accent-gold mb-4"
          >
            <HelpCircle className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-serif text-accent-deep font-bold mb-4"
          >
            คำถามที่พบบ่อย (FAQ)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-stone-600 max-w-xl mx-auto"
          >
            รวบรวมข้อสงสัยและคำแนะนำเบื้องต้นสำหรับการเยี่ยมชม ทำบุญ และปฏิบัติธรรม ณ วัดดอนสว่างธรรมเจริญศรัทธา
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveTab(cat); setOpenIndex(null); }}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === cat 
                  ? 'bg-accent-gold text-white shadow-md shadow-accent-gold/20' 
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion Container */}
        <motion.div 
          layout="position"
          transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="space-y-4 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm"
        >
          {filteredFaq.length > 0 ? (
            filteredFaq.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`border-b border-stone-100 last:border-0 pb-4 last:pb-0 pt-4 first:pt-0 transition-colors`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left py-2 hover:text-accent-gold transition-colors group"
                  >
                    <span className="font-medium text-stone-800 text-sm md:text-base pr-4 group-hover:text-accent-gold transition-colors">
                      {item.question}
                    </span>
                    <span className="text-stone-400 shrink-0">
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <ChevronDown className="w-5 h-5 text-stone-400 group-hover:text-accent-gold transition-colors" />
                      </motion.div>
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 text-xs md:text-sm text-stone-600 leading-relaxed pl-1 pb-2">
                          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100/80 mt-1">
                            {item.answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-stone-400">ไม่พบคำถามที่ท่านต้องการค้นหา</div>
          )}
        </motion.div>

        {/* Support Callout */}
        <div className="mt-12 text-center bg-accent-gold/5 border border-accent-gold/20 rounded-2xl p-6">
          <p className="text-stone-700 text-sm mb-2 font-medium">ยังไม่พบคำถามที่ต้องการใช่หรือไม่?</p>
          <p className="text-stone-500 text-xs mb-4">ท่านสามารถสอบถามข้อมูลเพิ่มเติมผ่านช่องทางติดต่อหรือเบอร์โทรศัพท์ของวัดได้โดยตรง</p>
          <a 
            href="/contact" 
            className="inline-flex items-center text-xs font-semibold text-accent-gold hover:text-accent-brown transition-colors"
          >
            ไปที่หน้าติดต่อวัดดอนสว่างธรรมเจริญศรัทธา &rarr;
          </a>
        </div>

      </div>
    </div>
  );
}
