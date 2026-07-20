import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShieldCheck } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white border border-stone-200 rounded-3xl shadow-sm p-6 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-10 border-b border-stone-100 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/10 text-accent-gold mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif text-accent-deep font-bold mb-2">
            ข้อกำหนดและเงื่อนไขการใช้งาน
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
              1. บทนำและข้อตกลงทั่วไป
            </h2>
            <p>
              ยินดีต้อนรับสู่เว็บไซต์อย่างเป็นทางการของ <strong>วัดดอนสว่างธรรมเจริญศรัทธา</strong> การเข้าถึงและการใช้งานเว็บไซต์นี้ 
              ถือว่าท่านได้ยอมรับข้อกำหนดและเงื่อนไขการใช้งานตามรายละเอียดที่ระบุไว้ในหน้านี้ทุกประการ หากท่านไม่ยอมรับเงื่อนไขเหล่านี้ 
              กรุณางดเว้นการใช้งานเว็บไซต์นี้
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-accent-deep mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block"></span>
              2. ข้อควรปฏิบัติในการเข้าใช้พื้นที่ศาสนสถาน
            </h2>
            <p>
              เพื่อรักษาความสงบเรียบร้อยและความศักดิ์สิทธิ์ของศาสนสถาน พุทธศาสนิกชนและผู้เยี่ยมชมวัดทุกท่านต้องปฏิบัติตามกฎกติกาอย่างเคร่งครัด:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>กรุณาแต่งกายด้วยชุดสุภาพ สีขาว หรือสีสุภาพเรียบร้อย มิดชิด</li>
              <li>งดการส่งเสียงดังรบกวนสมาธิและกิริยาที่ไม่สุภาพในเขตปฏิบัติธรรมและอุโบสถ</li>
              <li>ห้ามนำเครื่องดื่มแอลกอฮอล์ ของมึนเมา บุหรี่ หรือสารเสพติดทุกประเภทเข้ามาในบริเวณวัดโดยเด็ดขาด</li>
              <li>การถ่ายภาพหรือถ่ายวิดีโอเพื่อวัตถุประสงค์เชิงพาณิชย์ ต้องได้รับอนุญาตจากทางสำนักงานวัดก่อนล่วงหน้า</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-accent-deep mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block"></span>
              3. เงื่อนไขการร่วมทำบุญบริจาคออนไลน์
            </h2>
            <p>
              ผู้ใช้บริการสามารถร่วมสมทบทุนทำบุญบูรณปฏิสังขรณ์ ค่าน้ำไฟ หรือกิจกรรมทำบุญต่างๆ ของทางวัดดอนสว่างธรรมเจริญศรัทธา ผ่านระบบออนไลน์ได้ตามความสมัครใจ โดยมีรายละเอียดดังนี้:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>การโอนเงินทำบุญจะดำเนินการไปยังบัญชีธนาคารอย่างเป็นทางการในนามของวัดโดยตรงเท่านั้น</li>
              <li>ผู้ทำบุญตกลงว่าจะส่งข้อมูลสลิปและรายละเอียดการโอนที่เป็นจริงเพื่อยืนยันการทำบุญ</li>
              <li>เงินบริจาคที่โอนเรียบร้อยแล้วไม่สามารถขอคืนหรือยกเลิกได้ในทุกกรณี เนื่องจากเป็นไปตามเจตนารมณ์ในการร่วมทำกุศล</li>
              <li>วัดจะนำปัจจัยทำบุญไปใช้จ่ายตรงตามวัตถุประสงค์ของโครงการที่ระบุไว้ด้วยความโปร่งใสและตรวจสอบได้</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-accent-deep mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block"></span>
              4. ทรัพย์สินทางปัญญาและการใช้เนื้อหา
            </h2>
            <p>
              ข้อมูล ภาพถ่าย วิดีโอ บทความธรรมะ และสื่อการเรียนรู้อื่นๆ ที่ปรากฏอยู่บนเว็บไซต์นี้ เป็นลิขสิทธิ์ของวัดดอนสว่างธรรมเจริญศรัทธา 
              ผู้ใช้สามารถแชร์เนื้อหาธรรมะหรือรูปภาพเพื่อประโยชน์ในการเผยแผ่พระพุทธศาสนา (โดยไม่ใช่การค้า) ได้โดยไม่ต้องขออนุญาต แต่กรุณาให้เครดิตอ้างอิงแหล่งที่มาของข้อมูลตามความเหมาะสม
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-accent-deep mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-gold rounded-full inline-block"></span>
              5. การปรับปรุงเงื่อนไข
            </h2>
            <p>
              วัดดอนสว่างธรรมเจริญศรัทธา ขอสงวนสิทธิ์ในการแก้ไข เปลี่ยนแปลง หรืออัปเดตข้อกำหนดและเงื่อนไขการใช้งานเหล่านี้ได้ทุกเวลาตามความเหมาะสม โดยไม่จำเป็นต้องแจ้งให้ผู้ใช้ทราบล่วงหน้า 
              การใช้งานเว็บไซต์อย่างต่อเนื่องหลังจากการเปลี่ยนแปลงถือเป็นการยอมรับข้อตกลงใหม่นั้นโดยปริยาย
            </p>
          </section>

        </div>

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-gold" />
            <span>มีผลบังคับใช้ตามหลักเกณฑ์ของวัดดอนสว่างธรรมเจริญศรัทธา</span>
          </div>
          <div>
            ติดต่อเจ้าหน้าที่: weeratheroofficial@gmail.com
          </div>
        </div>

      </div>
    </div>
  );
}
