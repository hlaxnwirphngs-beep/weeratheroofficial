import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Privacy() {
  const { settings = [] } = useStore();
  
  const siteTitle = (settings || []).find(s => s.key === 'Site Title')?.value || 'วัดดอนสว่างธรรมเจริญศรัทธา';
  const siteEmail = (settings || []).find(s => s.key === 'Contact Email')?.value || 'weeratheroofficial@gmail.com';
  const sitePhone = (settings || []).find(s => s.key === 'Contact Phone')?.value || '02-xxx-xxxx';
  const siteAddress = (settings || []).find(s => s.key === 'Temple Address')?.value || 'วัดดอนสว่างธรรมเจริญศรัทธา\nหมู่ 5 ตำบลเชียงใหม่\nอำเภอโพธิ์ชัย จังหวัดร้อยเอ็ด 45230';

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-stone-200 rounded-3xl shadow-sm p-6 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-10 border-b border-stone-100 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/10 text-accent-gold mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif text-accent-deep font-bold mb-2">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p className="text-xs text-stone-500">
            ปรับปรุงล่าสุดเมื่อ: 17 กรกฎาคม 2569
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-stone max-w-none space-y-8 text-stone-600 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-accent-deep mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block"></span>
              1. คำชี้แจงความเป็นส่วนตัว
            </h2>
            <p>
              <strong>{siteTitle}</strong> ตระหนักและให้ความสำคัญอย่างยิ่งในการปกป้องข้อมูลส่วนบุคคลของผู้มีจิตศรัทธา ผู้เข้าชมเว็บไซต์ และพุทธศาสนิกชนทุกท่าน 
              นโยบายความเป็นส่วนตัวฉบับนี้จัดทำขึ้นเพื่อให้ท่านมั่นใจและเข้าใจหลักเกณฑ์ วิธีการ และมาตรการในการจัดเก็บข้อมูล การประมวลผล ตลอดจนสิทธิ์ต่างๆ ของท่านตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-accent-deep mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block"></span>
              2. ข้อมูลที่เราจัดเก็บและวัตถุประสงค์
            </h2>
            <p>
              ทางวัดอาจจัดเก็บรวบรวมข้อมูลส่วนบุคคลของท่านในบางกรณีเพื่อวัตถุประสงค์เฉพาะเจาะจง ดังต่อไปนี้:
            </p>
            <div className="mt-4 space-y-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <h3 className="font-bold text-accent-deep text-xs uppercase tracking-wider mb-1">ข้อมูลผู้บริจาค/ร่วมทำบุญ</h3>
                <p className="text-xs text-stone-600">
                  <strong>ข้อมูลที่จัดเก็บ:</strong> ชื่อ-นามสกุล, เบอร์โทรศัพท์, สลิปหลักฐานการโอนเงิน (Slip), และเลขประจำตัวผู้เสียภาษี (กรณีขอใบอนุโมทนาบัตร)<br/>
                  <strong>วัตถุประสงค์:</strong> ใช้สำหรับยืนยันยอดเงินบริจาค ตรวจสอบความถูกต้อง จัดการสถิติการทำบุญเพื่อความโปร่งใส และการออกเอกสารใบอนุโมทนาบัตร
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <h3 className="font-bold text-accent-deep text-xs uppercase tracking-wider mb-1">การลงทะเบียนปฏิบัติธรรม / ติดต่อสอบถาม</h3>
                <p className="text-xs text-stone-600">
                  <strong>ข้อมูลที่จัดเก็บ:</strong> ชื่อ, เบอร์โทรศัพท์, อีเมล, รายละเอียดข้อความคำถาม<br/>
                  <strong>วัตถุประสงค์:</strong> เพื่ออํานวยความสะดวกในการติดต่อกลับ ประสานงานเรื่องการลงทะเบียนปฏิบัติธรรม และตอบข้อซักถามในประเด็นต่างๆ ของท่าน
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-accent-deep mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block"></span>
              3. มาตรการรักษาความปลอดภัยของข้อมูล
            </h2>
            <p>
              {siteTitle}ใช้มาตรฐานการรักษาความปลอดภัยระดับสูงเพื่อปกป้องข้อมูลส่วนบุคคลของท่านไม่ให้สูญหาย ถูกเข้าถึง แก้ไข หรือเปิดเผยโดยมิชอบ:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>ใช้โปรโตคอลการเข้ารหัสข้อมูลที่ปลอดภัยในการรับ-ส่งข้อมูลผ่านเว็บไซต์ (HTTPS/SSL)</li>
              <li>จำกัดการเข้าถึงระบบข้อมูลส่วนหลัง (Dashboard) เฉพาะเจ้าหน้าที่วัดที่ได้รับอนุญาตและมีบทบาทโดยตรงเท่านั้น</li>
              <li>ไม่มีนโยบายการแบ่งปัน ขาย หรือเผยแพร่ข้อมูลผู้บริจาคไปให้แก่บุคคลภายนอกหรือหน่วยงานเชิงพาณิชย์ใดๆ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-accent-deep mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block"></span>
              4. สิทธิ์ของท่านในฐานะเจ้าของข้อมูลส่วนบุคคล
            </h2>
            <p>
              ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล ท่านมีสิทธิ์ในข้อมูลของท่านดังต่อไปนี้:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>สิทธิ์ในการขอดู เข้าถึง หรือขอรับสำเนาข้อมูลส่วนบุคคลของตนเอง</li>
              <li>สิทธิ์ในการขอให้แก้ไขข้อมูลให้ถูกต้องเป็นปัจจุบัน</li>
              <li>สิทธิ์ในการขอให้ลบหรือทำลายข้อมูลส่วนบุคคลของท่านในระบบของทางวัด</li>
              <li>สิทธิ์ในการเพิกถอนความยินยอมในการเก็บรวบรวมข้อมูล</li>
            </ul>
            <p className="mt-2">
              ท่านสามารถยื่นคำขอเกี่ยวกับสิทธิ์ของท่านมายังช่องทางการติดต่อของวัดเพื่อให้ดำเนินการตรวจสอบอย่างรวดเร็ว
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-accent-deep mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block"></span>
              5. ข้อมูลการติดต่อของหน่วยงานคุ้มครองข้อมูล
            </h2>
            <p>
              หากท่านมีข้อสงสัยหรือคำแนะนำใดๆ เกี่ยวกับนโยบายความเป็นส่วนตัวฉบับนี้ หรือต้องการใช้สิทธิ์ตามกฎหมายคุ้มครองข้อมูล กรุณาติดต่อทางวัดได้ที่:
            </p>
            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 mt-3 text-xs space-y-1">
              <p className="font-semibold text-accent-deep">ติดต่อสำนักงานวัด</p>
              <p className="whitespace-pre-line">ที่อยู่: {siteAddress}</p>
              <p>โทรศัพท์: {sitePhone}</p>
              <p>อีเมลเจ้าหน้าที่คุ้มครองข้อมูล: {siteEmail}</p>
            </div>
          </section>

        </div>

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent-gold" />
            <span>ความลับและความปลอดภัยทางพุทธศาสนสถานคือสิ่งสำคัญสูงสุดของเรา</span>
          </div>
          <div>
            &copy; {siteTitle}
          </div>
        </div>

      </div>
    </div>
  );
}
