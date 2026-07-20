import GenericCRUD from '../../components/admin/GenericCRUD';
import { useStore } from '../../store/useStore';

export default function SettingsManager() {
  const { settings = [], updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { key: 'key', label: 'การตั้งค่า' },
    { key: 'value', label: 'ค่าปัจจุบัน' },
  ];

  return (
    <GenericCRUD
      title="ตั้งค่าเว็บไซต์"
      description="ตั้งค่าข้อมูลพื้นฐานของเว็บไซต์"
      columns={columns}
      data={settings}
      onSave={(data) => {
        if (settings.find(a => a.id === data.id)) {
           updateItem('settings', data);
        } else {
           addItem('settings', data);
        }
      }}
      onDelete={(row) => {
        deleteItem('settings', row.id);
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">Key</label>
            <input type="text" required value={formData.key || ''} onChange={e => setFormData({...formData, key: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">Value</label>
            <textarea required value={formData.value || ''} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white h-24" />
          </div>
        </>
      )}
    />
  );
}
