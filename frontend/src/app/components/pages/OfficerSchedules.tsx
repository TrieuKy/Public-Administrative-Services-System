import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Clock, Plus, Trash2, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';

export function OfficerSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    timeInfo: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'normal'
  });

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/officer/dashboard/schedules');
      setSchedules(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/officer/dashboard/schedules', newSchedule);
      setShowAddForm(false);
      setNewSchedule({ ...newSchedule, title: '', timeInfo: '' });
      fetchSchedules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi thêm lịch!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa lịch này không?')) return;
    try {
      await axiosInstance.delete(`/officer/dashboard/schedules/${id}`);
      fetchSchedules();
    } catch (err: any) {
      alert('Không thể xóa lịch!');
    }
  };

  // Group schedules by Date
  const groupedSchedules = schedules.reduce((acc: any, curr: any) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSchedules).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-gray-900">Lịch công tác</h2>
            <p className="text-sm text-gray-500">Quản lý lịch làm việc và các cuộc họp của bạn</p>
         </div>
         <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-red-700 hover:bg-red-800 text-white">
            <Plus size={18} className="mr-2" />
            Thêm lịch công tác
         </Button>
      </div>

      {showAddForm && (
        <Card className="p-6 bg-red-50 border-red-100">
           <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
             <Calendar size={18} className="text-red-700"/> Tạo lịch phân công mới
           </h3>
           <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-2 lg:col-span-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề / Nội dung <span className="text-red-500">*</span></label>
                 <input 
                   type="text" required 
                   value={newSchedule.title} onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                   placeholder="Vd: Họp giao ban, Tiếp dân thường kỳ..."
                   className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500" 
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Ngày <span className="text-red-500">*</span></label>
                 <input 
                   type="date" required 
                   value={newSchedule.date} onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500" 
                 />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian <span className="text-red-500">*</span></label>
                 <input 
                   type="text" required 
                   value={newSchedule.timeInfo} onChange={(e) => setNewSchedule({...newSchedule, timeInfo: e.target.value})}
                   placeholder="Vd: 08:00 - 10:00"
                   className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500" 
                 />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Tính chất</label>
                 <select 
                   value={newSchedule.priority} onChange={(e) => setNewSchedule({...newSchedule, priority: e.target.value})}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500 bg-white"
                 >
                    <option value="normal">Bình thường</option>
                    <option value="urgent">Quan trọng / Khẩn</option>
                 </select>
              </div>

              <div className="flex items-end pt-1">
                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    Lưu lịch trình
                 </Button>
              </div>
           </form>
        </Card>
      )}

      {/* Timeline List */}
      <div className="space-y-8">
         {isLoading ? (
            <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
         ) : sortedDates.length === 0 ? (
            <Card className="py-16 text-center shadow-sm border-gray-200">
               <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có lịch công tác</h3>
               <p className="text-gray-500">Bạn chưa có lịch trình nào được phân công.</p>
            </Card>
         ) : (
            sortedDates.map((date) => (
              <div key={date} className="relative">
                <div className="sticky top-0 bg-gray-50 py-2 z-10 flex items-center gap-3">
                   <div className="px-4 py-1.5 bg-red-800 text-white text-sm font-bold rounded-full inline-block shadow-sm">
                      {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                   </div>
                   <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <div className="mt-4 space-y-3 pl-4 border-l-2 border-red-200 ml-4">
                   {groupedSchedules[date].map((schedule: any) => (
                      <div key={schedule.id} className="relative group">
                         <div className={`absolute -left-[27px] top-4 w-4 h-4 rounded-full border-4 border-white ${schedule.priority === 'urgent' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                         <Card className="ml-2 p-4 flex items-start justify-between border-l-4 hover:shadow-md transition bg-white" style={{ borderLeftColor: schedule.priority === 'urgent' ? '#f97316' : '#3b82f6' }}>
                            <div className="flex-1">
                               <div className="flex items-center gap-2 mb-2">
                                  <Clock size={16} className="text-gray-400" />
                                  <span className="text-sm font-semibold text-gray-700">{schedule.timeInfo}</span>
                                  {schedule.priority === 'urgent' && (
                                     <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold tracking-wide uppercase rounded">Quan trọng</span>
                                  )}
                               </div>
                               <h4 className="text-base font-semibold text-gray-900 mb-1">{schedule.title}</h4>
                               <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14}/> Tại cơ quan</p>
                            </div>
                            <button onClick={() => handleDelete(schedule.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition hover:bg-red-50 rounded-lg">
                               <Trash2 size={18} />
                            </button>
                         </Card>
                      </div>
                   ))}
                </div>
              </div>
            ))
         )}
      </div>
    </div>
  );
}
