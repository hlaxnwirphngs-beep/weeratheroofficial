cat << 'INNER_EOF' > src/pages/admin/PopupsManager.tsx
import GenericCRUD from '../../components/admin/GenericCRUD';
import ImageUpload from '../../components/admin/ImageUpload';
import { useStore } from '../../store/useStore';

export default function PopupsManager() {
  const { popups, updateItem, deleteItem, addItem } = useStore();

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
        if (confirm(`ต้องการลบ Popup ${row.title} หรือไม่?`)) {
          deleteItem('popups', row.id);
        }
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
            <label className="block text-sm font-medium text-[#1B3022] mb-1">สถานะ</label>
            <select value={formData.status || 'Inactive'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white">
              <option value="Active">เปิดใช้งาน</option>
              <option value="Inactive">ปิดใช้งาน</option>
            </select>
          </div>
        </>
      )}
    />
  );
}
INNER_EOF
