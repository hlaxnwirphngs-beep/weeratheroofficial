cat << 'INNER_EOF' > src/pages/admin/NewsManager.tsx
import GenericCRUD from '../../components/admin/GenericCRUD';
import ImageUpload from '../../components/admin/ImageUpload';
import { useStore } from '../../store/useStore';

export default function NewsManager() {
  const { news, updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { 
      key: 'image', 
      label: 'รูป',
      render: (row: any) => (
        <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
          {row.image ? (
            <img src={row.image} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No img</div>
          )}
        </div>
      )
    },
    { key: 'title', label: 'หัวข้อข่าว' },
    { key: 'category', label: 'หมวดหมู่' },
    { key: 'date', label: 'วันที่ประกาศ' },
  ];

  return (
    <GenericCRUD
      title="จัดการข่าวสาร"
      description="จัดการข่าวสารและกิจกรรมของวัด"
      columns={columns}
      data={news}
      onSave={(data) => {
        if (news.find(a => a.id === data.id)) {
           updateItem('news', data);
        } else {
           addItem('news', data);
        }
      }}
      onDelete={(row) => {
        if (confirm(`ต้องการลบข่าว ${row.title} หรือไม่?`)) {
          deleteItem('news', row.id);
        }
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">รูปภาพข่าว</label>
            <ImageUpload 
              value={formData.image || ''} 
              onChange={(base64) => setFormData({...formData, image: base64})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">หัวข้อข่าว</label>
            <input 
              type="text" required value={formData.title || ''}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">หมวดหมู่</label>
            <input 
              type="text" required value={formData.category || ''}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">วันที่ประกาศ</label>
            <input 
              type="text" required value={formData.date || ''}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">เนื้อหาย่อ</label>
            <textarea 
              required value={formData.excerpt || ''}
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white h-24"
            />
          </div>
        </>
      )}
    />
  );
}
INNER_EOF
