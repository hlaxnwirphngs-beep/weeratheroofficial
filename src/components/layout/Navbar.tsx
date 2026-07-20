import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';

const DEFAULT_LINKS = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'ข่าวสาร', path: '/news' },
  { name: 'แกลเลอรี่', path: '/gallery' },
  { name: 'ข้อมูลวัด', path: '/about' },
  { name: 'ติดต่อ', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { menus = [], settings = [] } = useStore();

  const navLinks = menus && menus.length > 0 
    ? (menus || []).filter(m => m.status === 'Active').sort((a, b) => (a.order || 0) - (b.order || 0)).map(m => ({ name: m.title, path: m.link }))
    : DEFAULT_LINKS;

  const siteTitle = (settings || []).find(s => s.key === 'Site Title')?.value || 'วัดดอนสว่างธรรมเจริญศรัทธา';

  return (
    <nav className="fixed w-full z-50 bg-[#E4E2DA] border-b border-sep transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 sm:gap-4 min-w-0 pr-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-[#715D43]/20 shadow-sm shrink-0">
              {!imageError ? (
                <img 
                  src="/11zon_cropped.png" 
                  alt="โลโก้วัด" 
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-8 h-8 border-2 border-accent-brown rounded-full opacity-80"></div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm lg:text-base tracking-normal sm:tracking-wide text-accent-deep whitespace-nowrap">
                {siteTitle}
              </span>
              <span className="text-[8px] sm:text-[10px] uppercase opacity-60 tracking-wide hidden sm:block whitespace-nowrap">
                Don Sawang Thamma Charoen Sattha
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-3 py-2 text-sm font-medium text-accent-deep hover:text-accent-brown transition-colors tracking-wide"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/donate" 
              className="ml-2 lg:ml-4 px-5 py-2.5 bg-accent-deep text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2C2C2C] transition-colors shadow-lg"
            >
              ร่วมทำบุญ
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-accent-deep p-2 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-20 bg-black/25 backdrop-blur-[1px] z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="relative md:hidden bg-[#E4E2DA] border-t border-sep/50 shadow-xl z-50 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-3 py-3 text-base font-medium text-accent-deep hover:bg-white/50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link 
                  to="/donate" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center mt-4 px-4 py-3 bg-accent-deep text-white rounded-xl text-sm font-bold shadow-lg"
                >
                  ร่วมทำบุญ
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
