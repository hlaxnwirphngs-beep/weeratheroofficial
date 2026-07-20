import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Phone, Mail, CheckCircle, Save } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactInfoManager() {
  const { settings = [], updateItem, addItem } = useStore();
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Load initial settings
  useEffect(() => {
    const emailObj = settings.find(s => s.key === 'Contact Email');
    const phoneObj = settings.find(s => s.key === 'Contact Phone');

    if (emailObj) setContactEmail(emailObj.value);
    if (phoneObj) setContactPhone(phoneObj.value);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Helper to find or create setting ID
    const saveSetting = (key: string, value: string, defaultId: number) => {
      const existing = settings.find(s => s.key === key);
      if (existing) {
        updateItem('settings', { id: existing.id, key, value });
      } else {
        addItem('settings', { id: defaultId, key, value });
      }
    };

    saveSetting('Contact Email', contactEmail, 2);
    saveSetting('Contact Phone', contactPhone, 3);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1B3022]">จัดการข้อมูลติดต่อ</h1>
        <p className="text-stone-500 text-sm mt-1">
          แก้ไขเบอร์โทรศัพท์และอีเมลของวัดที่แสดงในหน้าเว็บส่วนรวม
        </p>
      </div>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 shadow-xs"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">บันทึกข้อมูลการติดต่อเรียบร้อยแล้ว! ข้อมูลจะถูกอัปเดตทั่วทั้งเว็บไซต์ทันที</span>
        </motion.div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-stone-200/60 luxury-shadow p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">

          {/* Contact Phone */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C5A059]" />
              เบอร์โทรศัพท์ติดต่อ
            </label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              placeholder="เช่น 02-xxx-xxxx หรือ 08X-XXX-XXXX"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] bg-stone-50/50 text-stone-800 font-medium transition-all"
            />
            <span className="text-[11px] text-stone-400 block">ระบุเบอร์โทรศัพท์สำหรับให้ญาติโยมติดต่อสอบถาม</span>
          </div>

          {/* Contact Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C5A059]" />
              อีเมลติดต่อ
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              placeholder="เช่น weeratheroofficial@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] bg-stone-50/50 text-stone-800 font-medium transition-all"
            />
            <span className="text-[11px] text-stone-400 block">อีเมลส่วนกลางของทางวัดสำหรับรับข่าวสาร</span>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#1B3022] hover:bg-[#2C4A35] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              บันทึกการตั้งค่าติดต่อ
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
