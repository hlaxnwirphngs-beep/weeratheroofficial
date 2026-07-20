import GenericCRUD from '../../components/admin/GenericCRUD';
import MultiImageUpload from '../../components/ui/MultiImageUpload';
import { useStore } from '../../store/useStore';

export default function GalleryManager() {
  const { gallery = [], updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { 
      key: 'url', 
      label: 'รูปภาพ',
      render: (row: any) => {
        const displayImage = row.images && row.images.length > 0 ? row.images[0] : row.url;
        const totalImages = row.images ? row.images.length : (row.url ? 1 : 0);
        return (
          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shadow-sm flex items-center justify-center shrink-0">
            {displayImage ? (
              <>
                <img src={displayImage} alt={row.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded-tl font-bold">
                  {totalImages} ภาพ
                </span>
              </>
            ) : (
              <span className="text-[10px] text-stone-400">ไม่มีรูป</span>
            )}
          </div>
        );
      }
    },
    { key: 'title', label: 'ชื่อรูป/อัลบั้ม' },
    { key: 'category', label: 'หมวดหมู่' },
  ];

  const existingCategories = Array.from(new Set(gallery.map(g => g.category).filter(Boolean)));
  const defaultCategories = ['ภาพงานวัด', 'ศาสนสถาน', 'กิจกรรมพระสงฆ์', 'งานบุญประเพณี'];
  const allCategories = Array.from(new Set([...defaultCategories, ...existingCategories]));

  return (
    <GenericCRUD
      title="จัดการแกลเลอรี่"
      description="จัดการรูปภาพและอัลบั้มกิจกรรมต่างๆ (สามารถเพิ่มรูปภาพในแต่ละอัลบั้มได้มากกว่า 1 รูป)"
      columns={columns}
      data={gallery}
      onSave={(data) => {
        // Fallback or standard assignment
        const currentImages = data.images || (data.url ? [data.url] : []);
        const enrichedData = {
          ...data,
          images: currentImages,
          url: currentImages[0] || '',
          count: currentImages.length
        };
        if (gallery.find(a => a.id === data.id)) {
           updateItem('gallery', enrichedData);
        } else {
           addItem('gallery', enrichedData);
        }
      }}
      onDelete={(row) => {
        deleteItem('gallery', row.id);
      }}
      renderForm={(formData, setFormData) => {
        const currentImages = formData.images || (formData.url ? [formData.url] : []);
        return (
          <>
            <div className="col-span-full">
              <label className="block text-sm font-bold text-accent-deep mb-2">รูปภาพในอัลบั้ม</label>
              <MultiImageUpload 
                values={currentImages} 
                onChange={(newImages) => setFormData({
                  ...formData, 
                  images: newImages,
                  url: newImages[0] || '',
                  count: newImages.length
                })} 
                onUploadingStateChange={(isUploading) => setFormData(prev => ({
                  ...prev,
                  isUploading
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B3022] mb-1">ชื่ออัลบั้มกิจกรรม</label>
              <input 
                type="text" required value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white text-stone-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1B3022]">หมวดหมู่</label>
              <input 
                type="text" required value={formData.category || ''}
                onChange={e => setFormData({...formData, category: e.target.value})}
                placeholder="พิมพ์หมวดหมู่ หรือกดเลือกด้านล่าง"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white text-stone-800"
              />
              {allCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {allCategories.map(cat => (
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
              )}
            </div>
          </>
        );
      }}
    />
  );
}
