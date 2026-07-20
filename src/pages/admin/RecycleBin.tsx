import { useState, useEffect } from 'react';
import { Trash2, RefreshCcw, AlertTriangle, FileText, Image as ImageIcon, Settings, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';

export default function RecycleBin() {
  const { recycleBin = [], deleteItem, addItem } = useStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: 'empty' | 'permanent' | 'restore';
    item?: any;
    title: string;
    message: string;
  } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const executeEmptyBin = () => {
    const allIds = recycleBin.map(item => item.id);
    allIds.forEach(id => deleteItem('recycleBin', id));
    
    addItem('activityLogs', {
      id: Date.now(),
      action: 'ล้างถังขยะ (Empty Recycle Bin)',
      user: 'Admin',
      time: new Date().toISOString(),
      type: 'delete'
    });
    showToast('ล้างถังขยะเรียบร้อยแล้ว');
    setConfirmModal(null);
  };

  const executeRestore = (item: any) => {
    if (item.originalTable) {
      const restoredItem = { ...item };
      delete restoredItem.originalTable;
      delete restoredItem.deletedAt;
      
      addItem(item.originalTable as any, restoredItem);
    }
    deleteItem('recycleBin', item.id);
    
    addItem('activityLogs', {
      id: Date.now(),
      action: 'กู้คืนข้อมูล',
      user: 'Admin',
      detail: item.name || item.title || `ID: ${item.id}`,
      time: new Date().toISOString(),
      type: 'create'
    });
    showToast('กู้คืนข้อมูลเรียบร้อยแล้ว');
    setConfirmModal(null);
  };

  const executePermanentDelete = (id: number) => {
    deleteItem('recycleBin', id);
    
    addItem('activityLogs', {
      id: Date.now(),
      action: 'ลบข้อมูลถาวร',
      user: 'Admin',
      detail: `ID: ${id}`,
      time: new Date().toISOString(),
      type: 'delete'
    });
    showToast('ลบข้อมูลถาวรเรียบร้อยแล้ว');
    setConfirmModal(null);
  };

  const handleEmptyBin = () => {
    setConfirmModal({
      type: 'empty',
      title: 'ล้างถังขยะทั้งหมด',
      message: 'คุณต้องการลบข้อมูลในถังขยะทั้งหมดใช่หรือไม่? ข้อมูลนี้จะไม่สามารถกู้คืนได้อีก'
    });
  };

  const handleRestore = (item: any) => {
    setConfirmModal({
      type: 'restore',
      item,
      title: 'กู้คืนข้อมูล',
      message: `คุณต้องการกู้คืน "${item.name || item.title || `ID: ${item.id}`}" กลับไปยังหน้าเดิมใช่หรือไม่?`
    });
  };

  const handlePermanentDelete = (item: any) => {
    setConfirmModal({
      type: 'permanent',
      item,
      title: 'ลบข้อมูลถาวร',
      message: `คุณต้องการลบ "${item.name || item.title || `ID: ${item.id}`}" ถาวรใช่หรือไม่? ขั้นตอนนี้ไม่สามารถกู้คืนได้อีก`
    });
  };

  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'ข่าวสาร': return { icon: FileText, color: 'text-blue-500 bg-blue-50' };
      case 'แกลเลอรี่': return { icon: ImageIcon, color: 'text-green-500 bg-green-50' };
      case 'ป้ายประกาศ': return { icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' };
      default: return { icon: Settings, color: 'text-stone-500 bg-stone-50' };
    }
  };

  const sortedItems = [...recycleBin].sort((a, b) => {
    return new Date(b.deletedAt || 0).getTime() - new Date(a.deletedAt || 0).getTime();
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[120] bg-stone-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-stone-800 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-stone-400 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1B3022] flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-[#C5A059]" />
            ถังขยะ (Recycle Bin)
          </h1>
          <p className="text-stone-500 mt-2 text-sm">จัดการข้อมูลที่ถูกลบ กู้คืน หรือลบถาวร (ข้อมูลจะถูกเก็บไว้ 30 วัน)</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleEmptyBin}
            disabled={sortedItems.length === 0}
            className={`px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center ${
              sortedItems.length === 0 ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            ล้างถังขยะทั้งหมด
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
          <h2 className="font-bold text-stone-700">รายการที่ถูกลบ ({sortedItems.length})</h2>
        </div>
        
        {sortedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-stone-400">
            <Trash2 className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-stone-600">ถังขยะว่างเปล่า</p>
            <p className="text-sm mt-1">ไม่มีรายการที่ถูกลบในขณะนี้</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="text-xs text-stone-500 bg-stone-50/50 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">ชื่อรายการ</th>
                  <th className="px-6 py-4 font-medium">ประเภทข้อมูล</th>
                  <th className="px-6 py-4 font-medium">วันที่ลบ</th>
                  <th className="px-6 py-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedItems.map((item) => {
                  const style = getIconAndColor(item.type || 'ทั่วไป');
                  const Icon = style.icon;
                  return (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${style.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-stone-800">{item.name || item.title || `ไม่มีชื่อ (ID: ${item.id})`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.type || 'ทั่วไป'}</td>
                    <td className="px-6 py-4">{item.deletedAt ? new Date(item.deletedAt).toLocaleString('th-TH') : '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleRestore(item)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center" 
                          title="กู้คืน"
                        >
                          <RefreshCcw className="w-3 h-3 mr-1" />
                          กู้คืน
                        </button>
                        <button 
                          onClick={() => handlePermanentDelete(item)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center" 
                          title="ลบถาวร"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          ลบถาวร
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Confirmation Dialog Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-100"
            >
              <h3 className="text-lg font-bold text-[#1B3022] mb-2">{confirmModal.title}</h3>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                {confirmModal.message}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirmModal.type === 'empty') {
                      executeEmptyBin();
                    } else if (confirmModal.type === 'restore') {
                      executeRestore(confirmModal.item);
                    } else if (confirmModal.type === 'permanent') {
                      executePermanentDelete(confirmModal.item.id);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold text-white transition-colors shadow-md ${
                    confirmModal.type === 'restore' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {confirmModal.type === 'restore' ? 'ยืนยันกู้คืน' : 'ยืนยันการลบ'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
