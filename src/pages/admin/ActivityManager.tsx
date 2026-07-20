import { Calendar, Clock } from 'lucide-react';
import GenericCRUD from '../../components/admin/GenericCRUD';
import { useStore } from '../../store/useStore';

export default function ActivityManager() {
  const { activities = [], updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { key: 'name', label: 'ชื่อกิจกรรม' },
    { key: 'type', label: 'ประเภท' },
    { key: 'date', label: 'วันที่' },
    { key: 'time', label: 'เวลา' },
  ];

  // Unique types from existing data combined with defaults
  const existingTypes = Array.from(new Set(activities.map(a => a.type).filter(Boolean)));
  const defaultTypes = ['งานบุญประเพณี', 'ปฏิบัติธรรม', 'กิจกรรมทั่วไป'];
  const allTypes = Array.from(new Set([...defaultTypes, ...existingTypes]));

  return (
    <GenericCRUD
      title="จัดการกิจกรรม"
      description="จัดการปฏิทินกิจกรรมและงานบุญต่างๆ"
      columns={columns}
      data={activities}
      onSave={(data) => {
        if (activities.find(a => a.id === data.id)) {
           updateItem('activities', data);
        } else {
           addItem('activities', data);
        }
      }}
      onDelete={(row) => {
        deleteItem('activities', row.id);
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ชื่อกิจกรรม</label>
            <input 
              type="text" required value={formData.name || ''}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white text-stone-800"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#1B3022]">ประเภทกิจกรรม</label>
            <input 
              type="text" required value={formData.type || ''}
              onChange={e => setFormData({...formData, type: e.target.value})}
              placeholder="พิมพ์ประเภท หรือกดเลือกด้านล่าง"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white text-stone-800"
            />
            {allTypes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {allTypes.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({...formData, type: t})}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      formData.type === t
                        ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#1B3022] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              วันที่จัดกิจกรรม
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
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#1B3022] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              เวลาจัดกิจกรรม
            </label>
            <div className="relative">
              <input 
                type="time" required value={formData.time || ''}
                onChange={e => setFormData({...formData, time: e.target.value})}
                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white text-stone-800 text-sm font-medium"
              />
              <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5 items-center">
              <span className="text-[10px] text-stone-400">ปุ่มลัดเวลา:</span>
              {['07:00', '09:00', '13:00', '18:00'].map(timeStr => (
                <button
                  key={timeStr}
                  type="button"
                  onClick={() => setFormData({...formData, time: timeStr})}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                    formData.time === timeStr
                      ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {timeStr} น.
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    />
  );
}
