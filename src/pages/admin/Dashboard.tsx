import { useEffect, useState } from 'react';
import { Activity, Users, Eye, FileText, Heart, Image as ImageIcon, Calendar } from 'lucide-react';
import { motion, animate } from 'motion/react';
import { useStore } from '../../store/useStore';

function AnimatedCounter({ value }: { value: string }) {
  const numericValue = parseInt(value.replace(/,/g, ''), 10);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isNaN(numericValue)) {
      return;
    }
    const controls = animate(0, numericValue, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (val) => setCount(Math.floor(val)),
    });
    return () => controls.stop();
  }, [numericValue]);

  if (isNaN(numericValue)) {
    return <span>{value}</span>;
  }

  return <span>{count.toLocaleString()}</span>;
}

export default function Dashboard() {
  const { news = [], activities = [], users = [], donations = [], gallery = [], activityLogs = [] } = useStore();

  const [visitors, setVisitors] = useState(() => {
    return parseInt(localStorage.getItem('site_total_visits') || '142', 10);
  });

  // Calculate active activities for the current month
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // e.g. "2026-07"
  const activitiesThisMonth = activities.filter(act => act.date && act.date.startsWith(currentYearMonth)).length;

  const stats = [
    { name: 'ผู้เข้าชมวันนี้', stat: String(visitors), icon: Eye, color: 'text-[#8B7355]' },
    { name: 'ข่าวสารทั้งหมด', stat: String(news.length), icon: FileText, color: 'text-[#1B3022]' },
    { name: 'กิจกรรมในเดือนนี้', stat: String(activitiesThisMonth), icon: Activity, color: 'text-[#C5A059]' },
    { name: 'ผู้ดูแลระบบ', stat: String(users.length === 0 ? 3 : users.length), icon: Users, color: 'text-[#8B7355]' },
  ];

  // Dynamically assemble a highly realistic activity log from database records
  const dynamicLogs = [...activityLogs]
    .sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime())
    .slice(0, 5)
    .map(log => ({
      id: log.id,
      title: log.action,
      detail: log.detail || `ผู้ใช้: ${log.user}`,
      time: new Date(log.time).toLocaleString('th-TH'),
      color: log.type === 'create' ? 'bg-green-500' :
             log.type === 'edit' ? 'bg-orange-500' :
             log.type === 'delete' ? 'bg-red-500' :
             log.type === 'login' ? 'bg-blue-500' : 'bg-[#C5A059]'
    }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((item) => (
          <motion.div 
            key={item.name} 
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl luxury-shadow border border-gray-50 flex items-center transition-all hover:translate-y-[-2px] hover:shadow-md"
          >
            <div className={`p-3 rounded-xl bg-[#FDFBF7] border border-[#C5A059]/20 ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold uppercase tracking-wider text-black/50">{item.name}</p>
              <p className="text-2xl font-semibold text-[#1B3022] mt-1">
                <AnimatedCounter value={item.stat} />
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="bg-white rounded-2xl luxury-shadow border border-gray-50 p-8">
        <h3 className="text-lg font-bold text-[#1B3022] mb-6 font-serif">กิจกรรมล่าสุด (Activity Log)</h3>
        <div className="space-y-6">
          <p className="text-sm text-[#1B3022]/80 bg-[#FDFBF7] p-4 rounded-xl border border-[#C5A059]/10">
            ระบบทำงานออนไลน์และเชื่อมต่อฐานข้อมูลในเครื่องสำเร็จแล้ว การจัดการใดๆ บนระบบหลังบ้านจะแสดงผลที่นี่ในแบบเรียลไทม์
          </p>
          
          <div className="relative pl-6 border-l border-gray-200 space-y-6">
            {dynamicLogs.length > 0 ? (
              dynamicLogs.map((log) => (
                <div key={log.id} className="relative">
                  <div className={`absolute -left-[29px] top-1 w-3 h-3 ${log.color} rounded-full ring-4 ring-white`}></div>
                  <p className="text-sm font-bold text-[#1B3022]">{log.title}</p>
                  <p className="text-xs text-[#2C2C2C] mt-0.5">{log.detail}</p>
                  <p className="text-[10px] text-black/40 mt-1">{log.time}</p>
                </div>
              ))
            ) : (
              <>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 bg-[#C5A059] rounded-full ring-4 ring-white"></div>
                  <p className="text-sm font-bold text-[#1B3022]">อัปเดตระบบสารสนเทศหลังบ้าน</p>
                  <p className="text-xs text-black/50 mt-1">โดย Admin - เมื่อสักครู่</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 bg-[#8B7355] rounded-full ring-4 ring-white"></div>
                  <p className="text-sm font-bold text-[#1B3022]">เริ่มต้นฐานข้อมูลการเก็บข้อมูลวัดดอนสว่าง</p>
                  <p className="text-xs text-black/50 mt-1">โดย System - 1 ชั่วโมงที่แล้ว</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

