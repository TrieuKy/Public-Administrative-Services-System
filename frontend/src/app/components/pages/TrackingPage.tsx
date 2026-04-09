import { useState, useEffect } from 'react';
import { Search, FileText, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import axiosInstance from '../../../utils/axiosInstance';

export function TrackingPage() {
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    axiosInstance.get('/applications')
      .then(res => {
        setMyApplications(res.data?.data?.applications || []);
      })
      .catch(console.error);
  }, []);

  const handleSearch = async (codeOverride?: string) => {
    const code = (typeof codeOverride === 'string' ? codeOverride : searchCode).trim().toUpperCase();
    if (!code) { setSearchResult(null); return; }
    
    setIsSearching(true);
    const found = myApplications.find(item => item.applicationCode === code);
    
    if (found) {
       try {
         const detailRes = await axiosInstance.get(`/applications/${found.id}`);
         setSearchResult(detailRes.data.data);
       } catch(err) {
         setSearchResult(found); // fallback
       }
    } else {
       setSearchResult(null);
    }
    setIsSearching(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'PROCESSING': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'REJECTED': case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200';
      case 'NEED_MORE': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="text-green-600" size={24} />;
      case 'PROCESSING': return <Clock className="text-blue-600" size={24} />;
      case 'REJECTED': case 'CANCELLED': return <XCircle className="text-red-600" size={24} />;
      case 'NEED_MORE': return <AlertCircle className="text-orange-600" size={24} />;
      default: return <FileText className="text-gray-600" size={24} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Đã hoàn thành';
      case 'PROCESSING': return 'Đang xử lý';
      case 'REJECTED': return 'Từ chối';
      case 'CANCELLED': return 'Đã rút';
      case 'NEED_MORE': return 'Cần bổ sung';
      case 'DRAFT': return 'Bản nháp';
      default: return 'Đang chờ duyệt';
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '--';
    const dt = new Date(d);
    return dt.toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-orange-100 transition mb-4">
            <ArrowLeft size={20} />
            <span>Quay lại trang chủ</span>
          </Link>
          <h1 className="text-3xl font-bold mb-4">Tra cứu hồ sơ</h1>
          <p className="text-orange-100 mb-8">
            Nhập mã hồ sơ hoặc CMND/CCCD để tra cứu tình trạng xử lý
          </p>

          {/* Search Box */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Nhập mã hồ sơ (VD: HS2026040001)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
              <Button
                onClick={() => handleSearch()}
                className="bg-red-700 hover:bg-red-800 text-white px-8 py-3"
              >
                <Search size={20} className="mr-2" />
                Tra cứu
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Search Result */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {searchResult ? (
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-lg">
                {getStatusIcon(searchResult.status)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchResult.service?.name}
                </h2>
                <p className="text-gray-600">Mã hồ sơ: {searchResult.applicationCode}</p>
              </div>
              <div className={`px-4 py-2 rounded-full border-2 ${getStatusColor(searchResult.status)}`}>
                <span className="font-medium">{getStatusText(searchResult.status)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ngày nộp</h3>
                <p className="text-gray-900">{formatDate(searchResult.submittedAt || searchResult.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ngày dự kiến hoàn thành</h3>
                <p className="text-gray-900">{searchResult.status === 'COMPLETED' ? formatDate(searchResult.completedAt) : '--'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cán bộ xử lý</h3>
                <p className="text-gray-900">{searchResult.officer?.fullName || '--'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Bước hiện tại</h3>
                <p className="text-gray-900 font-medium">{getStatusText(searchResult.status)}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Lịch sử xử lý:</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-white" size={18} />
                    </div>
                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <p className="font-medium text-gray-900">Tiếp nhận hồ sơ</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(searchResult.createdAt)} - Hồ sơ đã được khởi tạo
                    </p>
                  </div>
                </div>

                {['PENDING', 'PROCESSING', 'COMPLETED', 'NEED_MORE', 'REJECTED'].includes(searchResult.status) && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        ['PROCESSING', 'COMPLETED'].includes(searchResult.status)
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}>
                        <Clock className="text-white" size={18} />
                      </div>
                      {searchResult.status !== 'PENDING' && (
                        <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-gray-900">Nộp hồ sơ</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(searchResult.submittedAt || searchResult.createdAt)} - Công dân đã xác nhận nộp hồ sơ
                      </p>
                    </div>
                  </div>
                )}

                {searchResult.status === 'COMPLETED' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white" size={18} />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Hoàn thành</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(searchResult.completedAt)} - Chúc mừng, hồ sơ đã hoàn thành và được duyệt!
                      </p>
                    </div>
                  </div>
                )}

                {searchResult.status === 'NEED_MORE' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-white" size={18} />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Yêu cầu bổ sung</p>
                      <p className="text-sm text-gray-600 mb-2">
                         Cán bộ yêu cầu bổ sung thêm giấy tờ liên đới
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button
                onClick={() => setShowDetailModal(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Xem chi tiết đầy đủ
              </Button>
              <Button variant="outline" className="flex-1 border-red-700 text-red-700 hover:bg-red-50">
                In phiếu tra cứu
              </Button>
              {searchResult.status === 'NEED_MORE' && (
                <Button className="flex-1 bg-red-700 hover:bg-red-800 text-white">
                  Bổ sung hồ sơ
                </Button>
              )}
            </div>
          </Card>
        ) : searchCode && !isSearching ? (
          <Card className="p-12 text-center">
            <XCircle className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Không tìm thấy hồ sơ
            </h3>
            <p className="text-gray-600">
              Vui lòng kiểm tra lại mã hồ sơ hoặc liên hệ hỗ trợ
            </p>
          </Card>
        ) : (
          <div>
            {!searchCode && myApplications.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Danh sách hồ sơ của bạn ({myApplications.length})</h3>
                <div className="space-y-4">
                  {myApplications.map((app) => (
                    <div 
                      key={app.id} 
                      className="p-4 bg-white border border-gray-200 rounded-lg hover:border-red-300 cursor-pointer transition flex items-center justify-between"
                      onClick={() => {
                        setSearchCode(app.applicationCode);
                        handleSearch(app.applicationCode);
                      }}
                    >
                      <div>
                        <div className="font-bold text-gray-900">{app.service?.name}</div>
                        <div className="text-sm text-gray-500">Mã HS: <span className="font-medium text-black">{app.applicationCode}</span> | Nộp lúc: {formatDate(app.submittedAt || app.createdAt)}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {getStatusText(app.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!searchCode && myApplications.length === 0 && (
              <Card className="p-12 text-center">
                <Search className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Chưa có hồ sơ nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Bạn chưa nộp hồ sơ nào trên hệ thống hoặc cần đăng nhập
                </p>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {searchResult && (
        <ApplicationDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          application={{
            code: searchResult.applicationCode,
            serviceName: searchResult.service?.name,
            submitter: searchResult.citizen?.fullName || 'Công dân',
            processingTime: formatDate(searchResult.completedAt || searchResult.estimatedDate),
            fee: 'Miễn phí',
            status: searchResult.status === 'COMPLETED' ? 'completed' :
                   searchResult.status === 'REJECTED' ? 'rejected' :
                   searchResult.status === 'PROCESSING' ? 'processing' : 'submitted',
            documents: searchResult.documents?.map((d: any) => ({
              name: d.docType || d.fileName,
              filename: d.fileName,
              fileUrl: d.fileUrl
            })) || [],
            history: [] // Trống cho phiên bản rút gọn, vì sẽ fetch trong modal nếu cần.
          }}
        />
      )}
    </div>
  );
}
