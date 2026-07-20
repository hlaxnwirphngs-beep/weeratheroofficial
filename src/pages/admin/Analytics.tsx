import { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, animate } from 'motion/react';

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (val) => setCount(Math.floor(val)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Analytics() {
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    const visits = parseInt(localStorage.getItem('site_total_visits') || '142', 10);
    setTotalVisits(visits);
  }, []);

  const data = [
    { name: '13 ก.ค.', visitors: Math.floor(totalVisits * 0.1) },
    { name: '14 ก.ค.', visitors: Math.floor(totalVisits * 0.12) },
    { name: '15 ก.ค.', visitors: Math.floor(totalVisits * 0.15) },
    { name: '16 ก.ค.', visitors: Math.floor(totalVisits * 0.13) },
    { name: '17 ก.ค.', visitors: Math.floor(totalVisits * 0.16) },
    { name: '18 ก.ค.', visitors: Math.floor(totalVisits * 0.14) },
    { name: '19 ก.ค.', visitors: Math.floor(totalVisits * 0.2) },
  ];

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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <h1 className="text-2xl font-bold font-serif text-[#1B3022] flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-[#C5A059]" />
          ระบบ Analytics
        </h1>
        <p className="text-stone-500 mt-2 text-sm">สถิติการเข้าชมเว็บไซต์และการใช้งานของผู้ใช้</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center text-green-500 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              12%
            </span>
          </div>
          <p className="text-stone-500 text-sm font-medium">ผู้เข้าชมทั้งหมด</p>
          <p className="text-2xl font-bold text-stone-800 mt-1">
            <AnimatedCounter value={totalVisits} />
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <span className="flex items-center text-green-500 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              8%
            </span>
          </div>
          <p className="text-stone-500 text-sm font-medium">เซสชัน (Sessions)</p>
          <p className="text-2xl font-bold text-stone-800 mt-1">
            <AnimatedCounter value={Math.floor(totalVisits * 1.15)} />
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <span className="flex items-center text-red-500 text-sm font-medium">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              3%
            </span>
          </div>
          <p className="text-stone-500 text-sm font-medium">ระยะเวลาเฉลี่ยบนเว็บไซต์</p>
          <p className="text-2xl font-bold text-stone-800 mt-1">2m 45s</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center text-green-500 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              5%
            </span>
          </div>
          <p className="text-stone-500 text-sm font-medium">Bounce Rate</p>
          <p className="text-2xl font-bold text-stone-800 mt-1">42.3%</p>
        </motion.div>
      </motion.div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 min-h-[400px]">
        <h3 className="text-lg font-bold text-[#1B3022] mb-6 font-serif">สถิติผู้เข้าชม 7 วันที่ผ่านมา</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#8B7355" fontSize={12} />
              <YAxis stroke="#8B7355" fontSize={12} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1B3022', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#C5A059" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
