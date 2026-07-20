cat << 'INNER_EOF' > src/pages/admin/DonationsManager.tsx
import GenericCRUD from '../../components/admin/GenericCRUD';
import { useStore } from '../../store/useStore';

export default function DonationsManager() {
  const { donations, updateItem, deleteItem, addItem } = useStore();

  const columns = [
    { key: 'donorName', label: 'ชื่อผู้บริจาค' },
    { key: 'amount', label: 'จำนวนเงิน', render: (row: any) => `${Number(row.amount || 0).toLocaleString()} บาท` },
    { key: 'date', label: 'วันที่โอน' },
    { key: 'status', label: 'สถานะ', render: (row: any) => (
       <span className={`px-2 py-1 text-xs font-bold rounded-md ${row.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
         {row.status || 'Pending'}
       </span>
    )},
  ];

  return (
    <GenericCRUD
      title="จัดการข้อมูลบริจาค"
      description="ตรวจสอบและจัดการรายการแจ้งโอนเงินทำบุญ"
      columns={columns}
      data={donations}
      onSave={(data) => {
        if (donations.find(a => a.id === data.id)) {
           updateItem('donations', data);
        } else {
           addItem('donations', data);
        }
      }}
      onDelete={(row) => {
        if (confirm(`ต้องการลบรายการของ ${row.donorName} หรือไม่?`)) {
          deleteItem('donations', row.id);
        }
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">ชื่อผู้บริจาค</label>
            <input type="text" required value={formData.donorName || ''} onChange={e => setFormData({...formData, donorName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">จำนวนเงิน (บาท)</label>
            <input type="number" required value={formData.amount || ''} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">วันที่โอน</label>
            <input type="date" required value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white" />
          </div>
          {formData.slipImage && (
            <div>
              <label className="block text-sm font-medium text-[#1B3022] mb-1">สลิปการโอนเงิน</label>
              <div className="w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img src={formData.slipImage} alt="Slip" className="w-full max-h-64 object-contain" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#1B3022] mb-1">สถานะ</label>
            <select value={formData.status || 'Pending'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white">
              <option value="Pending">รอตรวจสอบ</option>
              <option value="Approved">อนุมัติแล้ว</option>
            </select>
          </div>
        </>
      )}
    />
  );
}
INNER_EOF
