import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { FileText, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import axiosInstance from '../../../utils/axiosInstance';
import { Button } from '../ui/button';

export function OfficerReports() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axiosInstance.get('/officer/dashboard/reports');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const trendData = [
    { name: 'T1/W1', trucTuyen: 40, taiQuay: 5 }, { name: 'T1/W2', trucTuyen: 50, taiQuay: 8 },
    { name: 'T1/W3', trucTuyen: 45, taiQuay: 7 }, { name: 'T1/W4', trucTuyen: 55, taiQuay: 6 },
    { name: 'T2/W1', trucTuyen: 65, taiQuay: 9 }, { name: 'T2/W2', trucTuyen: 70, taiQuay: 10 },
    { name: 'T2/W3', trucTuyen: 75, taiQuay: 11 }, { name: 'T2/W4', trucTuyen: 82, taiQuay: 10 },
    { name: 'T3/W1', trucTuyen: 80, taiQuay: 11 }, { name: 'T3/W2', trucTuyen: 85, taiQuay: 9 },
    { name: 'T3/W3', trucTuyen: 83, taiQuay: 8 }, { name: 'T3/W4', trucTuyen: 90, taiQuay: 12 }
  ];

  const pieData = [
    { name: 'Rất hài lòng', value: 62, color: '#388e3c' },
    { name: 'Hài lòng', value: 28, color: '#f57c00' },
    { name: 'Bình thường', value: 7, color: '#757575' },
    { name: 'Không hài lòng', value: 3, color: '#d32f2f' },
  ];

  if (!data) return <div className="p-8 text-center text-gray-500">Đang tải báo cáo...</div>;

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Báo cáo & Thống kê</h2>
           <p className="text-sm text-gray-500">Tổng hợp hiệu suất xử lý hồ sơ theo kỳ</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
             <button className="px-4 py-2 text-sm font-medium hover:bg-gray-50 text-gray-700 border-r">Tháng này</button>
             <button className="px-4 py-2 text-sm font-medium bg-[#800] text-white">Quý 1/2026</button>
             <button className="px-4 py-2 text-sm font-medium hover:bg-gray-50 text-gray-700 border-l">Quý 2/2026</button>
           </div>
           <Button variant="outline" className="bg-white border-gray-300 shadow-sm ml-2">
             <Download size={16} className="mr-2" />
             Xuất báo cáo
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-blue-500 rounded-xl shadow-sm">
           <div className="flex justify-between items-start">
             <FileText className="text-blue-500" size={24} />
             <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">~ 12.4 pp</span>
           </div>
           <div className="mt-4">
             <div className="text-3xl font-bold text-gray-800">{data.totalReceived} <span className="text-sm font-medium text-gray-500 ml-1">hồ sơ</span></div>
             <p className="text-sm text-gray-600 mt-1">Tổng hồ sơ tiếp nhận</p>
           </div>
        </Card>
        
        <Card className="p-5 border-l-4 border-l-green-500 rounded-xl shadow-sm">
           <div className="flex justify-between items-start">
             <CheckCircle className="text-green-500" size={24} />
             <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">~ 2.1 pp</span>
           </div>
           <div className="mt-4">
             <div className="text-3xl font-bold text-gray-800">{data.onTimeRate}<span className="text-2xl">%</span></div>
             <p className="text-sm text-gray-600 mt-1">Tỷ lệ hoàn thành đúng hạn</p>
           </div>
        </Card>
        
        <Card className="p-5 border-l-4 border-l-yellow-500 rounded-xl shadow-sm">
           <div className="flex justify-between items-start">
             <Clock className="text-yellow-600" size={24} />
             <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">~ 0.3</span>
           </div>
           <div className="mt-4">
             <div className="text-3xl font-bold text-gray-800">{data.avgProcessingDays} <span className="text-sm font-medium text-gray-500 ml-1">ngày</span></div>
             <p className="text-sm text-gray-600 mt-1">Thời gian XL trung bình</p>
           </div>
        </Card>
        
        <Card className="p-5 border-l-4 border-l-red-500 rounded-xl shadow-sm">
           <div className="flex justify-between items-start">
             <XCircle className="text-red-500" size={24} />
             <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">~ 1.2 pp</span>
           </div>
           <div className="mt-4">
             <div className="text-3xl font-bold text-gray-800">{data.rejectionRate}<span className="text-2xl">%</span></div>
             <p className="text-sm text-gray-600 mt-1">Tỷ lệ từ chối</p>
           </div>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Bar Chart */}
        <Card className="lg:col-span-2 p-5 shadow-sm">
          <div className="mb-6">
             <h3 className="text-lg font-bold text-gray-800">Hồ sơ theo tháng</h3>
             <p className="text-sm text-gray-500">Tiếp nhận, hoàn thành và từ chối</p>
          </div>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.monthlyData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                 <RechartsTooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                 <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                 <Bar dataKey="total" name="Tiếp nhận" fill="#64748b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                 <Bar dataKey="completed" name="Hoàn thành" fill="#e85d04" radius={[4, 4, 0, 0]} maxBarSize={40} />
                 <Bar dataKey="rejected" name="Từ chối" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={40} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </Card>

        {/* Satisfaction Pie Chart */}
        <Card className="p-5 shadow-sm">
          <div className="mb-2">
             <h3 className="text-lg font-bold text-gray-800">Mức độ hài lòng</h3>
             <p className="text-sm text-gray-500">Khảo sát công dân Q1/2026</p>
          </div>
          <div className="h-56 flex justify-center items-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                   {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} /> )}
                 </Pie>
                 <RechartsTooltip />
               </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
             {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-bold">{item.value}%</span>
                </div>
             ))}
          </div>
        </Card>
      </div>

      {/* Trend Line Chart */}
      <Card className="p-5 shadow-sm">
        <div className="mb-6">
           <h3 className="text-lg font-bold text-gray-800">Xu hướng nộp hồ sơ: Trực tuyến vs Tại quầy</h3>
           <p className="text-sm text-gray-500">Theo tuần — Q1 đến Q2/2026</p>
        </div>
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
               <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
               <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
               <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
               <Line type="monotone" dataKey="trucTuyen" name="Trực tuyến" stroke="#d32f2f" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
               <Line type="monotone" dataKey="taiQuay" name="Tại quầy" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
