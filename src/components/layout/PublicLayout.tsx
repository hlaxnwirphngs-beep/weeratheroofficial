import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useStore } from '../../store/useStore';

export default function PublicLayout() {
  const { settings = [], serverStatus = [] } = useStore();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Increment visit/pageview counter on every page load/refresh and route change (page view)
    const currentVisits = parseInt(localStorage.getItem('site_total_visits') || '142', 10);
    localStorage.setItem('site_total_visits', (currentVisits + 1).toString());
  }, [location.pathname]);

  const siteTitle = (settings || []).find(s => s.key === 'Site Title')?.value || 'วัดดอนสว่างธรรมเจริญศรัทธา';
  const siteEmail = (settings || []).find(s => s.key === 'Contact Email')?.value || 'weeratheroofficial@gmail.com';
  const sitePhone = (settings || []).find(s => s.key === 'Contact Phone')?.value || '02-xxx-xxxx';
  const siteAddress = (settings || []).find(s => s.key === 'Temple Address')?.value || 'วัดดอนสว่างธรรมเจริญศรัทธา\nหมู่ 5 ตำบลเชียงใหม่\nอำเภอโพธิ์ชัย จังหวัดร้อยเอ็ด 45230';
  
  const isOnline = (serverStatus || []).find(s => s.name === 'Server Status')?.value === 'Online';

  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      <footer className="bg-accent-deep text-stone-400 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-serif text-2xl text-white mb-4">{siteTitle}</h3>
            <p className="leading-relaxed text-sm">
              ศูนย์รวมจิตใจของชุมชน เป็นสถานที่สำหรับปฏิบัติธรรมและประกอบศาสนกิจ 
              เผยแผ่พระพุทธศาสนาด้วยความสงบและร่มเย็น
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">ลิงก์ที่เป็นประโยชน์</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-gold-500 transition-colors">ประวัติและข้อมูลวัด</Link></li>
              <li><Link to="/news" className="hover:text-gold-500 transition-colors">ข่าวสารและประชาสัมพันธ์</Link></li>
              <li><Link to="/gallery" className="hover:text-gold-500 transition-colors">ภาพกิจกรรมและแกลเลอรี่</Link></li>
              <li><Link to="/donate" className="hover:text-gold-500 transition-colors">ช่องทางการร่วมทำบุญ</Link></li>
              <li><Link to="/contact" className="hover:text-gold-500 transition-colors">ติดต่อสอบถามและแผนที่</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">นโยบายและคำแนะนำ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-gold-500 transition-colors">คำถามที่พบบ่อย (FAQ)</Link></li>
              <li><Link to="/terms" className="hover:text-gold-500 transition-colors">ข้อกำหนดและเงื่อนไข</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-500 transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">ติดต่อ</h4>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {siteAddress}
            </p>
            <p className="mt-2 text-sm">โทรศัพท์: {sitePhone}</p>
            <p className="text-sm">อีเมล: {siteEmail}</p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-sm text-center md:text-left gap-4">
          <div>
            &copy; {new Date().getFullYear()} {siteTitle}. สงวนลิขสิทธิ์.
          </div>
          <div className="flex flex-wrap gap-3">
            {serverStatus.length > 0 ? (
              serverStatus.map((status) => {
                const val = status.value || 'Offline';
                const dotColor = val === 'Online' ? 'bg-green-500 animate-pulse' : val === 'Maintenance' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500';
                return (
                  <div key={status.id} className="flex items-center gap-2 bg-stone-900/50 px-4 py-2 rounded-full border border-stone-800" id={`server-status-${status.id}`}>
                    <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80 text-white">
                      {status.name}: {val}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center gap-2 bg-stone-900/50 px-4 py-2 rounded-full border border-stone-800" id="server-status-default">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80 text-white">
                  Server Status: Online
                </span>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
