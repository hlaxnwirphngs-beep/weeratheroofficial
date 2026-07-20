cat << 'INNER_EOF' > src/pages/admin/AbbotsManager.tsx
import GenericCRUD from '../../components/admin/GenericCRUD';
import ImageUpload from '../../components/admin/ImageUpload';
import { useStore } from '../../store/useStore';

export default function AbbotsManager() {
  const { abbots, updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { 
      key: 'image', 
      label: 'รูป',
      render: (row: any) => (
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
          {row.image ? (
            <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
          )}
        </div>
      )
    },
    { key: 'name', label: 'ชื่อ' },
    { key: 'position', label: 'ตำแหน่ง' },
    { key: 'year', label: 'วาระ' },
  ];

  return (
    <GenericCRUD
      title="จัดการทำเนียบเจ้าอาวาส"
      description="เพิ่ม ลบ หรือแก้ไขข้อมูลเจ้าอาวาสของวัดดอนสว่างธรรมเจริญศรัทธา"
      columns={columns}
      data={abbots}
      onSave={(data) => {
        if (abbots.find(a => a.id === data.id)) {
           updateItem('abbots', data);
        } else {
           addItem('abbots', data);
        }
      }}
      onDelete={(row) => {
        if (confirm(`ต้องการลบ ${row.name} หรือไม่?`)) {
          deleteItem('abbots', row.id);
        }
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">รูปภาพ</label>
            <ImageUpload 
              value={formData.image || ''} 
              onChange={(base64) => setFormData({...formData, image: base64})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ชื่อ-ฉายา</label>
            <input 
              type="text" required value={formData.name || ''}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ตำแหน่ง</label>
            <input 
              type="text" required value={formData.position || ''}
              onChange={e => setFormData({...formData, position: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">วาระ</label>
            <input 
              type="text" required value={formData.year || ''}
              onChange={e => setFormData({...formData, year: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white"
            />
          </div>
        </>
      )}
    />
  );
}
INNER_EOF
