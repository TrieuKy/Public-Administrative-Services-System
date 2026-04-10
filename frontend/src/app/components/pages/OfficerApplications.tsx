import { useState, useEffect } from 'react';
import { Search, Filter, Eye, User, Calendar, CheckCircle, XCircle, AlertCircle, FileText, Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import axiosInstance from '../../../utils/axiosInstance';

export function OfficerApplications() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'NEED_MORE' | 'REJECTED'>('all');
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

  const fetchApplications = () => {
    axiosInstance.get('/officer/applications')
      .then(res => setApplications(res.data.data.applications || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getAISuggestionText = (app: any) => {
    // mock ai response for now if not existing
    return <span className="text-sm font-medium text-green-700">Đề xuất: Duyệt</span>;
  };

  const stats = {
    pending: applications.filter(a => a.status === 'PENDING').length,
    processing: applications.filter(a => a.status === 'PROCESSING').length,
    completed: applications.filter(a => a.status === 'COMPLETED').length,
    needMore: applications.filter(a => a.status === 'NEED_MORE').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
    total: applications.length
  };

  const filteredApplications = applications.filter(app => {
    if (selectedTab === 'all') return true;
    return app.status === selectedTab;
  });

  const renderStatusTag = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs border border-blue-200 rounded-full font-medium flex items-center justify-center w-full"><Clock size={12} className="mr-1"/> Chờ xử lý</span>;
      case 'PROCESSING': return <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs border border-orange-200 rounded-full font-medium flex items-center justify-center w-full"><Activity size={12} className="mr-1"/> Đang xử lý</span>;
      case 'COMPLETED': return <span className="px-3 py-1 bg-green-50 text-green-700 text-xs border border-green-200 rounded-full font-medium flex items-center justify-center w-full"><CheckCircle size={12} className="mr-1"/> Hoàn thành</span>;
      case 'NEED_MORE': return <span className="px-3 py-1 bg-red-50 text-red-700 text-xs border border-red-200 rounded-full font-medium flex items-center justify-center w-full"><AlertCircle size={12} className="mr-1"/> Cần bổ sung</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs border border-gray-300 rounded-full font-medium flex items-center justify-center w-full"><XCircle size={12} className="mr-1"/> Đã từ chối</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý hồ sơ</h2>
            <p className="text-sm text-gray-500">Danh sách toàn bộ hồ sơ được tiếp nhận tại bộ phận một cửa</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="border-gray-300 bg-white shadow-sm text-gray-700">
               <Download size={16} className="mr-2" /> Xuất Excel
            </Button>
            <Button variant="outline" onClick={fetchApplications} className="border-gray-300 bg-white shadow-sm text-gray-700">
               <RefreshCw size={16} className="mr-2" /> Làm mới
            </Button>
         </div>
      </div>

      <Card className="p-0 shadow-sm border-gray-200 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-gray-100 overflow-x-auto">
          {[
            { id: 'all', label: 'Tất cả', count: stats.total },
            { id: 'PENDING', label: 'Chờ xử lý', count: stats.pending },
            { id: 'PROCESSING', label: 'Đang xử lý', count: stats.processing },
            { id: 'NEED_MORE', label: 'Cần bổ sung', count: stats.needMore },
            { id: 'COMPLETED', label: 'Hoàn thành', count: stats.completed },
            { id: 'REJECTED', label: 'Từ chối', count: stats.rejected }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transitionflex items-center gap-2 ${
                selectedTab === tab.id 
                  ? 'bg-red-700 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${selectedTab===tab.id ? 'bg-white/20' : 'bg-gray-200'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 flex flex-wrap gap-4 items-center border-b border-gray-100">
           <div className="relative flex-1 min-w-[200px]">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input
               type="text"
               placeholder="Tìm theo mã hồ sơ, tên công dân..."
               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
             />
           </div>
           <div className="flex gap-2">
             <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none">
                <option>Tất cả dịch vụ</option>
             </select>
             <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none">
                <option>Mọi mức độ ưu tiên</option>
             </select>
             <Button variant="outline" className="border-gray-300 bg-white">
                <Filter size={16} className="mr-2" /> Bộ lọc khác
             </Button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4 py-3">Mã hồ sơ</th>
                <th className="p-4 py-3">Dịch vụ</th>
                <th className="p-4 py-3">Công dân</th>
                <th className="p-4 py-3">Ngày nộp</th>
                <th className="p-4 py-3">Hạn xử lý</th>
                <th className="p-4 py-3">AI Gợi ý</th>
                <th className="p-4 py-3 text-center">Trạng thái</th>
                <th className="p-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredApplications.map(app => (
                 <tr key={app.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 whitespace-nowrap">
                       <span className="font-semibold text-gray-800">{app.applicationCode}</span>
                       {['urgent', 'khẩn'].includes(app.priority) && <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] uppercase font-bold rounded">Khẩn</span>}
                    </td>
                    <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                       <FileText size={14} className="text-gray-400" /> {app.service?.name}
                    </td>
                    <td className="p-4 text-sm">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xs"><User size={12}/></div>
                          <div>
                            <p className="font-medium text-gray-800">{app.citizen?.fullName}</p>
                            <p className="text-xs text-gray-400">{app.citizen?.cccd}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 flex items-center gap-2 pt-6">
                       <Calendar size={14} className="text-gray-400"/> {formatDate(app.submittedAt)}
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                       {formatDate(app.deadline)}
                    </td>
                    <td className="p-4">
                       <div className="flex flex-col">
                          {getAISuggestionText(app)}
                          <div className="w-16 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden"><div className="h-full bg-green-500 w-[95%]"></div></div>
                          <span className="text-[10px] text-gray-400 mt-0.5">95%</span>
                       </div>
                    </td>
                    <td className="p-4">
                       {renderStatusTag(app.status)}
                    </td>
                    <td className="p-4">
                       <div className="flex justify-center gap-2">
                          <button onClick={async () => {
                             try {
                               const req = await axiosInstance.get(`/officer/applications/${app.id}`);
                               setSelectedApplication(req.data.data);
                             } catch(e) { console.error(e) }
                          }} className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition">
                            <Eye size={16} />
                          </button>
                       </div>
                    </td>
                 </tr>
              ))}
              {filteredApplications.length === 0 && (
                 <tr><td colSpan={8} className="p-8 text-center text-gray-400">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
           <span className="text-sm text-gray-500">Hiển thị {filteredApplications.length} hồ sơ</span>
           <div className="flex gap-1">
              <button className="w-8 h-8 rounded border flex items-center justify-center bg-white hover:bg-gray-50 text-gray-400">&lt;</button>
              <button className="w-8 h-8 rounded flex items-center justify-center bg-[#b3141b] text-white">1</button>
              <button className="w-8 h-8 rounded border flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600">2</button>
              <button className="w-8 h-8 rounded border flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600">&gt;</button>
           </div>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-4xl w-full bg-white shadow-2xl overflow-hidden my-8 rounded-xl border border-gray-200">
            {/* Modal Header */}
            <div className="bg-red-50/50 border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10 hidden md:flex">
               <div className="flex items-center gap-2 text-[#b3141b] font-bold">
                 <FileText size={20} />
                 CHI TIẾT HỒ SƠ
               </div>
               <button onClick={() => setSelectedApplication(null)} className="text-gray-400 hover:text-gray-800 transition">
                 <XCircle size={24} />
               </button>
            </div>

            <div className="p-6">
               <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-6 relative">
                  <div className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                    {selectedApplication.status}
                  </div>
                  <h3 className="text-red-600 font-medium text-sm mb-1">{selectedApplication.applicationCode}</h3>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedApplication.service?.name}</h2>
                  
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                     <p className="text-gray-500">Người nộp: <span className="text-gray-900 font-medium ml-2">{selectedApplication.citizen?.fullName}</span></p>
                     <p className="text-gray-500">Người nhận: <span className="text-gray-900 font-medium ml-2">{selectedApplication.officer?.fullName || 'Chưa phân công'}</span></p>
                     <p className="text-gray-500">Nộp qua mạng: <span className="text-gray-900 font-medium ml-2">{formatDate(selectedApplication.submittedAt)}</span></p>
                     <p className="text-gray-500">Thời gian Gỉải quyết: <span className="text-gray-900 font-medium ml-2">{formatDate(selectedApplication.deadline)}</span></p>
                     <p className="text-gray-500">Lệ phí: <span className="text-gray-900 font-medium ml-2">{selectedApplication.service?.currentFee > 0 ? selectedApplication.service?.currentFee + ' đ' : 'Miễn phí'}</span></p>
                  </div>
               </div>

               <div className="mb-6">
                 <h3 className="flex items-center gap-2 font-bold text-blue-800 text-sm tracking-wider uppercase mb-3 border-b pb-2">
                   <FileText size={18} /> Giấy tờ đính kèm
                 </h3>
                 <div className="space-y-3">
                   {selectedApplication.documents?.map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition group">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center">
                             <FileText size={20} />
                           </div>
                           <div>
                             <p className="font-medium text-gray-800 text-sm">{doc.docType || 'Tài liệu'}</p>
                             <p className="text-xs text-gray-500">{doc.fileName}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                          <a href={(import.meta as any).env.VITE_API_URL?.replace('/api/v1', '') + doc.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition" title="Xem ảnh/tài liệu">
                             <Eye size={18} />
                          </a>
                          <a href={(import.meta as any).env.VITE_API_URL?.replace('/api/v1', '') + doc.fileUrl} download={doc.fileName} className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition" title="Tải tài liệu về">
                             <Download size={18} />
                          </a>
                        </div>
                      </div>
                   ))}
                   {(!selectedApplication.documents || selectedApplication.documents.length === 0) && (
                     <p className="text-sm text-gray-500 italic">Không có tài liệu nào.</p>
                   )}
                 </div>
               </div>

               <div className="mb-6">
                 <h3 className="flex items-center gap-2 font-bold text-blue-800 text-sm tracking-wider uppercase mb-3 border-b pb-2">
                   <Clock size={18} /> Lịch sử luân chuyển hồ sơ
                 </h3>
                 <div className="overflow-hidden border border-gray-200 rounded-xl">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50 border-b">
                       <tr>
                         <th className="p-3 font-semibold text-gray-600">Thời gian</th>
                         <th className="p-3 font-semibold text-gray-600">Hành động</th>
                         <th className="p-3 font-semibold text-gray-600">Người thực hiện</th>
                         <th className="p-3 font-semibold text-gray-600 w-1/2">Ghi chú</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {selectedApplication.histories?.map((history: any, idx: number) => (
                         <tr key={idx} className="hover:bg-gray-50 transition">
                           <td className="p-3 whitespace-nowrap text-gray-500">{new Date(history.createdAt).toLocaleString('vi-VN')}</td>
                           <td className="p-3 font-medium text-gray-800">{history.action}</td>
                           <td className="p-3 text-gray-700">{history.actor?.fullName} <span className="text-xs text-gray-400">({history.actor?.role === 'citizen' ? 'Công dân' : 'Cán bộ'})</span></td>
                           <td className="p-3 text-gray-500 text-xs">{history.note}</td>
                         </tr>
                       ))}
                       {(!selectedApplication.histories || selectedApplication.histories.length===0) && (
                         <tr><td colSpan={4} className="p-4 text-center italic text-gray-400">Chưa có lịch sử</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>

               {/* Action Buttons */}
               {['PENDING', 'PROCESSING'].includes(selectedApplication.status) && (
                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const note = prompt('Nội dung cần bổ sung:');
                        if (!note) return;
                        try {
                          await axiosInstance.patch(`/officer/applications/${selectedApplication.id}/request-supplement`, { requiredDocs: [note], note });
                          alert('Đã gửi yêu cầu bổ sung!');
                          setSelectedApplication(null);
                          fetchApplications();
                        } catch (e: any) { alert(e.response?.data?.message || 'Có lỗi xảy ra'); }
                      }}
                      className="border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold"
                    >
                      Cần bổ sung
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const reason = prompt('Lý do từ chối:');
                        if (!reason) return;
                        try {
                          await axiosInstance.patch(`/officer/applications/${selectedApplication.id}/reject`, { reason });
                          alert('Đã từ chối!');
                          setSelectedApplication(null);
                          fetchApplications();
                        } catch (e: any) { alert(e.response?.data?.message || 'Có lỗi xảy ra'); }
                      }}
                      className="border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold"
                    >
                      Từ chối
                    </Button>
                    <Button
                      onClick={async () => {
                        try {
                          await axiosInstance.patch(`/officer/applications/${selectedApplication.id}/approve`, { note: 'Duyệt thành công' });
                          alert('Đã duyệt hồ sơ!');
                          setSelectedApplication(null);
                          fetchApplications();
                        } catch (e: any) { alert(e.response?.data?.message || 'Có lỗi xảy ra'); }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      Duyệt hồ sơ
                    </Button>
                  </div>
               )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Missing icons mock for activity
function Activity(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
}
function Clock(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
}
