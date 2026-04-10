import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, FileText, Clock, Activity, CheckCircle, Search, Eye, User, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axiosInstance from '../../../utils/axiosInstance';
import { Link } from 'react-router-dom';

const COLORS = ['#d32f2f', '#f57c00', '#1976d2', '#388e3c', '#757575']; // Red, Orange, Blue, Green, Gray

export function OfficerOverview() {
  const [stats, setStats] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchSchedules();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/officer/dashboard/overview');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await axiosInstance.get('/officer/dashboard/schedules');
      if (res.data.success) {
        setSchedules(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Mock data for graphs since full data aggregate requires a lot of real data
  const weeklyData = [
    { name: 'T2', value: 12 }, { name: 'T3', value: 10 }, { name: 'T4', value: 8 },
    { name: 'T5', value: 15 }, { name: 'T6', value: 11 }, { name: 'T7', value: 6 }, { name: 'CN', value: 3 }
  ];

  const pieData = [
    { name: 'Đăng ký hộ tịch', value: 36 },
    { name: 'Quản lý dân cư', value: 25 },
    { name: 'Chứng thực', value: 20 },
    { name: 'Đất đai - XD', value: 10 },
    { name: 'Khác', value: 7 },
  ];

  const renderStatusTag = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Chờ xử lý</span>;
      case 'PROCESSING': return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">Đang xử lý</span>;
      case 'COMPLETED': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Hoàn thành</span>;
      case 'NEED_MORE': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Cần bổ sung</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{status}</span>;
    }
  };

  if (!stats) return <div className="p-8 text-center text-gray-500">Đang tải biểu đồ...</div>;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-700 to-orange-500 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold mb-1">Xin chào, {localStorage.getItem('fullName')}!</h2>
           <p className="text-red-100 text-sm mb-2">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
           <p className="text-sm">Hôm nay có <span className="font-bold underline">3 hồ sơ khẩn</span> đang chờ xử lý.</p>
        </div>
        <Link to="/officer/applications" className="bg-white/20 hover:bg-white/30 transition text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 backdrop-blur-sm border border-white/30">
          Xem hồ sơ <ArrowRight size={16} />
        </Link>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Hồ sơ nhận hôm nay', value: stats.todayTotal, icon: <FileText size={24} className="text-blue-500"/>, sub: '+3 so với hôm qua' },
          { label: 'Chờ xử lý', value: stats.pending, icon: <Clock size={24} className="text-orange-500"/>, sub: '2 hồ sơ khẩn' },
          { label: 'Đang xử lý', value: stats.processing, icon: <Activity size={24} className="text-yellow-600"/>, sub: 'Dự kiến xong hôm nay' },
          { label: 'Hoàn thành', value: stats.completed, icon: <CheckCircle size={24} className="text-green-500"/>, sub: `Tỷ lệ: ${stats.completionRate}%` },
        ].map((s, i) => (
          <Card key={i} className="p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-16 h-16 bg-gray-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex justify-between items-start">
               <div>
                 <div className="text-3xl font-bold text-gray-800">{s.value}</div>
                 <div className="text-sm font-medium text-gray-600 mt-1">{s.label}</div>
               </div>
               <div className="p-2 bg-gray-100 rounded-lg">{s.icon}</div>
            </div>
            <div className="relative z-10 text-xs text-gray-400 mt-auto">{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5 shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Hồ sơ trong tuần</h3>
                <p className="text-xs text-gray-400">Tổng quan 7 ngày gần nhất</p>
              </div>
              <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">Tuần này</span>
           </div>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#d32f2f" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#d32f2f" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Area type="monotone" dataKey="value" stroke="#d32f2f" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </Card>

        <Card className="p-5 shadow-sm border border-gray-100">
           <div className="mb-4">
             <h3 className="font-bold text-gray-800 text-lg">Phân loại dịch vụ</h3>
             <p className="text-xs text-gray-400">Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</p>
           </div>
           <div className="h-48 flex justify-center items-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                   {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> )}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="space-y-2 mt-2">
             {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-medium">{item.value}%</span>
                </div>
             ))}
           </div>
        </Card>
      </div>

      {/* Bottom Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Applications */}
        <Card className="lg:col-span-2 p-5 shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Hồ sơ mới nhất hôm nay</h3>
              <Link to="/officer/applications" className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">Xem tất cả <ArrowRight size={14}/></Link>
           </div>
           <div className="space-y-3">
              {stats.recentApps.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50/50 rounded-xl transition border border-transparent hover:border-red-100">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center text-red-500">
                         <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{app.service?.name || app.applicationCode}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                           <User size={12} /> {app.citizen?.fullName} • {new Date(app.submittedAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      {renderStatusTag(app.status)}
                   </div>
                </div>
              ))}
              {stats.recentApps.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Không có hồ sơ nào mới nhận hôm nay.
                </div>
              )}
           </div>
        </Card>

        {/* Schedule/Tasks */}
        <Card className="p-5 shadow-sm border border-gray-100 flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
               <Calendar className="text-gray-400" size={20} />
               <h3 className="font-bold text-gray-800 text-lg">Lịch hôm nay</h3>
             </div>
           </div>
           
           <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent flex-1">
              {schedules.map((schedule, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-3 pl-8 md:p-0">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-red-100 text-red-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 left-2 absolute md:static">
                    <div className={`w-2 h-2 rounded-full ${schedule.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div className="w-full text-sm">
                    <div className="flex items-start justify-between">
                       <div>
                         <span className={`text-xs ml-2 md:m-0 font-medium ${schedule.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{schedule.timeInfo} <span className="mx-1 opacity-50 px-2">|</span> {schedule.title}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
              {schedules.length === 0 && <p className="text-sm text-gray-400 px-4 py-8 text-center italic border border-dashed rounded-lg">Không có lịch công tác nào.</p>}
           </div>

           <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/officer/schedules" className="text-xs text-red-600 font-medium hover:underline">Xem lịch đầy đủ →</Link>
           </div>
        </Card>
      </div>

    </div>
  );
}
