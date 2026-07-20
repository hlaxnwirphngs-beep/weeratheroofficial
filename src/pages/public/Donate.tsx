import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, CheckCircle2, QrCode, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const getBankLogoUrl = (name: string): string => {
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
};

const getBankColor = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('กรุงเทพ') || n.includes('bbl')) return 'bg-blue-600';
  if (n.includes('กสิกร') || n.includes('kbank')) return 'bg-green-600';
  if (n.includes('ไทยพาณิชย์') || n.includes('scb')) return 'bg-purple-600';
  if (n.includes('กรุงไทย') || n.includes('ktb')) return 'bg-sky-500';
  if (n.includes('ทหารไทย') || n.includes('ttb') || n.includes('tmb')) return 'bg-orange-500';
  if (n.includes('ออมสิน') || n.includes('gsb')) return 'bg-pink-500';
  if (n.includes('กรุงศรี') || n.includes('bay') || n.includes('ayudhya')) return 'bg-yellow-500';
  if (n.includes('เกษตร') || n.includes('baac') || n.includes('ธ.ก.ส') || n.includes('ธกส')) return 'bg-emerald-700';
  if (n.includes('ยูโอบี') || n.includes('uob')) return 'bg-indigo-900';
  if (n.includes('ซีไอเอ็มบี') || n.includes('cimb')) return 'bg-red-700';
  return 'bg-stone-500';
};

