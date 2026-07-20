import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Check, Trash2, Calendar, Phone, AlertCircle, X, CheckCircle, 
  Search, Filter, Inbox, ExternalLink, Printer, Copy, User, CheckCircle2, MessageSquare
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Messages() {
  const { contactMessages = [], updateItem, deleteItem } = useStore();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const markAsRead = (id: number) => {
    updateItem('contactMessages', { id, status: 'read' });
  };

  const markAsUnread = (id: number) => {
    updateItem('contactMessages', { id, status: 'unread' });
    showToast('ทำเครื่องหมายว่ายังไม่ได้อ่านแล้ว');
    if (selectedMessage?.id === id) {
      setSelectedMessage(prev => ({ ...prev, status: 'unread' }));
    }
  };

  const handleDelete = (id: number) => {
    setMessageToDelete(id);
  };

  const executeDelete = () => {
    if (messageToDelete !== null) {
      deleteItem('contactMessages', messageToDelete);
      if (selectedMessage?.id === messageToDelete) {
        setSelectedMessage(null);
      }
      showToast('ลบข้อความสำเร็จ');
      setMessageToDelete(null);
    }
  };

  const getSubjectLabel = (subject: string) => {
    const subjects: Record<string, string> = {
      'general': 'สอบถามทั่วไป',
      'activity': 'ร่วมกิจกรรม',
      'donate': 'การทำบุญ/บริจาค',
      'other': 'อื่นๆ'
    };
    return subjects[subject] || subject;
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'donate':
        return 'bg-amber-50 text-amber-700 border-amber-200/50';
      case 'activity':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      case 'general':
        return 'bg-blue-50 text-blue-700 border-blue-200/50';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200/50';
    }
  };

  // Stats Counters
  const totalCount = contactMessages.length;
  const unreadCount = contactMessages.filter((m: any) => m.status === 'unread').length;
  const readCount = contactMessages.filter((m: any) => m.status === 'read').length;

  // Filter messages
  const filteredMessages = contactMessages
    .filter((msg: any) => {
      // Status filter
      if (statusFilter === 'unread' && msg.status !== 'unread') return false;
      if (statusFilter === 'read' && msg.status !== 'read') return false;
      
      // Subject filter
      if (subjectFilter !== 'all' && msg.subject !== subjectFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const nameMatch = msg.name?.toLowerCase().includes(query);
        const phoneMatch = msg.phone?.includes(query);
        const emailMatch = msg.email?.toLowerCase().includes(query);
        const messageMatch = msg.message?.toLowerCase().includes(query);
        const subjectLabelMatch = getSubjectLabel(msg.subject).toLowerCase().includes(query);
        return nameMatch || phoneMatch || emailMatch || messageMatch || subjectLabelMatch;
      }

      return true;
    })
    .reverse(); // Newest first

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('คัดลอกข้อความลงคลิปบอร์ดแล้ว', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[120] bg-stone-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-stone-800 flex items-center gap-3"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            )}
            <span className="text-sm font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-stone-400 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1B3022] flex items-center gap-3">
            <Mail className="w-8 h-8 text-[#C5A059]" />
            ข้อความติดต่อจากผู้ใช้
          </h1>
          <p className="text-stone-500 mt-2 text-sm">จัดการข้อความสอบถามและสถิติการติดต่อกลับจากผู้ใช้</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-stone-50 text-stone-500 rounded-2xl">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">ข้อความทั้งหมด</p>
            <p className="text-2xl font-bold text-[#1B3022] mt-0.5">{totalCount} รายการ</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">ยังไม่ได้อ่าน</p>
            <p className="text-2xl font-bold text-red-600 mt-0.5">{unreadCount} รายการ</p>
          </div>
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">อ่านและตรวจสอบแล้ว</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{readCount} รายการ</p>
          </div>
        </div>
      </div>

      {/* Main Panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Messages List Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden h-[700px] flex flex-col">
          {/* List Headers, Search and Filters */}
          <div className="p-4 border-b border-stone-100 bg-stone-50/40 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[#1B3022] font-serif text-base">รายการกล่องข้อความ</h2>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-stone-100 text-stone-600">
                ผลลัพธ์ {filteredMessages.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล, ข้อความ..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-[#1B3022] shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('unread')}
                className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-1 ${
                  statusFilter === 'unread'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                ยังไม่อ่าน
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-[10px] text-red-600 font-black">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('read')}
                className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === 'read'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                อ่านแล้ว
              </button>
            </div>

            {/* Subject Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
              <button
                type="button"
                onClick={() => setSubjectFilter('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all ${
                  subjectFilter === 'all'
                    ? 'bg-[#1B3022] text-white border-[#1B3022]'
                    : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                }`}
              >
                ทุกประเภท
              </button>
              {['general', 'activity', 'donate', 'other'].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubjectFilter(sub)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all ${
                    subjectFilter === sub
                      ? 'bg-[#C5A059] text-white border-[#C5A059]'
                      : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {getSubjectLabel(sub)}
                </button>
              ))}
            </div>
          </div>

          {/* List scroll panel */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 bg-stone-50/20">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-300">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-stone-700 text-sm mb-1">ไม่พบข้อความติดต่อ</h3>
                <p className="text-xs text-stone-400">กรุณาลองเปลี่ยนเงื่อนไขการค้นหาหรือคัดกรองข้อมูล</p>
              </div>
            ) : (
              filteredMessages.map((msg: any) => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnread = msg.status === 'unread';
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (isUnread) {
                        markAsRead(msg.id);
                      }
                    }}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      isSelected 
                        ? 'bg-[#FDFBF7] border-l-[#C5A059] shadow-sm' 
                        : 'border-l-transparent bg-white hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {isUnread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></span>
                        )}
                        <h3 className={`text-sm ${isUnread ? 'font-bold text-stone-900' : 'font-medium text-stone-600'}`}>
                          {msg.name}
                        </h3>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap">
                        {new Date(msg.date).toLocaleDateString('th-TH', { 
                          day: 'numeric', month: 'short'
                        })}
                      </span>
                    </div>

                    <p className={`text-xs mb-3 line-clamp-2 leading-relaxed ${isUnread ? 'text-stone-800 font-medium' : 'text-stone-500'}`}>
                      {msg.message}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${getSubjectColor(msg.subject)}`}>
                        {getSubjectLabel(msg.subject)}
                      </span>

                      {/* Display contact quick indicator icon */}
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {msg.phone && (
                          <a
                            href={`tel:${msg.phone}`}
                            className="p-1.5 bg-stone-50 text-stone-500 hover:bg-[#C5A059]/10 hover:text-[#C5A059] border border-stone-200/50 rounded-lg transition-all"
                            title={`โทรออก: ${msg.phone}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {msg.email && (
                          <a
                            href={`mailto:${msg.email}`}
                            className="p-1.5 bg-stone-50 text-stone-500 hover:bg-[#C5A059]/10 hover:text-[#C5A059] border border-stone-200/50 rounded-lg transition-all"
                            title={`ส่งอีเมล: ${msg.email}`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Message Details Pane Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-stone-100 h-[700px] flex flex-col overflow-hidden">
          {selectedMessage ? (
            <div className="flex flex-col h-full bg-[#FDFBF7]/10">
              
              {/* Detail Pane Header Actions */}
              <div className="p-6 border-b border-stone-100 bg-[#FDFBF7]/40 flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getSubjectColor(selectedMessage.subject)}`}>
                      {getSubjectLabel(selectedMessage.subject)}
                    </span>
                    {selectedMessage.status === 'unread' ? (
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        ยังไม่ได้อ่าน
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        อ่านแล้ว
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-serif font-bold text-[#1B3022] mt-2 leading-tight">
                    ข้อความเรื่อง {getSubjectLabel(selectedMessage.subject)}
                  </h2>
                </div>

                <div className="flex items-center gap-1">
                  {selectedMessage.status === 'read' && (
                    <button
                      onClick={() => markAsUnread(selectedMessage.id)}
                      className="p-2 text-stone-500 hover:text-[#C5A059] hover:bg-stone-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 border border-transparent"
                      title="ทำเครื่องหมายว่ายังไม่ได้อ่าน"
                    >
                      <Inbox className="w-4 h-4" />
                      <span className="hidden sm:inline">ยังไม่อ่าน</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyText(`ชื่อผู้ติดต่อ: ${selectedMessage.name}\nเบอร์โทร: ${selectedMessage.phone}\nอีเมล: ${selectedMessage.email || '-'}\nประเภท: ${getSubjectLabel(selectedMessage.subject)}\n\nข้อความ:\n${selectedMessage.message}`)}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg transition-all"
                    title="คัดลอกรายละเอียดทั้งหมด"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="ลบข้อความนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Details Scroll Area */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                
                {/* Contact Card Details */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200/60 shadow-sm space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FDFBF7] border border-[#C5A059]/30 rounded-2xl flex items-center justify-center text-[#C5A059] font-serif font-black text-lg shadow-inner">
                      {selectedMessage.name ? selectedMessage.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">ชื่อผู้ส่งข้อความ</p>
                      <h3 className="text-base font-bold text-stone-800">{selectedMessage.name}</h3>
                    </div>
                  </div>

                  <hr className="border-stone-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1 bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                      <p className="text-xs font-bold text-stone-400 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#C5A059]" /> เบอร์โทรติดต่อ
                      </p>
                      <p className="font-bold text-stone-800">{selectedMessage.phone}</p>
                      {selectedMessage.phone && (
                        <a 
                          href={`tel:${selectedMessage.phone}`}
                          className="inline-flex items-center text-[10px] text-[#C5A059] font-bold hover:underline gap-1 mt-1"
                        >
                          คลิกเพื่อโทรออก <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>

                    <div className="space-y-1 bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                      <p className="text-xs font-bold text-stone-400 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#C5A059]" /> อีเมล (Email)
                      </p>
                      <p className="font-semibold text-stone-800 break-all">{selectedMessage.email || 'ไม่ได้ระบุ'}</p>
                      {selectedMessage.email && (
                        <a 
                          href={`mailto:${selectedMessage.email}`}
                          className="inline-flex items-center text-[10px] text-[#C5A059] font-bold hover:underline gap-1 mt-1"
                        >
                          ส่งอีเมลตอบกลับ <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-1 bg-stone-50/50 p-3 rounded-xl border border-stone-100 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-stone-400 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#C5A059]" /> วันที่ส่งข้อความ
                        </p>
                        <p className="font-medium text-stone-800 mt-0.5">
                          {new Date(selectedMessage.date).toLocaleDateString('th-TH', { 
                            year: 'numeric', month: 'long', day: 'numeric', 
                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Body Content Section */}
                <div className="space-y-2">
                  <p className="text-xs font-black text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" /> รายละเอียดข้อความติดต่อ
                  </p>
                  <div className="bg-white border border-stone-200 p-6 rounded-2xl text-stone-700 whitespace-pre-wrap leading-relaxed shadow-sm relative min-h-[160px] font-sans text-sm">
                    {/* Visual quote decoration to make it feel styled */}
                    <span className="absolute top-4 right-5 text-4xl font-serif text-stone-100 select-none pointer-events-none">”</span>
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 bg-stone-50/20 p-8 text-center">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 mb-4 text-[#C5A059]">
                <Mail className="w-9 h-9 animate-bounce" />
              </div>
              <h3 className="font-bold text-stone-800 text-base mb-1 font-serif">อ่านข้อความติดต่อ</h3>
              <p className="text-xs text-stone-400 max-w-xs">เลือกรายการข้อความทางด้านซ้ายเพื่อดูรายละเอียด เบอร์โทรศัพท์ และอีเมลผู้ส่งข้อความ</p>
            </div>
          )}
        </div>

      </div>

      {/* Custom Confirmation Dialog Modal */}
      <AnimatePresence>
        {messageToDelete !== null && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-100"
            >
              <h3 className="text-lg font-bold text-[#1B3022] mb-2">ยืนยันการลบข้อความ</h3>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                คุณแน่ใจหรือไม่ว่าต้องการลบข้อความนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMessageToDelete(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md"
                >
                  ยืนยันการลบ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

