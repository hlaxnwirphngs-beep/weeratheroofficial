import { Calendar } from 'lucide-react';
import GenericCRUD from '../../components/admin/GenericCRUD';
import ImageUpload from '../../components/admin/ImageUpload';
import { useStore } from '../../store/useStore';

export default function NewsManager() {
  const { news = [], updateItem, deleteItem, addItem } = useStore();

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
        deleteItem('news', row.id);
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
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#1B3022]">หมวดหมู่ข่าว</label>
            <input 
              type="text" required value={formData.category || ''}
              onChange={e => setFormData({...formData, category: e.target.value})}
              placeholder="พิมพ์หมวดหมู่ หรือกดเลือกด้านล่าง"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white text-stone-800"
            />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {['ข่าวประชาสัมพันธ์', 'กิจกรรมงานวัด', 'บูรณะปฏิสังขรณ์', 'ธรรมสาระ'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({...formData, category: cat})}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    formData.category === cat
                      ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-xs'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#1B3022] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              วันที่ประกาศ
            </label>
            <div className="relative">
              <input 
                type="date" required value={formData.date || ''}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white text-stone-800 font-medium"
              />
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  const y = d.getFullYear();
                  const m = String(d.getMonth() + 1).padStart(2, '0');
                  const date = String(d.getDate()).padStart(2, '0');
                  setFormData({...formData, date: `${y}-${m}-${date}`});
                }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#C5A059]/10 text-[#8B7355] border border-[#C5A059]/20 hover:bg-[#C5A059]/20 transition-all cursor-pointer"
              >
                📅 วันนี้
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  const y = d.getFullYear();
                  const m = String(d.getMonth() + 1).padStart(2, '0');
                  const date = String(d.getDate()).padStart(2, '0');
                  setFormData({...formData, date: `${y}-${m}-${date}`});
                }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#8B7355]/10 text-[#8B7355] border border-[#8B7355]/20 hover:bg-[#8B7355]/20 transition-all cursor-pointer"
              >
                📅 พรุ่งนี้
              </button>
            </div>
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