export default function Donate() {
  const [copied, setCopied] = useState(false);
  const { addItem, settings = [] } = useStore();

  const bankName = settings.find(s => s.key === 'Donation Bank')?.value || 'ธนาคารกรุงเทพ';
  const bankBranch = settings.find(s => s.key === 'Donation Branch')?.value || 'สาขา โพธิ์ชัย';
  const accountName = settings.find(s => s.key === 'Donation Account Name')?.value || 'วัดดอนสว่างธรรมเจริญศรัทธา';
  const accountNo = settings.find(s => s.key === 'Donation Account No')?.value || '123-4-56789-0';
  const qrCodeImg = settings.find(s => s.key === 'Donation QR Code')?.value || '';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    amount: '',
    date: '',
    slipImage: '',
    wantsCertificate: false,
    email: ''
  });

  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; amount?: string; date?: string; slipImage?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageResult = reader.result as string;
        setFormData({ ...formData, slipImage: imageResult });
        // Clear file error if it was set
        if (errors.slipImage) {
          setErrors(prev => ({ ...prev, slipImage: undefined }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: 'firstName' | 'lastName' | 'amount' | 'date' | 'email', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific error as soon as user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleWantsCertificateChange = (value: boolean) => {
    setFormData(prev => ({ ...prev, wantsCertificate: value }));
    if (!value) {
      setFormData(prev => ({ ...prev, email: '' }));
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validations
    const newErrors: { firstName?: string; lastName?: string; amount?: string; date?: string; slipImage?: string; email?: string } = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'กรุณากรอกชื่อ';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'กรุณากรอกนามสกุล';
    }
    
    if (!formData.amount.trim()) {
      newErrors.amount = 'กรุณาระบุจำนวนเงินทำบุญ';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'กรุณาระบุจำนวนเงินทำบุญที่ถูกต้องและมากกว่า 0 บาท';
    }
    
    if (!formData.date) {
      newErrors.date = 'กรุณาเลือกวันที่โอนเงิน';
    }
    
    if (formData.wantsCertificate) {
      if (!formData.email.trim()) {
        newErrors.email = 'กรุณากรอกอีเมลสำหรับการจัดส่งใบอนุโมทนาบัตร';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'กรุณากรอกรูปแบบอีเมลที่ถูกต้อง';
      }
    }
    
    if (!formData.slipImage) {
      newErrors.slipImage = 'กรุณาแนบภาพสลิปหลักฐานการโอนเงิน';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulated network state for excellent UX feedback
    setTimeout(() => {
      addItem('donations', {
        id: Date.now(),
        donorName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        amount: formData.amount,
        date: formData.date,
        slipImage: formData.slipImage,
        wantsCertificate: formData.wantsCertificate,
        email: formData.wantsCertificate ? formData.email : '',
        status: 'Pending'
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ firstName: '', lastName: '', amount: '', date: '', slipImage: '', wantsCertificate: false, email: '' });
    }, 850);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-base pt-20">
      {/* Page Header */}
      <section className="relative py-20 md:py-28 text-center px-4 overflow-hidden bg-[#7C8577]">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/temple_hero.jpg" 
            alt="Temple Background" 
            className="w-full h-full object-cover opacity-35 filter brightness-90 contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B3022]/40 via-transparent to-[#1B3022]/20" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">ร่วมทำบุญ</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-sm md:text-base font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
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
              <div className="flex items-center gap-4 mb-6">
                {getBankLogoUrl(bankName) ? (
                  <div className={`w-16 h-16 ${getBankColor(bankName)} border border-stone-200/60 rounded-2xl flex items-center justify-center p-2 shrink-0 shadow-sm overflow-hidden`}>
                    <img 
                      src={getBankLogoUrl(bankName)} 
                      alt={bankName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain" 
                    />
                  </div>
                ) : (
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg text-white border shadow-sm shrink-0 ${
                    bankName.includes('กสิกร') ? 'bg-green-600 border-green-700' :
                    bankName.includes('ไทยพาณิชย์') ? 'bg-purple-600 border-purple-700' :
                    bankName.includes('กรุงไทย') ? 'bg-sky-500 border-sky-600' :
                    bankName.includes('ออมสิน') ? 'bg-pink-500 border-pink-600' :
                    bankName.includes('ทหารไทย') || bankName.includes('ttb') ? 'bg-orange-500 border-orange-600' :
                    bankName.includes('กรุงศรี') ? 'bg-yellow-500 border-yellow-600 text-stone-900' :
                    'bg-blue-600 border-blue-700'
                  }`}>
                    {bankName.includes('กสิกร') ? 'KBANK' :
                     bankName.includes('ไทยพาณิชย์') ? 'SCB' :
                     bankName.includes('กรุงไทย') ? 'KTB' :
                     bankName.includes('ออมสิน') ? 'GSB' :
                     bankName.includes('ทหารไทย') || bankName.includes('ttb') ? 'TTB' :
                     bankName.includes('กรุงศรี') ? 'BAY' :
                     'BBL'}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-accent-deep">{bankName}</h2>
                  <p className="text-stone-500 text-xs sm:text-sm">{bankBranch}</p>
                </div>
              </div>
              
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 mb-6">
                <p className="text-sm text-stone-500 mb-1">ชื่อบัญชี</p>
                <p className="font-bold text-lg text-accent-deep">{accountName}</p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 mb-8 flex justify-between items-center">
                <div>
                  <p className="text-sm text-stone-500 mb-1">เลขที่บัญชี</p>
                  <p className="font-mono font-bold text-xl text-accent-deep tracking-wider">{accountNo}</p>
                </div>
                <button 
                  onClick={handleCopy}
                  className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:text-accent-gold transition-colors cursor-pointer"
                  title="คัดลอกเลขบัญชี"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-stone-500 mb-2">หรือสแกน QR Code (PromptPay)</p>
                <div className="inline-block p-4 bg-white border border-stone-200 rounded-2xl shadow-xs">
                  {qrCodeImg ? (
                    <img 
                      src={qrCodeImg} 
                      alt="PromptPay QR Code" 
                      referrerPolicy="no-referrer"
                      className="w-40 h-40 object-contain mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-stone-100 flex flex-col items-center justify-center border border-stone-200 rounded-xl border-dashed gap-2">
                      <QrCode className="w-10 h-10 text-stone-300" />
                      <span className="text-[10px] text-stone-400 font-semibold">แสกนเพื่อทำบุญ</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notification Form */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-sep luxury-shadow overflow-hidden relative">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="text-center py-10 px-4 flex flex-col items-center justify-center h-full min-h-[400px]"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
                      className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 border border-green-100/80 shadow-inner"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-accent-deep mb-3 font-serif">แจ้งโอนเงินสำเร็จ</h3>
                    <p className="text-stone-600 text-sm max-w-sm mb-8 leading-relaxed font-sans">
                      ส่งข้อมูลแจ้งโอนเงินเรียบร้อยแล้ว ทางวัดจะดำเนินการตรวจสอบความถูกต้อง ขออนุโมทนาบุญกับท่านมา ณ โอกาสนี้ด้วยครับ
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-3 bg-accent-deep hover:bg-stone-800 text-white rounded-2xl text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 duration-200"
                    >
                      แจ้งร่วมทำบุญเพิ่มเติม
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-accent-deep mb-2 font-serif">แจ้งการโอนเงิน</h3>
                    <p className="text-sm text-stone-600 mb-6 font-sans">
                      กรุณากรอกข้อมูลเพื่อแจ้งการโอนเงิน ทางวัดจะดำเนินการออกใบอนุโมทนาบัตรให้ท่าน (ถ้าต้องการ)
                    </p>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5 font-sans">ชื่อ</label>
                          <input 
                            type="text" 
                            value={formData.firstName} 
                            onChange={e => handleInputChange('firstName', e.target.value)} 
                            placeholder="เช่น สมชาย"
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all duration-250 font-sans text-sm ${
                              errors.firstName 
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-100/80 bg-red-50/5' 
                                : 'border-stone-200 focus:border-accent-gold/60 focus:ring-accent-gold/20'
                            }`} 
                          />
                          <AnimatePresence>
                            {errors.firstName && (
                              <motion.p
                                initial={{ opacity: 0, height: 0, y: -5 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-2 overflow-hidden"
                              >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.firstName}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5 font-sans">นามสกุล</label>
                          <input 
                            type="text" 
                            value={formData.lastName} 
                            onChange={e => handleInputChange('lastName', e.target.value)} 
                            placeholder="เช่น ใจดี"
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all duration-250 font-sans text-sm ${
                              errors.lastName 
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-100/80 bg-red-50/5' 
                                : 'border-stone-200 focus:border-accent-gold/60 focus:ring-accent-gold/20'
                            }`} 
                          />
                          <AnimatePresence>
                            {errors.lastName && (
                              <motion.p
                                initial={{ opacity: 0, height: 0, y: -5 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-2 overflow-hidden"
                              >
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.lastName}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5 font-sans">จำนวนเงิน (บาท)</label>
                        <input 
                          type="number" 
                          value={formData.amount} 
                          onChange={e => handleInputChange('amount', e.target.value)} 
                          placeholder="ระบุจำนวนเงินอื่นๆ (เช่น 1500)"
                          className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all duration-250 font-sans text-sm ${
                            errors.amount 
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100/80 bg-red-50/5' 
                              : 'border-stone-200 focus:border-accent-gold/60 focus:ring-accent-gold/20'
                          }`} 
                        />
                        <div className="grid grid-cols-5 gap-2 mt-3">
                          {[20, 50, 100, 500, 1000].map(amt => (
                            <button
                              type="button"
                              key={amt}
                              onClick={() => handleInputChange('amount', amt.toString())}
                              className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                                formData.amount === amt.toString()
                                  ? 'bg-accent-gold/10 border-accent-gold text-accent-deep'
                                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                              }`}
                            >
                              {amt}
                            </button>
                          ))}
                        </div>
                        <AnimatePresence>
                          {errors.amount && (
                            <motion.p
                              initial={{ opacity: 0, height: 0, y: -5 }}
                              animate={{ opacity: 1, height: 'auto', y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-2 overflow-hidden"
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{errors.amount}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5 font-sans">วันที่โอน</label>
                        <input 
                          type="date" 
                          value={formData.date} 
                          onChange={e => handleInputChange('date', e.target.value)} 
                          className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all duration-250 font-sans text-sm ${
                            errors.date 
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100/80 bg-red-50/5' 
                              : 'border-stone-200 focus:border-accent-gold/60 focus:ring-accent-gold/20'
                          }`} 
                        />
                        <AnimatePresence>
                          {errors.date && (
                            <motion.p
                              initial={{ opacity: 0, height: 0, y: -5 }}
                              animate={{ opacity: 1, height: 'auto', y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-2 overflow-hidden"
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{errors.date}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Tax Deduction Certificate Toggle Option */}
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2 font-sans">
                          ต้องการรับใบอนุโมทนาบัตรเพื่อลดหย่อนภาษีหรือไม่?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleWantsCertificateChange(true)}
                            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border duration-200 flex items-center justify-center gap-2 ${
                              formData.wantsCertificate
                                ? 'bg-accent-gold/10 border-accent-gold text-accent-deep shadow-sm'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white hover:border-stone-300'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${formData.wantsCertificate ? 'bg-accent-gold animate-pulse' : 'bg-stone-300'}`} />
                            ต้องการรับ
                          </button>
                          <button
                            type="button"
                            onClick={() => handleWantsCertificateChange(false)}
                            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border duration-200 flex items-center justify-center gap-2 ${
                              !formData.wantsCertificate
                                ? 'bg-stone-100 border-stone-300 text-stone-800 shadow-sm'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white hover:border-stone-300'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${!formData.wantsCertificate ? 'bg-stone-600' : 'bg-stone-300'}`} />
                            ไม่รับ
                          </button>
                        </div>
                      </div>

                      {/* Email Input Field with Smooth Animation */}
                      <AnimatePresence>
                        {formData.wantsCertificate && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pt-1">
                              <label className="block text-sm font-medium text-stone-700 mb-1.5 font-sans">อีเมลสำหรับจัดส่งใบอนุโมทนาบัตร</label>
                              <input 
                                type="email" 
                                value={formData.email} 
                                onChange={e => handleInputChange('email', e.target.value)} 
                                placeholder="เช่น merit@example.com"
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all duration-250 font-sans text-sm ${
                                  errors.email 
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100/80 bg-red-50/5' 
                                    : 'border-stone-200 focus:border-accent-gold/60 focus:ring-accent-gold/20'
                                }`} 
                              />
                              <AnimatePresence>
                                {errors.email && (
                                  <motion.p
                                    initial={{ opacity: 0, height: 0, y: -5 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-2 overflow-hidden"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.email}</span>
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5 font-sans">แนบสลิปการโอนเงิน</label>
                        
                        {formData.slipImage ? (
                          <div className="relative mt-2 rounded-2xl overflow-hidden border border-stone-200 shadow-sm group bg-stone-50/50 flex justify-center items-center min-h-[160px]">
                            <img src={formData.slipImage} alt="Slip Preview" className="w-full h-auto max-h-96 object-contain rounded-xl" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center">
                              <button 
                                type="button" 
                                onClick={() => setFormData({...formData, slipImage: ''})} 
                                className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2 text-xs font-semibold transition-colors shadow-md"
                              >
                                เปลี่ยนรูปภาพ
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-250 bg-stone-50/50 hover:bg-white ${
                              errors.slipImage 
                                ? 'border-red-400 bg-red-50/5 hover:border-red-500' 
                                : 'border-stone-300 hover:border-accent-gold/70'
                            }`}
                          >
                            <Upload className={`w-7 h-7 mb-1.5 transition-colors duration-250 ${errors.slipImage ? 'text-red-400' : 'text-stone-400'}`} />
                            <span className={`text-xs font-medium transition-colors duration-250 ${errors.slipImage ? 'text-red-500' : 'text-stone-500'}`}>
                              คลิกเพื่ออัปโหลดสลิป
                            </span>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        
                        <AnimatePresence>
                          {errors.slipImage && (
                            <motion.p
                              initial={{ opacity: 0, height: 0, y: -5 }}
                              animate={{ opacity: 1, height: 'auto', y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-2 overflow-hidden"
                            >
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{errors.slipImage}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full py-3.5 bg-accent-deep hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-xl font-bold text-sm tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 duration-200"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>กำลังส่งข้อมูล...</span>
                            </>
                          ) : (
                            <span>ส่งข้อมูลแจ้งโอนเงิน</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
