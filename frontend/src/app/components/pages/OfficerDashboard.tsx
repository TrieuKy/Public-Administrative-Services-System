import { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  User,
  Calendar,
  TrendingUp,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import axiosInstance from '../../../utils/axiosInstance';

interface Application {
  id: string;
  code: string;
  serviceName: string;
  citizenName: string;
  citizenId: string;
  submittedDate: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected' | 'need-supplement';
  priority: 'normal' | 'urgent';
  aiSuggestion?: 'approve' | 'reject' | 'need-review';
  aiConfidence?: number;
}

export function OfficerDashboard() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'NEED_MORE' | 'REJECTED'>('PENDING');
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

  const getAISuggestionColor = (suggestion?: 'approve' | 'reject' | 'need-review') => {
    switch (suggestion) {
      case 'approve':
        return 'text-green-700 bg-green-100 border-green-300';
      case 'reject':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'need-review':
        return 'text-orange-700 bg-orange-100 border-orange-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getAISuggestionText = (suggestion?: 'approve' | 'reject' | 'need-review') => {
    switch (suggestion) {
      case 'approve':
        return 'Đề xuất: Duyệt';
      case 'reject':
        return 'Đề xuất: Từ chối';
      case 'need-review':
        return 'Đề xuất: Cần xem xét';
      default:
        return 'Chưa phân tích';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link to="/" className="text-sm text-gray-600 hover:text-red-700 transition flex items-center gap-1">
                  <ArrowLeft size={16} />
                  <span>Trang chủ</span>
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-red-800">Dashboard Cán bộ</h1>
              <p className="text-sm text-gray-600">UBND Xã/Phường - Bộ phận một cửa</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="text-gray-600" size={20} />
                <span className="text-gray-700">Nguyễn Văn B</span>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300">
                <LogOut size={16} className="mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Chờ xử lý</p>
                <p className="text-3xl font-bold text-blue-900">{stats.pending}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <Clock className="text-blue-700" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 mb-1">Đang xử lý</p>
                <p className="text-3xl font-bold text-orange-900">{stats.processing}</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-lg">
                <AlertCircle className="text-orange-700" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Đã hoàn thành</p>
                <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <CheckCircle className="text-green-700" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">Tổng hồ sơ</p>
                <p className="text-3xl font-bold text-purple-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <FileText className="text-purple-700" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã hồ sơ, tên công dân..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <Button variant="outline" className="border-gray-300">
              <Filter size={18} className="mr-2" />
              Bộ lọc
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              selectedTab === 'all'
                ? 'bg-red-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tất cả ({stats.total})
          </button>
          <button
            onClick={() => setSelectedTab('PENDING')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              selectedTab === 'PENDING'
                ? 'bg-red-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Chờ xử lý ({stats.pending})
          </button>
          <button
            onClick={() => setSelectedTab('PROCESSING')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              selectedTab === 'PROCESSING'
                ? 'bg-red-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Đang xử lý ({stats.processing})
          </button>
          <button
            onClick={() => setSelectedTab('COMPLETED')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              selectedTab === 'COMPLETED'
                ? 'bg-red-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Đã hoàn thành ({stats.completed})
          </button>
          <button
            onClick={() => setSelectedTab('NEED_MORE')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              selectedTab === 'NEED_MORE'
                ? 'bg-orange-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cần bổ sung ({stats.needMore})
          </button>
          <button
            onClick={() => setSelectedTab('REJECTED')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              selectedTab === 'REJECTED'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Đã từ chối ({stats.rejected})
          </button>
        </div>

        {/* Applications Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mã hồ sơ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Dịch vụ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Công dân</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày nộp</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">AI gợi ý</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Độ tin cậy</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{app.applicationCode}</span>
                        {app.priority === 'urgent' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Khẩn</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{app.service?.name}</td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-gray-900">{app.citizen?.fullName}</div>
                        <div className="text-sm text-gray-500">{app.citizen?.cccd}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(app.submittedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-400 text-sm">-</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-400 text-sm">-</span>
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                           // fetching detail for the modal
                           try {
                             const detail = await axiosInstance.get(`/officer/applications/${app.id}`);
                             setSelectedApplication(detail.data.data);
                           } catch (err) {
                             console.error("Lỗi lấy chi tiết hồ sơ", err);
                           }
                        }}
                        className="border-red-700 text-red-700 hover:bg-red-50"
                      >
                        <Eye size={16} className="mr-1" />
                        Xem
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedApplication.service?.name}</h2>
                <p className="text-gray-600">Mã hồ sơ: {selectedApplication.applicationCode}</p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={28} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Citizen Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Thông tin công dân</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ và tên</p>
                    <p className="font-medium">{selectedApplication.citizen?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CMND/CCCD</p>
                    <p className="font-medium">{selectedApplication.citizen?.cccd}</p>
                  </div>
                </div>
              </div>



              {/* Documents */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Giấy tờ đã nộp</h3>
                <div className="space-y-2">
                  {selectedApplication.documents && selectedApplication.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="text-gray-400" size={20} />
                        <span className="text-gray-900">{doc.fileName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <a href={(import.meta as any).env.VITE_API_URL?.replace('/api/v1', '') + doc.fileUrl} target="_blank" rel="noreferrer">
                           <Button size="sm" variant="outline">Xem</Button>
                         </a>
                      </div>
                    </div>
                  ))}
                  {(!selectedApplication.documents || selectedApplication.documents.length === 0) && (
                    <p className="text-sm text-gray-500">Chưa có giấy tờ</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t">
                {['PENDING', 'PROCESSING'].includes(selectedApplication.status) && (
                  <>
                    <Button
                      onClick={async () => {
                        try {
                          await axiosInstance.patch(`/officer/applications/${selectedApplication.id}/approve`, { note: 'Duyệt thành công' });
                          alert('Đã duyệt hồ sơ!');
                          setSelectedApplication(null);
                          fetchApplications();
                        } catch (e: any) { alert(e.response?.data?.message || 'Có lỗi xảy ra'); }
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Duyệt hồ sơ
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const note = prompt('Nội dung cần bổ sung:');
                        if (!note) return;
                        try {
                          await axiosInstance.patch(`/officer/applications/${selectedApplication.id}/request-supplement`, { requiredDocs: [note] });
                          alert('Đã gửi yêu cầu bổ sung!');
                          setSelectedApplication(null);
                          fetchApplications();
                        } catch (e: any) { alert(e.response?.data?.message || 'Có lỗi xảy ra'); }
                      }}
                      className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      <AlertCircle size={18} className="mr-2" />
                      Yêu cầu bổ sung
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
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle size={18} className="mr-2" />
                      Từ chối
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
