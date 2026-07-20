import { motion } from 'motion/react';
import GenericCRUD from '../../components/admin/GenericCRUD';
import { useStore } from '../../store/useStore';

export default function MenusManager() {
  const { menus = [], updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { key: 'title', label: 'ชื่อเมนู' },
    { key: 'link', label: 'ลิงก์ (URL)' },
    { key: 'order', label: 'ลำดับ', render: (row: any) => row.order || 0 },
    { key: 'status', label: 'สถานะ', render: (row: any) => (
       <span className={`px-2 py-1 text-xs font-bold rounded-md ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
         {row.status || 'Inactive'}
       </span>
    )},
  ];

  return (
    <GenericCRUD
      title="จัดการเมนู"
      description="จัดการเมนูนำทาง (Navigation) บนหน้าเว็บไซต์"
      columns={columns}
      data={menus}
      onSave={(data) => {
        if (menus.find(a => a.id === data.id)) {
           updateItem('menus', data);
        } else {
           addItem('menus', data);
        }
      }}
      onDelete={(row) => {
        deleteItem('menus', row.id);
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ชื่อเมนู</label>
            <input type="text" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ลิงก์ (URL Path)</label>
            <input type="text" required value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" placeholder="/about" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ลำดับการแสดงผล</label>
            <input type="number" required value={formData.order || 0} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1B3022]">สถานะเมนู</label>
            <div className="flex bg-stone-100 p-1 rounded-xl relative border border-stone-200/50 w-full overflow-hidden">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'Active' })}
                className={`relative flex-1 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 rounded-lg focus:outline-none cursor-pointer ${
                  (formData.status || 'Active') === 'Active'
                    ? 'text-green-800'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {(formData.status || 'Active') === 'Active' && (
                  <motion.div
                    layoutId="admin-menu-status-bg"
                    className="absolute inset-0 bg-green-50 rounded-lg shadow-xs border border-green-200/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${(formData.status || 'Active') === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-stone-300'}`} />
                  เปิดใช้งาน
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'Inactive' })}
                className={`relative flex-1 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 rounded-lg focus:outline-none cursor-pointer ${
                  formData.status === 'Inactive'
                    ? 'text-stone-800'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {formData.status === 'Inactive' && (
                  <motion.div
                    layoutId="admin-menu-status-bg"
                    className="absolute inset-0 bg-stone-200/50 rounded-lg shadow-xs border border-stone-300/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${formData.status === 'Inactive' ? 'bg-stone-400' : 'bg-stone-300'}`} />
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
