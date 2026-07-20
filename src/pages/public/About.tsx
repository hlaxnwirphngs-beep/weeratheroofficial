import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';

export default function About() {
  const { abbots = [] } = useStore();

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
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">ประวัติและข้อมูลวัด</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            ประวัติความเป็นมาและข้อมูลการติดต่อวัดดอนสว่างธรรมเจริญศรัทธา
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 md:p-12 luxury-shadow border border-sep mb-12">
            <h2 className="text-2xl font-bold text-accent-deep mb-6 text-center">ประวัติความเป็นมา</h2>
            <div className="prose prose-stone max-w-none text-stone-600 space-y-4">
              <p>
                วัดดอนสว่างธรรมเจริญศรัทธา ตั้งอยู่ที่ หมู่ 5 ตำบลเชียงใหม่ อำเภอโพธิ์ชัย จังหวัดร้อยเอ็ด เป็นสถานที่ซึ่งพุทธศาสนิกชนในพื้นที่และใกล้เคียงให้ความเคารพศรัทธา เป็นศูนย์รวมจิตใจในการประกอบกิจกรรมทางพระพุทธศาสนาและงานบุญประเพณีต่างๆ
              </p>
              <p>
                สถานที่แห่งนี้เป็นเพียงที่พักสงฆ์เล็กๆ ด้วยความศรัทธาของชาวบ้านในชุมชน ได้ร่วมแรงร่วมใจกันบริจาคสร้างวัดให้สมบูรณ์ โดยมุ่งหวังให้เป็นสถานที่สำหรับปฏิบัติธรรม เจริญสติภาวนา และเป็นแหล่งเรียนรู้ทางด้านคุณธรรมจริยธรรมของเยาวชน
              </p>
              <p>
                ปัจจุบัน วัดดอนสว่างธรรมเจริญศรัทธา ได้มีการพัฒนาและปรับปรุงภูมิทัศน์ให้มีความร่มรื่น สงบเงียบ เหมาะแก่การปลีกวิเวกและปฏิบัติธรรม มีการจัดกิจกรรมบรรพชาสามเณรภาคฤดูร้อน และบวชเนกขัมมะเป็นประจำทุกปี เพื่อสืบทอดอายุพระพุทธศาสนาให้ยั่งยืนสืบไป
              </p>
            </div>
          </div>

          {abbots.length > 0 && (
            <div className="bg-white rounded-3xl p-8 md:p-12 luxury-shadow border border-sep">
              <h2 className="text-2xl font-bold text-accent-deep mb-8 text-center">ทำเนียบเจ้าอาวาส</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {abbots.map((abbot) => (
                  <div key={abbot.id} className="flex flex-col items-center text-center p-6 bg-stone-50 rounded-2xl border border-stone-100">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-stone-200 border-4 border-white luxury-shadow">
                      {abbot.image ? (
                        <img src={abbot.image} alt={abbot.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">ไม่มีรูปภาพ</div>
                      )}
                    </div>
                    <h3 className="font-bold text-accent-deep mb-1">{abbot.name}</h3>
                    <p className="text-sm text-stone-500 mb-1">{abbot.position}</p>
                    <p className="text-xs text-stone-400 font-medium">วาระ: {abbot.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
