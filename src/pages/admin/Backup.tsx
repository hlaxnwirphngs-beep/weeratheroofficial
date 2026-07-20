import { Database, Download, Upload, RotateCcw, ShieldCheck, HardDrive } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Backup() {
  const { backups = [], addItem } = useStore();

  const handleCreateBackup = () => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const timeString = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const newBackup = {
      id: Date.now(),
      name: `backup_${dateString}_${timeString}.sql`,
      size: `${(Math.random() * 5 + 10).toFixed(1)} MB`,
      type: 'Manual',
      status: 'Success',
      date: now.toISOString(),
    };
    addItem('backups', newBackup);
    
    // Log activity
    addItem('activityLogs', {
      id: Date.now() + 1,
      action: 'สร้าง Backup ข้อมูล',
      user: 'Admin',
      detail: `ไฟล์ ${newBackup.name}`,
      time: now.toISOString(),
      type: 'create'
    });
    
    alert('สร้าง Backup ข้อมูลสำเร็จ!');
  };

  const sortedBackups = [...backups].sort((a, b) => {
    return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1B3022] flex items-center gap-3">
            <Database className="w-8 h-8 text-[#C5A059]" />
            ระบบ Backup ข้อมูล
          </h1>
          <p className="text-stone-500 mt-2 text-sm">สำรองข้อมูลและกู้คืนฐานข้อมูลของเว็บไซต์</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCreateBackup}
            className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B39048] text-white rounded-xl font-medium transition-colors shadow-sm flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            สร้าง Backup ตอนนี้
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-green-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">สถานะการสำรองข้อมูล</p>
            <p className="text-xl font-bold text-stone-800">ปลอดภัย</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-600">
            <HardDrive className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">พื้นที่ที่ใช้ (Database)</p>
            <p className="text-xl font-bold text-stone-800">{(sortedBackups.length * 1.5).toFixed(1)} MB</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col justify-center">
          <button 
            onClick={() => alert('ฟังก์ชันกู้คืนข้อมูลแบบอัปโหลดกำลังอยู่ในระหว่างการพัฒนา')}
            className="w-full py-3 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl font-medium transition-colors flex items-center justify-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            อัปโหลดไฟล์ Backup (Restore)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <h2 className="text-lg font-bold text-[#1B3022]">ประวัติการสำรองข้อมูล (Backup History)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="text-xs text-stone-500 bg-stone-50/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">ชื่อไฟล์</th>
                <th className="px-6 py-4 font-medium">ขนาด</th>
                <th className="px-6 py-4 font-medium">ประเภท</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
                <th className="px-6 py-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedBackups.map((backup) => (
                <tr key={backup.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-800">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 mr-2 text-[#C5A059]" />
                      {backup.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{backup.size}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      (backup.type || '').includes('Auto') ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {backup.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-green-600 font-medium">
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      {backup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => alert(`ดาวน์โหลดไฟล์ ${backup.name} แล้ว`)}
                        className="p-2 text-stone-400 hover:text-[#C5A059] hover:bg-orange-50 rounded-lg transition-colors" 
                        title="ดาวน์โหลด"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => alert('ฟังก์ชันกู้คืนข้อมูลกำลังอยู่ในระหว่างการพัฒนา')}
                        className="p-2 text-stone-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="กู้คืนข้อมูล (Restore)"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
