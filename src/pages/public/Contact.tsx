import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

export default function Contact() {
  const { settings = [], addItem } = useStore();
  const siteEmail = (settings || []).find(s => s.key === 'Contact Email')?.value || 'weeratheroofficial@gmail.com';
  const sitePhone = (settings || []).find(s => s.key === 'Contact Phone')?.value || '02-xxx-xxxx';
  const siteAddress = (settings || []).find(s => s.key === 'Temple Address')?.value || 'วัดดอนสว่างธรรมเจริญศรัทธา\nหมู่ 5 ตำบลเชียงใหม่\nอำเภอโพธิ์ชัย จังหวัดร้อยเอ็ด 45230';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [subject, setSubject] = useState('general');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const nameVal = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const phoneVal = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
    const messageVal = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();
    
    const newErrors: typeof errors = {};
    if (!nameVal) {
      newErrors.name = 'กรุณาระบุชื่อ-นามสกุลของท่าน';
    }
    if (!phoneVal) {
      newErrors.phone = 'กรุณาระบุเบอร์โทรศัพท์ติดต่อ';
    }
    if (!messageVal) {
      newErrors.message = 'กรุณาระบุข้อความที่ต้องการติดต่อ';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    const message = {
      id: Date.now(),
      name: nameVal,
      phone: phoneVal,
      email: (form.elements.namedItem('email') as HTMLInputElement)?.value || '',
      subject: subject,
      message: messageVal,
      date: new Date().toISOString(),
      status: 'unread'
    };

    // Simulate API call
    setTimeout(() => {
      addItem('contactMessages', message);
      setIsSubmitting(false);
      setIsSuccess(true);
      form.reset();
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };

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
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">ติดต่อเรา</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            สอบถามข้อมูลเพิ่มเติม หรือแจ้งความประสงค์ร่วมกิจกรรมต่างๆ
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-accent-deep mb-6">ข้อมูลการติดต่อ</h2>
                <p className="text-stone-600 mb-8">
                  ท่านสามารถติดต่อสอบถามข้อมูลต่างๆ ของทางวัดได้ตามช่องทางด้านล่างนี้ หรือส่งข้อความผ่านแบบฟอร์ม ทางวัดจะรีบดำเนินการตอบกลับโดยเร็วที่สุด
                </p>

                <div className="space-y-6">
                  <div className="flex items-start p-6 bg-white rounded-2xl border border-sep luxury-shadow">
                    <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center shrink-0 mr-4">
                      <MapPin className="w-6 h-6 text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-accent-deep">ที่อยู่</h3>
                      <p className="text-stone-600 text-sm whitespace-pre-line leading-tight">
                        {siteAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-6 bg-white rounded-2xl border border-sep luxury-shadow">
                    <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center shrink-0 mr-4">
                      <Phone className="w-6 h-6 text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-accent-deep">โทรศัพท์</h3>
                      <p className="text-stone-600 text-sm leading-tight">{sitePhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start p-6 bg-white rounded-2xl border border-sep luxury-shadow">
                    <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center shrink-0 mr-4">
                      <Mail className="w-6 h-6 text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-accent-deep">อีเมล</h3>
                      <p className="text-stone-600 text-sm leading-tight">{siteEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Simulation / Interactive Map */}
              <div className="bg-white rounded-3xl overflow-hidden luxury-shadow border border-sep p-4">
                <h3 className="text-xl font-bold text-accent-deep mb-4 px-2">แผนที่วัดดอนสว่างธรรมเจริญศรัทธา</h3>
                <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-stone-100">
                  <iframe 
                    src="https://maps.google.com/maps?q=วัดดอนสว่างธรรมเจริญศรัทธา%20ร้อยเอ็ด&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 md:p-10 luxury-shadow border border-sep">
              <h3 className="text-2xl font-bold text-accent-deep mb-6">ส่งข้อความถึงเรา</h3>
              
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 text-green-800 p-6 rounded-2xl text-center border border-green-200"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">ส่งข้อความสำเร็จ</h4>
                  <p className="text-sm">ขอบคุณสำหรับการติดต่อ ทางเราได้รับข้อความของท่านแล้ว</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div id="name" className="scroll-mt-24">
                    <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">ชื่อ-นามสกุล</label>
                    <input 
                      type="text" 
                      id="nameInput" 
                      name="name"
                      onChange={() => {
                        if (errors.name) {
                          setErrors(prev => ({ ...prev, name: undefined }));
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold bg-stone-50 transition-all ${
                        errors.name ? 'border-red-300 ring-2 ring-red-500/20 bg-red-50/10' : 'border-stone-200'
                      }`}
                      placeholder="ระบุชื่อของท่าน"
                    />
                    {errors.name && (
                      <span className="text-xs text-red-600 font-bold block mt-1">{errors.name}</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div id="phone" className="scroll-mt-24">
                      <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">เบอร์โทรศัพท์</label>
                      <input 
                        type="tel" 
                        id="phoneInput" 
                        name="phone"
                        onChange={() => {
                          if (errors.phone) {
                            setErrors(prev => ({ ...prev, phone: undefined }));
                          }
                        }}
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold bg-stone-50 transition-all ${
                          errors.phone ? 'border-red-300 ring-2 ring-red-500/20 bg-red-50/10' : 'border-stone-200'
                        }`}
                        placeholder="ระบุเบอร์โทรศัพท์"
                      />
                      {errors.phone && (
                        <span className="text-xs text-red-600 font-bold block mt-1">{errors.phone}</span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">อีเมล (ถ้ามี)</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold bg-stone-50"
                        placeholder="ระบุอีเมล"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">เรื่องที่ติดต่อ</label>
                    <input type="hidden" id="subject" value={subject} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { value: 'general', label: 'สอบถามทั่วไป', emoji: '💬' },
                        { value: 'activity', label: 'ร่วมกิจกรรม', emoji: '📅' },
                        { value: 'donate', label: 'การบริจาค', emoji: '🎗️' },
                        { value: 'other', label: 'อื่นๆ', emoji: '✏️' },
                      ].map((item) => {
                        const isSelected = subject === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setSubject(item.value)}
                            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                              isSelected
                                ? 'bg-[#1B3022] border-[#1B3022] text-white shadow-md scale-[1.02]'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-stone-300'
                            }`}
                          >
                            <span className="text-xl">{item.emoji}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div id="message" className="scroll-mt-24">
                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">ข้อความ</label>
                    <textarea 
                      id="messageInput" 
                      name="message"
                      rows={4}
                      onChange={() => {
                        if (errors.message) {
                          setErrors(prev => ({ ...prev, message: undefined }));
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold bg-stone-50 resize-none transition-all ${
                        errors.message ? 'border-red-300 ring-2 ring-red-500/20 bg-red-50/10' : 'border-stone-200'
                      }`}
                      placeholder="พิมพ์ข้อความของท่านที่นี่..."
                    ></textarea>
                    {errors.message && (
                      <span className="text-xs text-red-600 font-bold block mt-1">{errors.message}</span>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent-deep hover:bg-stone-800 text-white rounded-xl font-bold uppercase tracking-wider transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> ส่งข้อความ
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
