import { useState, useEffect } from 'react';
import { motion, animate } from 'motion/react';
import { Calendar, Clock, CheckCircle2, Coins } from 'lucide-react';
import GenericCRUD from '../../components/admin/GenericCRUD';
import MultiImageUpload from '../../components/ui/MultiImageUpload';
import { useStore } from '../../store/useStore';

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (val) => setCount(Math.floor(val)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export default function DonationsManager() {
  const { donations = [], updateItem, deleteItem, addItem } = useStore();
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved'>('Pending');

  // Stats calculation
  const pendingDonations = donations.filter(d => (d.status || 'Pending') === 'Pending');
  const approvedDonations = donations.filter(d => d.status === 'Approved');

  const totalPendingAmount = pendingDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalApprovedAmount = approvedDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const displayedDonations = activeTab === 'Pending' ? pendingDonations : approvedDonations;

  const columns = [
    { key: 'donorName', label: 'ชื่อผู้บริจาค' },
    { key: 'amount', label: 'จำนวนเงิน', render: (row: any) => `${Number(row.amount || 0).toLocaleString()} บาท` },
    { key: 'date', label: 'วันที่โอน' },
    {
      key: 'wantsCertificate',
      label: 'ใบอนุโมทนาบัตร',
      render: (row: any) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
          row.wantsCertificate 
            ? 'bg-amber-50 text-amber-800 border border-amber-200/50' 
            : 'bg-stone-50 text-stone-400 border border-stone-200/20'
        }`}>
          {row.wantsCertificate ? 'ต้องการรับ' : 'ไม่รับ'}
        </span>
      )
    },
    {
      key: 'email',
      label: 'อีเมลจัดส่ง',
      render: (row: any) => row.wantsCertificate ? (
        <span className="text-[#8B7355] font-semibold text-xs font-mono select-all bg-[#8B7355]/5 px-2 py-0.5 rounded border border-[#8B7355]/10">{row.email}</span>
      ) : (
        <span className="text-stone-300">-</span>
      )
    },
    { key: 'status', label: 'สถานะ', render: (row: any) => (
       <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${row.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
         {row.status === 'Approved' ? 'อนุมัติแล้ว' : 'รอตรวจสอบ'}
       </span>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: All */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#8B7355]">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">ยอดทำบุญรวมทั้งหมด</p>
            <p className="text-xl font-bold text-[#1B3022] mt-0.5"><AnimatedCounter value={totalPendingAmount + totalApprovedAmount} /> บาท</p>
            <p className="text-[11px] text-stone-500 font-medium">รวมทั้งหมด <AnimatedCounter value={donations.length} /> รายการ</p>
          </div>
        </div>

        {/* KPI 2: Pending */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">รอยืนยัน / รอตรวจสอบ</p>
            <p className="text-xl font-bold text-[#1B3022] mt-0.5"><AnimatedCounter value={totalPendingAmount} /> บาท</p>
            <p className="text-[11px] text-stone-500 font-medium">รอดำเนินการ <AnimatedCounter value={pendingDonations.length} /> รายการ</p>
          </div>
        </div>

        {/* KPI 3: Approved */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">อนุมัติแล้ว</p>
            <p className="text-xl font-bold text-[#1B3022] mt-0.5"><AnimatedCounter value={totalApprovedAmount} /> บาท</p>
            <p className="text-[11px] text-stone-500 font-medium">ทำบุญสำเร็จแล้ว <AnimatedCounter value={approvedDonations.length} /> รายการ</p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-stone-200 bg-stone-100 p-1 rounded-xl shadow-xs max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('Pending')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'Pending'
              ? 'bg-[#1B3022] text-white shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          รอตรวจสอบ (<AnimatedCounter value={pendingDonations.length} />)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('Approved')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'Approved'
              ? 'bg-[#1B3022] text-white shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          อนุมัติแล้ว (<AnimatedCounter value={approvedDonations.length} />)
        </button>
      </div>

      {/* GenericCRUD wrapped with selected tab state */}
      <GenericCRUD
        title={activeTab === 'Pending' ? 'รายการรอตรวจสอบ' : 'รายการที่อนุมัติแล้ว'}
        description={activeTab === 'Pending' ? 'กรุณาตรวจสอบรายละเอียดความถูกต้องและภาพสลิปก่อนทำการอนุมัติ' : 'รายการบริจาคที่ได้รับการอนุมัติและร่วมทำบุญเรียบร้อยแล้ว'}
        columns={columns}
        data={displayedDonations}
        onSave={(data) => {
          // Default status to active tab if not specified
          const donationData = {
            ...data,
            status: data.status || activeTab,
          };
          if (donations.find(a => a.id === data.id)) {
             updateItem('donations', donationData);
          } else {
             addItem('donations', donationData);
          }
        }}
        onDelete={(row) => {
          deleteItem('donations', row.id);
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
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1B3022] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                วันที่โอนเงินทำบุญ
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
                    d.setDate(d.getDate() - 1);
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const date = String(d.getDate()).padStart(2, '0');
                    setFormData({...formData, date: `${y}-${m}-${date}`});
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#8B7355]/10 text-[#8B7355] border border-[#8B7355]/20 hover:bg-[#8B7355]/20 transition-all cursor-pointer"
                >
                  📅 เมื่อวาน
                </button>
              </div>
            </div>
            <div className="pt-1">
              <label className="block text-sm font-medium text-[#1B3022] mb-2 font-sans">
                ความประสงค์รับใบอนุโมทนาบัตร
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wantsCertificate"
                    checked={!formData.wantsCertificate}
                    onChange={() => setFormData({ ...formData, wantsCertificate: false, email: '' })}
                    className="accent-[#1B3022]"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-stone-600">ไม่รับใบอนุโมทนาบัตร</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wantsCertificate"
                    checked={!!formData.wantsCertificate}
                    onChange={() => setFormData({ ...formData, wantsCertificate: true })}
                    className="accent-[#1B3022]"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-[#1B3022]">ต้องการรับใบอนุโมทนาบัตร</span>
                </label>
              </div>
            </div>
            {formData.wantsCertificate && (
              <div className="space-y-3 bg-[#C5A059]/5 border border-[#C5A059]/20 p-4 rounded-xl mt-2">
                <div>
                  <label className="block text-xs font-bold text-[#1B3022] mb-1">อีเมลผู้รับ</label>
                  <input
                    type="email"
                    required
                    placeholder="เช่น example@email.com"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 bg-white text-stone-800 text-xs sm:text-sm font-medium"
                  />
                </div>
                {formData.email && (
                  <button
                    type="button"
                    onClick={() => {
                      alert(`ระบบได้จำลองการส่งใบอนุโมทนาบัตรไปยังอีเมล ${formData.email || 'ผู้รับ'} เรียบร้อยแล้ว!`);
                    }}
                    className="w-full py-2.5 px-4 bg-[#1B3022] hover:bg-[#2C4A35] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    ✉️ ส่งใบอนุโมทนาบัตร
                  </button>
                )}
              </div>
            )}
            {/* Slip Image Upload */}
            <div>
              <label className="block text-sm font-medium text-[#1B3022] mb-2">สลิปการโอนเงิน</label>
              <MultiImageUpload
                values={formData.slipImage ? [formData.slipImage] : []}
                onChange={(newImages) => setFormData({ ...formData, slipImage: newImages[0] || '' })}
                onUploadingStateChange={(isUploading) => setFormData(prev => ({ ...prev, isUploading }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B3022] mb-2">สถานะ</label>
              <div className="flex bg-stone-100 p-1 rounded-xl relative border border-stone-200/50 w-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Pending' })}
                  className={`relative flex-1 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 rounded-lg focus:outline-none ${
                    (formData.status || 'Pending') === 'Pending'
                      ? 'text-yellow-800'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {(formData.status || 'Pending') === 'Pending' && (
                    <motion.div
                      layoutId="admin-donation-status-bg"
                      className="absolute inset-0 bg-yellow-50 rounded-lg shadow-sm border border-yellow-200/50"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${(formData.status || 'Pending') === 'Pending' ? 'bg-yellow-500 animate-pulse' : 'bg-stone-300'}`} />
                    รอตรวจสอบ
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Approved' })}
                  className={`relative flex-1 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 rounded-lg focus:outline-none ${
                    formData.status === 'Approved'
                      ? 'text-green-800'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {formData.status === 'Approved' && (
                    <motion.div
                      layoutId="admin-donation-status-bg"
                      className="absolute inset-0 bg-green-50 rounded-lg shadow-sm border border-green-200/50"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${formData.status === 'Approved' ? 'bg-green-500 animate-pulse' : 'bg-stone-300'}`} />
                    อนุมัติแล้ว
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      />
    </div>
  );
}
