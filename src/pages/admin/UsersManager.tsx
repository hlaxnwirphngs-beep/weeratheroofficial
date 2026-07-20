import { motion } from 'motion/react';
import GenericCRUD from '../../components/admin/GenericCRUD';
import { useStore } from '../../store/useStore';

export default function UsersManager() {
  const { users = [], updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { key: 'name', label: 'ชื่อ' },
    { key: 'email', label: 'อีเมล' },
    { 
      key: 'role', 
      label: 'สิทธิ์',
      render: (row: any) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-md ${
          row.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {row.role}
        </span>
      )
    },
    { key: 'lastLogin', label: 'ใช้งานล่าสุด' },
  ];

  return (
    <GenericCRUD
      title="จัดการผู้ใช้"
      description="เพิ่มผู้ดูแลระบบและกำหนดสิทธิ์การเข้าถึง"
      columns={columns}
      data={users}
      onSave={(data) => {
        if (users.find(a => a.id === data.id)) {
           updateItem('users', data);
        } else {
           addItem('users', { ...data, lastLogin: new Date().toISOString().split('T')[0] });
        }
      }}
      onDelete={(row) => {
        deleteItem('users', row.id);
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ชื่อ</label>
            <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">อีเมล</label>
            <input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1B3022]">ระดับสิทธิ์ (Role)</label>
            <div className="flex bg-stone-100 p-1 rounded-xl relative border border-stone-200/50 w-full overflow-hidden">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Editor' })}
                className={`relative flex-1 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 rounded-lg focus:outline-none cursor-pointer ${
                  (formData.role || 'Editor') === 'Editor'
                    ? 'text-[#8B7355]'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {(formData.role || 'Editor') === 'Editor' && (
                  <motion.div
                    layoutId="admin-user-role-bg"
                    className="absolute inset-0 bg-[#C5A059]/10 rounded-lg shadow-xs border border-[#C5A059]/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  📝 Editor
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Super Admin' })}
                className={`relative flex-1 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 rounded-lg focus:outline-none cursor-pointer ${
                  formData.role === 'Super Admin'
                    ? 'text-green-800'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {formData.role === 'Super Admin' && (
                  <motion.div
                    layoutId="admin-user-role-bg"
                    className="absolute inset-0 bg-green-50 rounded-lg shadow-xs border border-green-200/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  👑 Super Admin
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    />
  );
}
