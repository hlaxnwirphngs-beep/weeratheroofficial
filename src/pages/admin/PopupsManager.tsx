import { motion } from 'motion/react';
import GenericCRUD from '../../components/admin/GenericCRUD';
import ImageUpload from '../../components/admin/ImageUpload';
import { useStore } from '../../store/useStore';

export default function PopupsManager() {
  const { popups = [], updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { key: 'title', label: 'ชื่อ Popup' },
    { key: 'status', label: 'สถานะ', render: (row: any) => (
       <span className={`px-2 py-1 text-xs font-bold rounded-md ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
         {row.status || 'Inactive'}
       </span>
    )},
  ];

  return (
    <GenericCRUD
      title="จัดการ Popup"
      description="จัดการ Popup ประกาศหน้าแรก"
      columns={columns}
      data={popups}
      onSave={(data) => {
        if (popups.find(a => a.id === data.id)) {
           updateItem('popups', data);
        } else {
           addItem('popups', data);
        }
      }}
      onDelete={(row) => {
        deleteItem('popups', row.id);
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ชื่อ Popup / หัวข้อ</label>
            <input type="text" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">รูปภาพ</label>
            <ImageUpload 
              value={formData.image || ''} 
              onChange={(base64) => setFormData({...formData, image: base64})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ข้อความรายละเอียด</label>
            <textarea value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white h-24" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-2">สถานะ</label>
            <div className="flex bg-stone-100 p-1 rounded-xl relative border border-stone-200/50 w-full overflow-hidden">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'Active' })}
                className={`relative flex-1 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 rounded-lg focus:outline-none ${
                  formData.status === 'Active'
                    ? 'text-green-800'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {formData.status === 'Active' && (
                  <motion.div
                    layoutId="admin-popup-status-bg"
                    className="absolute inset-0 bg-green-50 rounded-lg shadow-sm border border-green-200/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${formData.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-stone-300'}`} />
                  เปิดใช้งาน
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'Inactive' })}
                className={`relative flex-1 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 rounded-lg focus:outline-none ${
                  (formData.status || 'Inactive') === 'Inactive'
                    ? 'text-stone-800'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {(formData.status || 'Inactive') === 'Inactive' && (
                  <motion.div
                    layoutId="admin-popup-status-bg"
                    className="absolute inset-0 bg-stone-50 rounded-lg shadow-sm border border-stone-200/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${(formData.status || 'Inactive') === 'Inactive' ? 'bg-stone-500' : 'bg-stone-300'}`} />
                  ปิดใช้งาน
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    />
  );
}
