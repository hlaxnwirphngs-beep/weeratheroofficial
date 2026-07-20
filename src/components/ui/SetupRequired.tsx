import { AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function SetupRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-stone-100"
      >
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif text-stone-900 mb-4">
          รอการเชื่อมต่อฐานข้อมูล
        </h2>
        <p className="text-stone-600 mb-8 leading-relaxed">
          เว็บไซต์นี้ใช้สถาปัตยกรรม <strong>Supabase</strong> (Database, Storage, Auth) แบบ Single Backend ตามข้อกำหนด Enterprise Grade<br/><br/>
          กรุณาเพิ่ม <code>VITE_SUPABASE_URL</code> และ <code>VITE_SUPABASE_ANON_KEY</code> ในเมนู Settings (Secrets) เพื่อเปิดใช้งานระบบ
        </p>
      </motion.div>
    </div>
  );
}
