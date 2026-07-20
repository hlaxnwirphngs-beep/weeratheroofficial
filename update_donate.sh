cat << 'INNER_EOF' > src/pages/public/Donate.tsx
import { motion } from 'motion/react';
import { Copy, CheckCircle2, QrCode, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';

export default function Donate() {
  const [copied, setCopied] = useState(false);
  const { addItem } = useStore();
  
  const [formData, setFormData] = useState({
    donorName: '',
    amount: '',
    date: '',
    slipImage: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText("123-4-56789-0");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, slipImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem('donations', {
      id: Date.now(),
      donorName: formData.donorName,
      amount: formData.amount,
      date: formData.date,
      slipImage: formData.slipImage,
      status: 'Pending'
    });
    alert('ส่งข้อมูลแจ้งโอนเงินเรียบร้อยแล้ว ขออนุโมทนาบุญด้วยครับ');
    setFormData({ donorName: '', amount: '', date: '', slipImage: '' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-base pt-20">
      {/* Page Header */}
      <section className="bg-[#7C8577] py-16 md:py-24 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">ร่วมทำบุญ</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base">
            ขอเชิญผู้มีจิตศรัทธาร่วมทำบุญบำรุงวัดดอนสว่างธรรมเจริญศรัทธา
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Bank Details */}
            <div className="bg-white rounded-3xl p-8 md:p-10 luxury-shadow border border-sep">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 border border-blue-100">
                <span className="font-bold text-2xl">BBL</span>
              </div>
              <h2 className="text-xl font-bold text-accent-deep mb-2">ธนาคารกรุงเทพ</h2>
              <p className="text-stone-500 text-sm mb-6">สาขา โพธิ์ชัย</p>
              
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 mb-6">
                <p className="text-sm text-stone-500 mb-1">ชื่อบัญชี</p>
                <p className="font-bold text-lg text-accent-deep">วัดดอนสว่างธรรมเจริญศรัทธา</p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 mb-8 flex justify-between items-center">
                <div>
                  <p className="text-sm text-stone-500 mb-1">เลขที่บัญชี</p>
                  <p className="font-mono font-bold text-xl text-accent-deep tracking-wider">123-4-56789-0</p>
                </div>
                <button 
                  onClick={handleCopy}
                  className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:text-accent-gold transition-colors"
                  title="คัดลอกเลขบัญชี"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-stone-500 mb-2">หรือสแกน QR Code (PromptPay)</p>
                <div className="inline-block p-4 bg-white border border-stone-200 rounded-2xl">
                  {/* Placeholder for QR Code */}
                  <div className="w-40 h-40 bg-stone-100 flex items-center justify-center border border-stone-200 rounded-xl border-dashed">
                    <QrCode className="w-12 h-12 text-stone-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Form */}
            <div className="bg-bg-base rounded-3xl p-8 md:p-10 border border-sep">
              <h3 className="text-xl font-bold text-accent-deep mb-6">แจ้งการโอนเงิน</h3>
              <p className="text-sm text-stone-600 mb-6">
                กรุณากรอกข้อมูลเพื่อแจ้งการโอนเงิน ทางวัดจะดำเนินการออกใบอนุโมทนาบัตรให้ท่าน (ถ้าต้องการ)
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อ-นามสกุล</label>
                  <input type="text" required value={formData.donorName} onChange={e => setFormData({...formData, donorName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-gold/50" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">จำนวนเงิน (บาท)</label>
                  <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-gold/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">วันที่โอน</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-gold/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">แนบสลิปการโอนเงิน</label>
                  
                  {formData.slipImage ? (
                    <div className="relative mt-2">
                      <img src={formData.slipImage} alt="Slip Preview" className="w-full h-32 object-cover rounded-xl border border-stone-200" />
                      <button type="button" onClick={() => setFormData({...formData, slipImage: ''})} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-xs">ลบรูป</button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-gold hover:bg-white transition-colors bg-stone-50"
                    >
                      <Upload className="w-6 h-6 text-stone-400 mb-1" />
                      <span className="text-xs text-stone-500">คลิกเพื่ออัปโหลดสลิป</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-accent-deep hover:bg-stone-800 text-white rounded-xl font-bold uppercase tracking-wider transition-colors">
                    ส่งข้อมูล
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
INNER_EOF
