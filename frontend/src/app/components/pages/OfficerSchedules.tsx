import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Clock, Plus, Trash2, MapPin, ChevronLeft, ChevronRight, Users, FileText, AlertCircle } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

interface Schedule {
  id: string;
  title: string;
  timeInfo: string;
  date: string;
  priority: string;
  location?: string;
}

const QUICK_TASKS = [
  'Tiếp nhận hồ sơ buổi sáng',
  'Tiếp nhận hồ sơ buổi chiều',
  'Họp giao ban',
  'Duyệt hồ sơ',
  'Tiếp dân',
  'Báo cáo tuần',
  'Hội ý bộ phận',
];

const TIME_SLOTS = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

export function OfficerSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [todayStats, setTodayStats] = useState({ total: 0, urgent: 0 });
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);

  const [newSchedule, setNewSchedule] = useState({
    title: '',
    timeInfo: '08:00',
    date: new Date().toISOString().split('T')[0],
    priority: 'normal',
    location: 'Tại cơ quan',
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

  // Fetch pending applications count for smart suggestions
  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/officer/dashboard/stats');
      const d = res.data?.data;
      setPendingCount(d?.pendingApplications || 0);
    } catch {}
  };

  useEffect(() => {
    fetchSchedules();
    fetchStats();
  }, []);

  // Compute today's stats
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySchedules = schedules.filter(s => s.date === today);
    setTodayStats({
      total: todaySchedules.length,
      urgent: todaySchedules.filter(s => s.priority === 'urgent').length,
    });
  }, [schedules]);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/officer/dashboard/schedules', newSchedule);
      setShowAddForm(false);
      setNewSchedule({ ...newSchedule, title: '', timeInfo: '08:00' });
      fetchSchedules();
      toast.success('Đã thêm lịch công tác!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi thêm lịch!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa lịch này không?')) return;
    try {
      await axiosInstance.delete(`/officer/dashboard/schedules/${id}`);
      fetchSchedules();
      toast.success('Đã xóa lịch công tác');
    } catch {
      toast.error('Không thể xóa lịch!');
    }
  };

  const handleQuickTask = (title: string) => {
    setNewSchedule(prev => ({ ...prev, title }));
  };

  const addSmartSchedule = async (title: string, timeInfo: string, priority: string = 'normal') => {
    try {
      await axiosInstance.post('/officer/dashboard/schedules', {
        title,
        timeInfo,
        date: new Date().toISOString().split('T')[0],
        priority,
        location: 'Tại cơ quan',
      });
      fetchSchedules();
      toast.success(`Đã thêm: ${title}`);
    } catch {
      toast.error('Không thể thêm lịch gợi ý!');
    }
  };

  // Group schedules by Date
  const groupedSchedules = schedules.reduce((acc: any, curr: Schedule) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSchedules).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const formatDateLabel = (date: string) => {
    if (date === today) return `Hôm nay — ${new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}`;
    if (date === tomorrow) return `Ngày mai — ${new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}`;
    return new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

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

      {/* Smart Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-blue-500 bg-blue-50">
          <div className="flex items-center gap-3">
            <Calendar size={22} className="text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Lịch hôm nay</p>
              <p className="text-2xl font-bold text-blue-800">{todayStats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-orange-500 bg-orange-50">
          <div className="flex items-center gap-3">
            <AlertCircle size={22} className="text-orange-600" />
            <div>
              <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Việc quan trọng</p>
              <p className="text-2xl font-bold text-orange-800">{todayStats.urgent}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center gap-3">
            <FileText size={22} className="text-red-600" />
            <div>
              <p className="text-xs text-red-600 font-medium uppercase tracking-wide">Hồ sơ chờ duyệt</p>
              <p className="text-2xl font-bold text-red-800">{pendingCount}</p>
            </div>
          </div>
          {pendingCount > 0 && (
            <p className="text-xs text-red-500 mt-2">⚡ Cần xử lý hôm nay</p>
          )}
        </Card>
      </div>

      {/* Smart Suggestions */}
      {pendingCount > 0 && (
        <Card className="p-4 bg-amber-50 border border-amber-200">
          <p className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <AlertCircle size={16} /> Gợi ý lịch thông minh — Có {pendingCount} hồ sơ đang chờ duyệt
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addSmartSchedule(`Duyệt ${pendingCount} hồ sơ đang chờ`, '09:00', 'urgent')}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded-full hover:bg-amber-700 transition font-medium"
            >
              + Duyệt hồ sơ chờ (09:00)
            </button>
            <button
              onClick={() => addSmartSchedule('Tiếp nhận hồ sơ buổi sáng', '07:30')}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 text-xs rounded-full hover:bg-amber-100 transition"
            >
              + Tiếp nhận buổi sáng (07:30)
            </button>
            <button
              onClick={() => addSmartSchedule('Tiếp nhận hồ sơ buổi chiều', '13:00')}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 text-xs rounded-full hover:bg-amber-100 transition"
            >
              + Tiếp nhận buổi chiều (13:00)
            </button>
          </div>
        </Card>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-6 bg-red-50 border-red-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-red-700"/> Tạo lịch công tác mới
          </h3>

          {/* Quick task chips */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-medium mb-2">Chọn nhanh:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TASKS.map(task => (
                <button
                  key={task}
                  type="button"
                  onClick={() => handleQuickTask(task)}
                  className={`px-3 py-1 text-xs rounded-full border transition ${
                    newSchedule.title === task
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600'
                  }`}
                >
                  {task}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề / Nội dung <span className="text-red-500">*</span></label>
              <input
                type="text" required
                value={newSchedule.title} onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })}
                placeholder="Vd: Họp giao ban, Tiếp dân thường kỳ..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày <span className="text-red-500">*</span></label>
              <input
                type="date" required
                value={newSchedule.date} onChange={e => setNewSchedule({ ...newSchedule, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu <span className="text-red-500">*</span></label>
              <select
                value={newSchedule.timeInfo} onChange={e => setNewSchedule({ ...newSchedule, timeInfo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tính chất</label>
              <select
                value={newSchedule.priority} onChange={e => setNewSchedule({ ...newSchedule, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="normal">Bình thường</option>
                <option value="urgent">Quan trọng / Khẩn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
              <input
                type="text"
                value={newSchedule.location} onChange={e => setNewSchedule({ ...newSchedule, location: e.target.value })}
                placeholder="Vd: Phòng họp A, Hội trường..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1 bg-red-700 hover:bg-red-800 text-white shadow-sm">
                Lưu lịch trình
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                Hủy
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Timeline List */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
            Đang tải dữ liệu...
          </div>
        ) : sortedDates.length === 0 ? (
          <Card className="py-16 text-center shadow-sm border-gray-200">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có lịch công tác</h3>
            <p className="text-gray-500 mb-4">Bạn chưa có lịch trình nào được phân công.</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-red-700 hover:bg-red-800 text-white mx-auto">
              <Plus size={16} className="mr-1" /> Thêm lịch ngay
            </Button>
          </Card>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="relative">
              <div className="sticky top-0 bg-gray-50 py-2 z-10 flex items-center gap-3">
                <div className={`px-4 py-1.5 text-white text-sm font-bold rounded-full inline-block shadow-sm ${
                  date === today ? 'bg-red-700' : date === tomorrow ? 'bg-orange-500' : 'bg-gray-600'
                }`}>
                  {formatDateLabel(date)}
                </div>
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-xs text-gray-400 shrink-0">
                  {groupedSchedules[date].length} công việc
                </span>
              </div>

              <div className="mt-4 space-y-3 pl-4 border-l-2 border-red-200 ml-4">
                {groupedSchedules[date]
                  .sort((a: Schedule, b: Schedule) => a.timeInfo.localeCompare(b.timeInfo))
                  .map((schedule: Schedule) => (
                    <div key={schedule.id} className="relative group">
                      <div className={`absolute -left-[27px] top-4 w-4 h-4 rounded-full border-4 border-white ${
                        schedule.priority === 'urgent' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <Card
                        className="ml-2 p-4 flex items-start justify-between border-l-4 hover:shadow-md transition bg-white"
                        style={{ borderLeftColor: schedule.priority === 'urgent' ? '#f97316' : '#3b82f6' }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} className="text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700">{schedule.timeInfo}</span>
                            {schedule.priority === 'urgent' && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold tracking-wide uppercase rounded">
                                Quan trọng
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-semibold text-gray-900 mb-1">{schedule.title}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin size={14} /> {(schedule as any).location || 'Tại cơ quan'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition hover:bg-red-50 rounded-lg"
                        >
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
