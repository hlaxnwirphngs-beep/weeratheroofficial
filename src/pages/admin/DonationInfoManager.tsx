import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { 
  CreditCard, CheckCircle, Save, QrCode, Upload, HelpCircle, 
  Trash2, Building2, Landmark, AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

const COMMON_BANKS = [
  { code: 'BBL', name: 'ธนาคารกรุงเทพ', color: 'bg-blue-600', textColor: 'text-white' },
  { code: 'KBANK', name: 'ธนาคารกสิกรไทย', color: 'bg-green-600', textColor: 'text-white' },
  { code: 'SCB', name: 'ธนาคารไทยพาณิชย์', color: 'bg-purple-600', textColor: 'text-white' },
  { code: 'KTB', name: 'ธนาคารกรุงไทย', color: 'bg-sky-500', textColor: 'text-white' },
  { code: 'TTB', name: 'ธนาคารทหารไทยธนชาต', color: 'bg-orange-500', textColor: 'text-white' },
  { code: 'GSB', name: 'ธนาคารออมสิน', color: 'bg-pink-500', textColor: 'text-white' },
  { code: 'BAY', name: 'ธนาคารกรุงศรีอยุธยา', color: 'bg-yellow-500', textColor: 'text-stone-900' },
  { code: 'BAAC', name: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)', color: 'bg-emerald-700', textColor: 'text-white' },
];

export function getBankLogoUrl(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('กรุงเทพ') || n.includes('bbl')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/bbl.svg';
  if (n.includes('กสิกร') || n.includes('kbank')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/kbank.svg';
  if (n.includes('ไทยพาณิชย์') || n.includes('scb')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/scb.svg';
  if (n.includes('กรุงไทย') || n.includes('ktb')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/ktb.svg';
  if (n.includes('ทหารไทย') || n.includes('ttb') || n.includes('tmb')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/ttb.svg';
  if (n.includes('ออมสิน') || n.includes('gsb')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/gsb.svg';
  if (n.includes('กรุงศรี') || n.includes('bay') || n.includes('ayudhya')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/bay.svg';
  if (n.includes('เกษตร') || n.includes('baac') || n.includes('ธ.ก.ส') || n.includes('ธกส')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/baac.svg';
  if (n.includes('ยูโอบี') || n.includes('uob')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/uob.svg';
  if (n.includes('ซีไอเอ็มบี') || n.includes('cimb')) return 'https://cdn.jsdelivr.net/gh/omise/banks-logo@master/th/cimb.svg';
  return '';
}

export default function DonationInfoManager() {
  const { settings = [], updateItem, addItem } = useStore();

  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [qrCode, setQrCode] = useState('');
  
  const [errors, setErrors] = useState<{ bankName?: string; accountName?: string; accountNo?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial settings
  useEffect(() => {
    const bankObj = settings.find(s => s.key === 'Donation Bank');
    const branchObj = settings.find(s => s.key === 'Donation Branch');
    const accNameObj = settings.find(s => s.key === 'Donation Account Name');
    const accNoObj = settings.find(s => s.key === 'Donation Account No');
    const qrObj = settings.find(s => s.key === 'Donation QR Code');

    if (bankObj) setBankName(bankObj.value);
    if (branchObj) setBankBranch(branchObj.value);
    if (accNameObj) setAccountName(accNameObj.value);
    if (accNoObj) setAccountNo(accNoObj.value);
    if (qrObj) setQrCode(qrObj.value);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!bankName.trim()) {
      newErrors.bankName = 'กรุณาระบุชื่อธนาคาร';
    }
    if (!accountName.trim()) {
      newErrors.accountName = 'กรุณาระบุชื่อบัญชี';
    }
    if (!accountNo.trim()) {
      newErrors.accountNo = 'กรุณาระบุเลขที่บัญชี';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    const finalBranch = bankBranch.trim() === '' ? 'สาขา โพธิ์ชัย' : bankBranch;
    setBankBranch(finalBranch);

    const saveSetting = (key: string, value: string, id: number) => {
      const existing = settings.find(s => s.key === key);
      if (existing) {
        updateItem('settings', { ...existing, value });
      } else {
        addItem('settings', { id, key, value });
      }
    };

    saveSetting('Donation Bank', bankName, 5);
    saveSetting('Donation Branch', finalBranch, 6);
    saveSetting('Donation Account Name', accountName, 7);
    saveSetting('Donation Account No', accountNo, 8);
    saveSetting('Donation QR Code', qrCode, 9);

    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrCode(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const selectBank = (bank: string) => {
    setBankName(bank);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1B3022]">จัดการข้อมูลบัญชีทำบุญ</h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          แก้ไขข้อมูลบัญชีธนาคาร ชื่อบัญชี และ QR Code สำหรับผู้มีจิตศรัทธาร่วมทำบุญบำรุงวัด
        </p>
      </div>

      {/* Success Banner */}
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm font-bold">บันทึกข้อมูลการร่วมทำบุญเรียบร้อยแล้ว ข้อมูลจะอัพเดททันทีในหน้าบริจาคของวัด</span>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bank Form Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/60 luxury-shadow p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-[#1B3022] border-b border-stone-100 pb-3 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#C5A059]" />
              รายละเอียดบัญชีธนาคาร
            </h2>

            {/* Common Banks Selectors */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">เลือกธนาคารยอดนิยม</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COMMON_BANKS.map((b) => {
                  const isSelected = bankName === b.name;
                  const logoUrl = getBankLogoUrl(b.name);
                  return (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => selectBank(b.name)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
                        isSelected 
                          ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#8B7355] ring-2 ring-[#C5A059]/20'
                          : 'border-stone-200 bg-stone-50/50 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${b.color} p-1 flex items-center justify-center border border-stone-200/40 shadow-2xs overflow-hidden`}>
                        <img 
                          src={logoUrl} 
                          alt={b.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="truncate max-w-full text-[10px]">{b.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bank Name Input */}
            <div className="space-y-1.5" id="bankName">
              <label className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C5A059]" />
                ชื่อธนาคาร (กรณีไม่มีในรายการด้านบน)
              </label>
              <input
                type="text"
                value={bankName}
                onChange={e => {
                  setBankName(e.target.value);
                  if (e.target.value.trim() && errors.bankName) {
                    setErrors(prev => ({ ...prev, bankName: undefined }));
                  }
                }}
                placeholder="ระบุชื่อธนาคาร เช่น ธนาคารกรุงเทพ, ธนาคารกสิกรไทย"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] bg-stone-50/50 text-stone-800 font-medium transition-all ${
                  errors.bankName ? 'border-red-300 ring-2 ring-red-500/20 bg-red-50/20' : 'border-stone-200'
                }`}
              />
              {errors.bankName && (
                <span className="text-xs text-red-600 font-bold block mt-1">{errors.bankName}</span>
              )}
            </div>

            {/* Bank Branch */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C5A059]" />
                สาขาธนาคาร
              </label>
              <input
                type="text"
                value={bankBranch}
                onChange={e => setBankBranch(e.target.value)}
                placeholder="เว้นว่างไว้จะใส่ 'สาขา โพธิ์ชัย' อัตโนมัติ"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] bg-stone-50/50 text-stone-800 font-medium transition-all"
              />
              <span className="text-[11px] text-[#C5A059] block font-medium">หากเว้นว่างไว้ ระบบจะระบุเป็น 'สาขา โพธิ์ชัย' ให้อัตโนมัติเมื่อบันทึก</span>
            </div>

            {/* Account Name */}
            <div className="space-y-1.5" id="accountName">
              <label className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#C5A059]" />
                ชื่อบัญชี
              </label>
              <input
                type="text"
                value={accountName}
                onChange={e => {
                  setAccountName(e.target.value);
                  if (e.target.value.trim() && errors.accountName) {
                    setErrors(prev => ({ ...prev, accountName: undefined }));
                  }
                }}
                placeholder="ระบุชื่อบัญชีทางการของวัด"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] bg-stone-50/50 text-stone-800 font-medium transition-all ${
                  errors.accountName ? 'border-red-300 ring-2 ring-red-500/20 bg-red-50/20' : 'border-stone-200'
                }`}
              />
              {errors.accountName && (
                <span className="text-xs text-red-600 font-bold block mt-1">{errors.accountName}</span>
              )}
              <span className="text-[11px] text-stone-400 block">ควรเป็นบัญชีออมทรัพย์ที่ผูกในชื่อวัดอย่างเป็นทางการ</span>
            </div>

            {/* Account Number */}
            <div className="space-y-1.5" id="accountNo">
              <label className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#C5A059]" />
                เลขที่บัญชี
              </label>
              <input
                type="text"
                value={accountNo}
                onChange={e => {
                  setAccountNo(e.target.value);
                  if (e.target.value.trim() && errors.accountNo) {
                    setErrors(prev => ({ ...prev, accountNo: undefined }));
                  }
                }}
                placeholder="เช่น 123-4-56789-0"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] bg-stone-50/50 text-stone-800 font-mono tracking-wider font-bold transition-all ${
                  errors.accountNo ? 'border-red-300 ring-2 ring-red-500/20 bg-red-50/20' : 'border-stone-200'
                }`}
              />
              {errors.accountNo && (
                <span className="text-xs text-red-600 font-bold block mt-1">{errors.accountNo}</span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3.5 bg-accent-deep hover:bg-[#2C4A35] text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              บันทึกข้อมูลทั้งหมด
            </button>
          </div>
        </div>

        {/* Right Column: QR Code & Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* QR Code Upload */}
          <div className="bg-white rounded-3xl border border-stone-200/60 luxury-shadow p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#1B3022] border-b border-stone-100 pb-3 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#C5A059]" />
              รูปภาพ QR Code / PromptPay
            </h2>

            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 min-h-[180px] ${
                dragActive 
                  ? 'border-[#C5A059] bg-[#C5A059]/5' 
                  : qrCode 
                    ? 'border-stone-200 bg-stone-50/20' 
                    : 'border-stone-200 hover:border-[#C5A059]/60 hover:bg-stone-50/50'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />

              {qrCode ? (
                <div className="relative group/qr">
                  <img src={qrCode} alt="QR Code" className="w-36 h-36 object-contain rounded-lg border border-stone-200/60 bg-white p-1" />
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="p-1.5 bg-white text-stone-700 hover:text-[#C5A059] rounded-lg transition-colors shadow-md text-xs font-bold"
                    >
                      เปลี่ยนรูป
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQrCode('');
                      }}
                      className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                      title="ลบรูป"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-700">อัพโหลดรูปภาพ QR Code</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์รูปภาพ</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-3 flex gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                แนะนำให้อัพโหลดรูป QR Code พร้อมเพย์ (PromptPay) ที่สร้างขึ้นมาโดยระบุหมายเลขทะเบียนวัด หรือเลขผู้เสียภาษี เพื่อให้ญาติโยมสแกนทำบุญได้สะดวก
              </p>
            </div>
          </div>

          {/* Live Mobile Device Mockup Preview */}
          <div className="bg-stone-950 text-white rounded-[32px] p-4 shadow-xl border-4 border-stone-800 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-4 flex justify-center">
              <div className="w-20 h-3 bg-stone-800 rounded-b-lg" />
            </div>
            
            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-3 text-center border-b border-stone-800 pb-2 pt-2 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              การแสดงผลสดบนหน้าเว็บพับลิก
            </div>

            {/* public donation page preview card */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 text-stone-800 space-y-4">
              <div className="flex items-center gap-3">
                {getBankLogoUrl(bankName) ? (
                  <div className="w-10 h-10 bg-white border border-stone-200 rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    <img 
                      src={getBankLogoUrl(bankName)} 
                      alt={bankName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain" 
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 shrink-0 font-bold text-xs">
                    BANK
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-bold text-stone-800">{bankName || 'ธนาคารกรุงเทพ'}</h3>
                  <p className="text-[9px] text-stone-400 font-medium">{bankBranch || 'สาขา โพธิ์ชัย'}</p>
                </div>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[10px] space-y-0.5">
                <span className="text-[9px] text-stone-400">ชื่อบัญชี</span>
                <p className="font-bold text-stone-800 truncate">{accountName || 'วัดดอนสว่างธรรมเจริญศรัทธา'}</p>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[10px] flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-stone-400">เลขที่บัญชี</span>
                  <p className="font-mono font-bold text-stone-800 tracking-wider">{accountNo || '123-4-56789-0'}</p>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-stone-100">
                <p className="text-[9px] text-stone-400 mb-1.5">หรือสแกน QR Code (PromptPay)</p>
                <div className="inline-block p-2 bg-white border border-stone-200 rounded-xl">
                  {qrCode ? (
                    <img src={qrCode} alt="Preview QR" className="w-20 h-20 object-contain mx-auto" />
                  ) : (
                    <div className="w-20 h-20 bg-stone-50 flex items-center justify-center border border-stone-200 rounded-lg border-dashed">
                      <QrCode className="w-6 h-6 text-stone-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
