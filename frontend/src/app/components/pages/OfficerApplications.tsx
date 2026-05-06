import { useState, useEffect } from 'react';
import { Search, Filter, Eye, User, Calendar, CheckCircle, XCircle, AlertCircle, FileText, Download, RefreshCw, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

// --- Action Modal (thay thế prompt/alert) ---
interface ActionModalProps {
  type: 'supplement' | 'reject';
  onConfirm: (text: string) => void;
  onClose: () => void;
  loading: boolean;
}
function ActionModal({ type, onConfirm, onClose, loading }: ActionModalProps) {
  const [text, setText] = useState('');
  const isReject = type === 'reject';
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className={`p-5 flex items-center justify-between border-b ${isReject ? 'bg-red-50' : 'bg-orange-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isReject ? 'bg-red-100' : 'bg-orange-100'}`}>
              {isReject ? <XCircle size={20} className="text-red-600" /> : <AlertCircle size={20} className="text-orange-600" />}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{isReject ? 'Từ chối hồ sơ' : 'Yêu cầu bổ sung'}</h3>
              <p className="text-xs text-gray-500">{isReject ? 'Nhập lý do từ chối hồ sơ này' : 'Nêu rõ tài liệu cần bổ sung'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isReject ? 'Lý do từ chối *' : 'Nội dung cần bổ sung *'}
          </label>
          <textarea
            value={text} onChange={e => setText(e.target.value)} rows={4} autoFocus
            placeholder={isReject ? 'Vd: Hồ sơ không đủ điều kiện theo quy định...' : 'Vd: Cần bổ sung bản sao giấy khai sinh có công chứng...'}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{text.length}/500 ký tự</p>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1 border-gray-300">Hủy</Button>
          <Button disabled={!text.trim() || loading} onClick={() => onConfirm(text.trim())}
            className={`flex-1 text-white font-semibold ${isReject ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}>
            {loading ? 'Đang xử lý...' : isReject ? 'Xác nhận từ chối' : 'Gửi yêu cầu'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function OfficerApplications() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'NEED_MORE' | 'REJECTED'>('all');
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [actionModal, setActionModal] = useState<{ type: 'supplement' | 'reject' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  const fetchApplications = (p = page) => {
    const statusParam = selectedTab !== 'all' ? `&status=${selectedTab}` : '';
    axiosInstance.get(`/officer/applications?page=${p}&limit=${LIMIT}${statusParam}`)
      .then(res => {
        const d = res.data.data;
        setApplications(d.applications || []);
        setTotal(d.total || 0);
        setTotalPages(Math.max(1, Math.ceil((d.total || 0) / LIMIT)));
      })
      .catch(console.error);
  };

  useEffect(() => { setPage(1); fetchApplications(1); }, [selectedTab]);

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '--';

  const stats = {
    pending:    0,
    processing: 0,
    completed:  0,
    needMore:   0,
    rejected:   0,
    total,
  };

  const filteredApplications = applications;

  const renderStatusTag = (status: string) => {
    const map: Record<string, JSX.Element> = {
      PENDING:    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs border border-blue-200 rounded-full font-medium flex items-center gap-1 w-full justify-center"><ClockIcon size={12}/> Chờ xử lý</span>,
      PROCESSING: <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs border border-orange-200 rounded-full font-medium flex items-center gap-1 w-full justify-center"><ActivityIcon size={12}/> Đang xử lý</span>,
      COMPLETED:  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs border border-green-200 rounded-full font-medium flex items-center gap-1 w-full justify-center"><CheckCircle size={12}/> Hoàn thành</span>,
      NEED_MORE:  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs border border-amber-200 rounded-full font-medium flex items-center gap-1 w-full justify-center"><AlertCircle size={12}/> Cần bổ sung</span>,
      REJECTED:   <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs border border-gray-300 rounded-full font-medium flex items-center gap-1 w-full justify-center"><XCircle size={12}/> Đã từ chối</span>,
    };
    return map[status] ?? null;
  };

  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      await axiosInstance.patch(`/officer/applications/${selectedApplication.id}/approve`, { note: 'Duyệt thành công' });
      toast.success('✅ Hồ sơ đã được duyệt thành công!');
      setSelectedApplication(null);
      fetchApplications();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Có lỗi xảy ra khi duyệt hồ sơ');
    } finally {
      setApproveLoading(false);
    }
  };

  const handleActionConfirm = async (text: string) => {
    if (!actionModal) return;
    setActionLoading(true);
    try {
      if (actionModal.type === 'supplement') {
        await axiosInstance.patch(`/officer/applications/${selectedApplication.id}/request-supplement`, { requiredDocs: [text], note: text });
        toast.success('📋 Đã gửi yêu cầu bổ sung đến công dân!');
      } else {
        await axiosInstance.patch(`/officer/applications/${selectedApplication.id}/reject`, { reason: text });
        toast.success('🚫 Đã từ chối hồ sơ!');
      }
      setActionModal(null);
      setSelectedApplication(null);
      fetchApplications();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            { id: 'all',        label: 'Tất cả',      count: stats.total },
            { id: 'PENDING',    label: 'Chờ xử lý',   count: stats.pending },
            { id: 'PROCESSING', label: 'Đang xử lý',  count: stats.processing },
            { id: 'NEED_MORE',  label: 'Cần bổ sung', count: stats.needMore },
            { id: 'COMPLETED',  label: 'Hoàn thành',  count: stats.completed },
            { id: 'REJECTED',   label: 'Từ chối',     count: stats.rejected },
          ].map(tab => (
            <button key={tab.id} onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition flex items-center gap-2 ${
                selectedTab === tab.id ? 'bg-red-700 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedTab === tab.id ? 'bg-white/20' : 'bg-gray-200'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 flex flex-wrap gap-4 items-center border-b border-gray-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Tìm theo mã hồ sơ, tên công dân..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none"><option>Tất cả dịch vụ</option></select>
            <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none"><option>Mọi mức độ ưu tiên</option></select>
            <Button variant="outline" className="border-gray-300 bg-white"><Filter size={16} className="mr-2" /> Bộ lọc khác</Button>
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
                  <td className="p-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><FileText size={14} className="text-gray-400" />{app.service?.name}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center"><User size={12}/></div>
                      <div>
                        <p className="font-medium text-gray-800">{app.citizen?.fullName}</p>
                        <p className="text-xs text-gray-400">{app.citizen?.cccd}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-gray-400"/>{formatDate(app.submittedAt)}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{formatDate(app.deadline)}</td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-green-700">Đề xuất: Duyệt</span>
                    <div className="w-16 h-1 bg-gray-200 rounded-full mt-1"><div className="h-full bg-green-500 w-[95%]" /></div>
                    <span className="text-[10px] text-gray-400">95%</span>
                  </td>
                  <td className="p-4">{renderStatusTag(app.status)}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <button onClick={async () => {
                        try {
                          const req = await axiosInstance.get(`/officer/applications/${app.id}`);
                          setSelectedApplication(req.data.data);
                        } catch(e) { console.error(e); }
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

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500">Hiển thị {applications.length} / {total} hồ sơ</span>
          <div className="flex gap-1 items-center">
            <button
              disabled={page <= 1}
              onClick={() => { const p = page - 1; setPage(p); fetchApplications(p); }}
              className="w-8 h-8 rounded border flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => { setPage(p); fetchApplications(p); }}
                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${
                  p === page ? 'bg-[#b3141b] text-white' : 'border bg-white hover:bg-gray-50 text-gray-600'
                }`}>{p}</button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => { const p = page + 1; setPage(p); fetchApplications(p); }}
              className="w-8 h-8 rounded border flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >&gt;</button>
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-4xl w-full bg-white shadow-2xl overflow-hidden my-8 rounded-xl border border-gray-200">
            <div className="bg-red-50/50 border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2 text-[#b3141b] font-bold">
                <FileText size={20} /> CHI TIẾT HỒ SƠ
              </div>
              <button onClick={() => setSelectedApplication(null)} className="text-gray-400 hover:text-gray-800 transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-6 relative">
                <div className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">{selectedApplication.status}</div>
                <h3 className="text-red-600 font-medium text-sm mb-1">{selectedApplication.applicationCode}</h3>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedApplication.service?.name}</h2>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <p className="text-gray-500">Người nộp: <span className="text-gray-900 font-medium ml-2">{selectedApplication.citizen?.fullName}</span></p>
                  <p className="text-gray-500">Người nhận: <span className="text-gray-900 font-medium ml-2">{selectedApplication.officer?.fullName || 'Chưa phân công'}</span></p>
                  <p className="text-gray-500">Ngày nộp: <span className="text-gray-900 font-medium ml-2">{formatDate(selectedApplication.submittedAt)}</span></p>
                  <p className="text-gray-500">Hạn xử lý: <span className="text-gray-900 font-medium ml-2">{formatDate(selectedApplication.deadline)}</span></p>
                  <p className="text-gray-500">Lệ phí: <span className="text-gray-900 font-medium ml-2">{selectedApplication.service?.currentFee > 0 ? selectedApplication.service?.currentFee + ' đ' : 'Miễn phí'}</span></p>
                </div>
              </div>

              {/* Documents */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 font-bold text-blue-800 text-sm tracking-wider uppercase mb-3 border-b pb-2">
                  <FileText size={18} /> Giấy tờ đính kèm
                </h3>
                <div className="space-y-3">
                  {selectedApplication.documents?.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center"><FileText size={20} /></div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{doc.docType || 'Tài liệu'}</p>
                          <p className="text-xs text-gray-500">{doc.fileName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a href={(import.meta as any).env.VITE_API_URL?.replace('/api/v1', '') + doc.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"><Eye size={18} /></a>
                        <a href={(import.meta as any).env.VITE_API_URL?.replace('/api/v1', '') + doc.fileUrl} download={doc.fileName} className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition"><Download size={18} /></a>
                      </div>
                    </div>
                  ))}
                  {(!selectedApplication.documents || selectedApplication.documents.length === 0) && (
                    <p className="text-sm text-gray-500 italic">Không có tài liệu nào.</p>
                  )}
                </div>
              </div>

              {/* Extracted Form Data */}
              {selectedApplication.formData && Object.keys(selectedApplication.formData).length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 font-bold text-blue-800 text-sm tracking-wider uppercase mb-3 border-b pb-2">
                    <FileText size={18} /> Thông tin trích xuất từ biểu mẫu / OCR
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    {Object.entries(selectedApplication.formData).map(([key, value]) => {
                      let label = key;
                      if (key === 'fullName') label = 'Họ và tên';
                      if (key === 'idNumber') label = 'CMND/CCCD';
                      if (key === 'phone') label = 'Số điện thoại';
                      if (key === 'email') label = 'Email';
                      return (
                        <div key={key}>
                          <p className="text-xs text-blue-600 uppercase font-semibold mb-1">{label}</p>
                          <p className="font-medium text-gray-900">{String(value) || '--'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* History */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 font-bold text-blue-800 text-sm tracking-wider uppercase mb-3 border-b pb-2">
                  <ClockIcon size={18} /> Lịch sử luân chuyển hồ sơ
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
                      {selectedApplication.histories?.map((h: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="p-3 whitespace-nowrap text-gray-500">{new Date(h.createdAt).toLocaleString('vi-VN')}</td>
                          <td className="p-3 font-medium text-gray-800">{h.action}</td>
                          <td className="p-3 text-gray-700">{h.actor?.fullName} <span className="text-xs text-gray-400">({h.actor?.role === 'citizen' ? 'Công dân' : 'Cán bộ'})</span></td>
                          <td className="p-3 text-gray-500 text-xs">{h.note}</td>
                        </tr>
                      ))}
                      {(!selectedApplication.histories || selectedApplication.histories.length === 0) && (
                        <tr><td colSpan={4} className="p-4 text-center italic text-gray-400">Chưa có lịch sử</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              {['PENDING', 'PROCESSING'].includes(selectedApplication.status) && (
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                  <Button variant="outline" onClick={() => setActionModal({ type: 'supplement' })}
                    className="border-orange-400 text-orange-600 hover:bg-orange-50 font-semibold">
                    <AlertCircle size={16} className="mr-2" /> Yêu cầu bổ sung
                  </Button>
                  <Button variant="outline" onClick={() => setActionModal({ type: 'reject' })}
                    className="border-red-400 text-red-600 hover:bg-red-50 font-semibold">
                    <XCircle size={16} className="mr-2" /> Từ chối
                  </Button>
                  <Button onClick={handleApprove} disabled={approveLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                    <CheckCircle size={16} className="mr-2" />
                    {approveLoading ? 'Đang duyệt...' : 'Duyệt hồ sơ'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Action Modal (Bổ sung / Từ chối) */}
      {actionModal && (
        <ActionModal
          type={actionModal.type}
          onConfirm={handleActionConfirm}
          onClose={() => setActionModal(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}

function ActivityIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
}
function ClockIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
}
