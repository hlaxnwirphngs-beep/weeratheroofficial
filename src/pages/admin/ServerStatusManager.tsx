import { motion } from 'motion/react';
import GenericCRUD from '../../components/admin/GenericCRUD';
import { useStore } from '../../store/useStore';

export default function ServerStatusManager() {
  const { serverStatus = [], updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { key: 'name', label: 'รายการ' },
    { 
      key: 'value', 
      label: 'สถานะปัจจุบัน',
      render: (row: any) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-md ${
          row.value === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {row.value}
        </span>
      )
    },
    { key: 'type', label: 'ประเภท' },
  ];

  return (
    <GenericCRUD
      title="จัดการสถานะเว็บไซต์"
      description="ปรับแต่งสถานะ Server และเปิด/ปิด โหมดปรับปรุงเว็บไซต์"
      columns={columns}
      data={serverStatus}
      onSave={(data) => {
        if (serverStatus.find(a => a.id === data.id)) {
           updateItem('serverStatus', data);
        } else {
           addItem('serverStatus', data);
        }
      }}
      onDelete={(row) => {
        deleteItem('serverStatus', row.id);
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">รายการ</label>
            <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1B3022]">สถานะปัจจุบัน</label>
            <div className="flex bg-stone-100 p-1 rounded-xl relative border border-stone-200/50 w-full overflow-hidden">
              {['Online', 'Offline', 'Maintenance'].map((status) => {
                const labelMap: Record<string, string> = {
                  Online: '🟢 Online',
                  Offline: '🔴 Offline',
                  Maintenance: '🛠️ Maintenance',
                };
                const isSelected = (formData.value || 'Offline') === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, value: status })}
                    className={`relative flex-1 py-2 text-xs font-bold transition-all duration-200 rounded-lg focus:outline-none cursor-pointer ${
                      isSelected
                        ? status === 'Online'
                          ? 'text-green-800'
                          : status === 'Offline'
                          ? 'text-red-800'
                          : 'text-amber-800'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="admin-server-status-bg"
                        className={`absolute inset-0 rounded-lg shadow-xs border ${
                          status === 'Online'
                            ? 'bg-green-50 border-green-200/50'
                            : status === 'Offline'
                            ? 'bg-red-50 border-red-200/50'
                            : 'bg-amber-50 border-amber-200/50'
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center">
                      {labelMap[status]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ประเภท</label>
            <input type="text" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
        </>
      )}
    />
  );
}
