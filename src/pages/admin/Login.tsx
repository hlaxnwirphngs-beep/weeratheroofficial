import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import SetupRequired from '../../components/ui/SetupRequired';
import { motion } from 'motion/react';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isSupabaseConfigured()) {
    return <SetupRequired />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-[#8B7355] rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 border-2 border-white rounded-full opacity-80"></div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#1B3022]">
            ระบบจัดการหลังบ้าน
          </h2>
          <p className="mt-2 text-sm text-[#8B7355] font-semibold uppercase tracking-widest">
            วัดดอนสว่างธรรมเจริญศรัทธา
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white py-8 px-4 luxury-shadow sm:rounded-3xl sm:px-10 border border-gray-100"
        >
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start">
                <span className="font-bold mr-2">Error:</span> {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B3022] mb-2">
                อีเมล (Email)
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#8B7355]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-[#C5A059] focus:border-[#C5A059] block w-full pl-12 sm:text-sm border-gray-200 rounded-xl py-3 border bg-[#FDFBF7] text-[#1B3022] transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1B3022] mb-2">
                รหัสผ่าน (Password)
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#8B7355]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-[#C5A059] focus:border-[#C5A059] block w-full pl-12 sm:text-sm border-gray-200 rounded-xl py-3 border bg-[#FDFBF7] text-[#1B3022] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-[#1B3022] hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3022] transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </button>
            </div>
            
            <div className="text-center pt-4 border-t border-gray-100">
               <p className="text-xs text-black/50">
                 หากคุณยังไม่มีบัญชี หรือลืมรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบผ่าน Supabase Dashboard ของคุณ
               </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
