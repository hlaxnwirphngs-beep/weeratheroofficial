import { Activity, Clock, User, LogIn, Edit, Trash, PlusCircle, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ActivityLog() {
  const { activityLogs = [] } = useStore();

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'login': return { icon: LogIn, color: 'text-blue-500 bg-blue-50 border-blue-100' };
      case 'create': return { icon: PlusCircle, color: 'text-green-500 bg-green-50 border-green-100' };
      case 'edit': return { icon: Edit, color: 'text-orange-500 bg-orange-50 border-orange-100' };
      case 'delete': return { icon: Trash, color: 'text-red-500 bg-red-50 border-red-100' };
      default: return { icon: Settings, color: 'text-stone-500 bg-stone-50 border-stone-100' };
    }
  };

  const sortedLogs = [...activityLogs].sort((a, b) => {
    return new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <h1 className="text-2xl font-bold font-serif text-[#1B3022] flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#C5A059]" />
          บันทึกกิจกรรม (Activity Log)
        </h1>
        <p className="text-stone-500 mt-2 text-sm">ประวัติการทำงานและการเข้าใช้ระบบของแอดมินทั้งหมด</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <div className="relative pl-6 border-l-2 border-stone-100 space-y-8">
          {sortedLogs.length > 0 ? sortedLogs.map((log) => {
            const style = getLogStyle(log.type || 'system');
            const Icon = style.icon;
            return (
              <div key={log.id} className="relative">
                <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${style.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 ml-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-stone-800">{log.action}</h3>
                    <div className="flex items-center text-xs text-stone-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(log.time).toLocaleString('th-TH')}
                    </div>
                  </div>
                  {log.detail && (
                    <p className="text-sm text-stone-600 mb-2">{log.detail}</p>
                  )}
                  <div className="flex items-center text-xs font-medium text-stone-500">
                    <User className="w-3 h-3 mr-1" />
                    โดย: {log.user || 'System'}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-stone-500 text-center py-8">ไม่มีบันทึกกิจกรรม</div>
          )}
        </div>
      </div>
    </div>
  );
}
