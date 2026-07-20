import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Image as ImageIcon, Calendar as CalendarIcon, 
  CreditCard, Phone, Users, Heart, MessageSquare, AlertCircle, Server, Menu, 
  UserCog, Shield, Settings, Activity, Database, BarChart3, Trash2, LogOut,
  ChevronLeft, ChevronRight, X, Mail
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const MAIN_LINKS = [
  { name: 'ภาพรวม (Dashboard)', path: '/admin', icon: LayoutDashboard },
  { name: 'จัดการข่าวสาร', path: '/admin/news', icon: FileText },
  { name: 'จัดการแกลเลอรี่', path: '/admin/gallery', icon: ImageIcon },
  { name: 'จัดการกิจกรรม', path: '/admin/activities', icon: CalendarIcon },
  { name: 'จัดการบัญชีร่วมทำบุญ', path: '/admin/donation-info', icon: CreditCard },
  { name: 'จัดการข้อมูลติดต่อ', path: '/admin/contact-info', icon: Phone },
  { name: 'ข้อความติดต่อ', path: '/admin/messages', icon: Mail },
  { name: 'จัดการเจ้าอาวาส', path: '/admin/abbots', icon: Users },
  { name: 'จัดการข้อมูลบริจาค', path: '/admin/donations', icon: Heart },
  { name: 'จัดการ Popup', path: '/admin/popups', icon: MessageSquare },
  { name: 'จัดการป้ายประกาศ', path: '/admin/announcements', icon: AlertCircle },
  { name: 'จัดการสถานะเว็บ', path: '/admin/server-status', icon: Server },
];

const SYSTEM_LINKS = [
  { name: 'จัดการเมนู', path: '/admin/menus', icon: Menu },
  { name: 'จัดการผู้ใช้', path: '/admin/users', icon: UserCog },
  { name: 'จัดการสิทธิ์', path: '/admin/roles', icon: Shield },
  { name: 'ตั้งค่าเว็บไซต์', path: '/admin/settings', icon: Settings },
  { name: 'Activity Log', path: '/admin/activity-log', icon: Activity },
  { name: 'Backup', path: '/admin/backup', icon: Database },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Recycle Bin', path: '/admin/recycle-bin', icon: Trash2 },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('admin_sidebar_collapsed') === 'true');
  const [isSystemExpanded, setIsSystemExpanded] = useState(true);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      localStorage.setItem('admin_sidebar_collapsed', String(newState));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-[#1B3022] text-white flex flex-col flex-shrink-0 h-screen fixed md:sticky top-0 left-0 z-50 md:z-auto transition-all duration-300 ease-in-out 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64 overflow-hidden`}
      >
        <div className="p-5 border-b border-white/10 shrink-0 flex items-center justify-between h-24">
          {isCollapsed ? (
            <div className="flex justify-center items-center w-full md:block hidden">
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-serif font-bold text-base shadow-sm">
                ดส
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-serif text-base leading-tight">วัดดอนสว่าง<br/>ธรรมเจริญศรัทธา</h2>
              <p className="text-[10px] text-[#C5A059] mt-1 uppercase tracking-wider">Enterprise Admin</p>
            </div>
          )}

          {/* Close button for Mobile */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white md:hidden transition-colors"
            title="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {MAIN_LINKS.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center rounded-lg transition-colors text-sm px-3 py-2.5 ${
                    isCollapsed ? 'md:justify-center md:px-0' : ''
                  } ${
                    isActive 
                      ? 'bg-[#C5A059] text-white font-medium shadow-md' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  title={isCollapsed ? link.name : undefined}
                >
                  <link.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#C5A059]'} ${isCollapsed ? 'md:mr-0 mr-3' : 'mr-3'}`} />
                  <span className={`whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-200 ${isCollapsed ? 'md:hidden block' : 'block'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            {!isCollapsed ? (
              <button 
                onClick={() => setIsSystemExpanded(!isSystemExpanded)}
                className="w-full flex items-center justify-between px-3 pb-2 pt-4 text-xs font-semibold text-white/50 hover:text-white/80 uppercase tracking-wider transition-colors"
              >
                <span>ระบบ (System)</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isSystemExpanded ? 'rotate-90' : ''}`} />
              </button>
            ) : (
              <div className="h-px bg-white/10 mx-3 my-4" />
            )}
            
            <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${!isCollapsed && !isSystemExpanded ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
            {SYSTEM_LINKS.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center rounded-lg transition-colors text-sm px-3 py-2.5 ${
                    isCollapsed ? 'md:justify-center md:px-0' : ''
                  } ${
                    isActive 
                      ? 'bg-[#C5A059] text-white font-medium shadow-md' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  title={isCollapsed ? link.name : undefined}
                >
                  <link.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#C5A059]'} ${isCollapsed ? 'md:mr-0 mr-3' : 'mr-3'}`} />
                  <span className={`whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-200 ${isCollapsed ? 'md:hidden block' : 'block'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full py-2.5 text-white/70 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors text-sm px-3 ${
              isCollapsed ? 'md:justify-center md:px-0' : ''
            }`}
            title={isCollapsed ? "ออกจากระบบ" : undefined}
          >
            <LogOut className={`w-4 h-4 shrink-0 ${isCollapsed ? 'md:mr-0 mr-3' : 'mr-3'}`} />
            <span className={`whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-200 ${isCollapsed ? 'md:hidden block' : 'block'}`}>
              ออกจากระบบ
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center px-6 shadow-sm shrink-0 sticky top-0 z-10 gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-600 transition-all border border-stone-200/50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30"
            title={isCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-[#1B3022]">
            {[...MAIN_LINKS, ...SYSTEM_LINKS].find(link => location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path)))?.name || 'ระบบจัดการหลังบ้าน'}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-[#FDFBF7]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
