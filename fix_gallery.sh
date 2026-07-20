cat << 'INNER_EOF' > src/pages/admin/GalleryManager.tsx
import GenericCRUD from '../../components/admin/GenericCRUD';
import ImageUpload from '../../components/admin/ImageUpload';
import { useStore } from '../../store/useStore';

export default function GalleryManager() {
  const { gallery, updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { 
      key: 'url', 
      label: 'รูปภาพ',
      render: (row: any) => (
        <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
          <img src={row.url} alt={row.title} className="w-full h-full object-cover" />
        </div>
      )
    },
    { key: 'title', label: 'ชื่อรูป/อัลบั้ม' },
    { key: 'category', label: 'หมวดหมู่' },
  ];

  return (
    <GenericCRUD
      title="จัดการแกลเลอรี่"
      description="จัดการรูปภาพและอัลบั้ม"
      columns={columns}
      data={gallery}
      onSave={(data) => {
        if (gallery.find(a => a.id === data.id)) {
           updateItem('gallery', data);
        } else {
           addItem('gallery', data);
        }
      }}
      onDelete={(row) => {
        if (confirm(`ต้องการลบ ${row.title} หรือไม่?`)) {
          deleteItem('gallery', row.id);
        }
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">รูปภาพ</label>
            <ImageUpload 
              value={formData.url || ''} 
              onChange={(base64) => setFormData({...formData, url: base64})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ชื่อรูป</label>
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
        </>
      )}
    />
  );
}
INNER_EOF
