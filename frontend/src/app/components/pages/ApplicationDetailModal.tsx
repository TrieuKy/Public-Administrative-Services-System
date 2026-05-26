import { useState, useEffect } from 'react';
import { X, Download, Clock, FileText, CheckCircle, AlertCircle, XCircle, DollarSign, User, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import axiosInstance from '../../../utils/axiosInstance';

interface Document {
  name: string;
  filename: string;
  fileUrl?: string;
}

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    code: string;
    serviceName: string;
    submitter: string;
    processingTime: string;
    fee: string;
    status: 'submitted' | 'processing' | 'completed' | 'rejected';
    documents: Document[];
    history: any[];
  };
}

const ACTION_ICON: Record<string, JSX.Element> = {
  'Nộp hồ sơ':         <FileText size={14} className="text-blue-600" />,
  'Tiếp nhận':          <CheckCircle size={14} className="text-green-600" />,
  'Đang xử lý':         <Clock size={14} className="text-blue-500" />,
  'Yêu cầu bổ sung':   <AlertCircle size={14} className="text-orange-500" />,
  'Đóng lệ phí':        <DollarSign size={14} className="text-emerald-600" />,
  'Hoàn thành':         <CheckCircle size={14} className="text-green-700" />,
  'Từ chối':            <XCircle size={14} className="text-red-600" />,
};

const ACTION_COLOR: Record<string, string> = {
  'Nộp hồ sơ':        'text-blue-700 bg-blue-50 border-blue-200',
  'Tiếp nhận':         'text-green-700 bg-green-50 border-green-200',
  'Đang xử lý':        'text-blue-700 bg-blue-50 border-blue-200',
  'Yêu cầu bổ sung':  'text-orange-700 bg-orange-50 border-orange-200',
  'Đóng lệ phí':       'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Hoàn thành':        'text-green-700 bg-green-50 border-green-200',
  'Từ chối':           'text-red-700 bg-red-50 border-red-200',
};

function formatDateTime(d: string) {
  if (!d) return '--';
  const dt = new Date(d);
  return dt.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function ApplicationDetailModal({ isOpen, onClose, application }: ApplicationDetailModalProps) {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !application?.code) return;
    setLoading(true);
    setDetail(null);
    // Fetch full detail including histories by application code via search
    axiosInstance.get(`/applications/search?code=${application.code}`)
      .then(res => setDetail(res.data?.data))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [isOpen, application?.code]);

  if (!isOpen) return null;

  const getStatusBadge = () => {
    switch (application.status) {
      case 'submitted':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">Đã nộp</span>;
      case 'processing':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium">Đang xử lý</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">Hoàn thành</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">Từ chối</span>;
      default:
        return null;
    }
  };

  const histories: any[] = detail?.histories || [];
  const docs: Document[] = detail?.documents?.map((d: any) => ({
    name: d.docType || d.fileName,
    filename: d.fileName,
    fileUrl: d.fileUrl,
  })) || application.documents || [];

  // Build enhanced timeline rows from histories
  const timelineRows = histories.map((h: any) => ({
    time: h.createdAt,
    action: h.action,
    actor: h.actor?.fullName || (h.actorId ? 'Cán bộ' : 'Công dân'),
    actorRole: h.actor?.role || '',
    note: h.note || '',
  }));

  // Also add payment info if available
  const paymentInfo = detail?.paymentStatus === 'PAID' ? {
    paidAt: detail.paidAt,
    amount: detail.feeAmount,
    paymentCode: detail.paymentCode,
  } : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-red-700" size={24} />
            <h2 className="text-lg font-bold text-gray-900">CHI TIẾT HỒ SƠ</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Application Info Card */}
          <Card className="p-5 mb-6 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
            <div className="flex items-start justify-between mb-4">
              <div className="px-3 py-1 bg-white border border-red-300 rounded text-red-700 font-mono text-sm">
                {application.code}
              </div>
              {getStatusBadge()}
            </div>

            <h3 className="text-blue-700 font-medium text-lg mb-4 leading-relaxed">
              {application.serviceName}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-1">
                <User size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-gray-500">Người nộp: </span>
                  <span className="font-medium text-gray-900">{detail?.citizen?.fullName || application.submitter}</span>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <Clock size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-gray-500">Ngày nộp: </span>
                  <span className="font-medium text-gray-900">
                    {detail?.submittedAt ? formatDateTime(detail.submittedAt) : application.processingTime}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <User size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-gray-500">Cán bộ xử lý: </span>
                  <span className="font-medium text-gray-900">{detail?.officer?.fullName || '--'}</span>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <Clock size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-gray-500">Dự kiến hoàn thành: </span>
                  <span className="font-medium text-gray-900">
                    {detail?.completedAt
                      ? formatDateTime(detail.completedAt)
                      : (detail?.estimatedDate ? formatDateTime(detail.estimatedDate) : '--')}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <DollarSign size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-gray-500">Lệ phí: </span>
                  <span className="font-medium text-gray-900">
                    {detail?.feeAmount ? new Intl.NumberFormat('vi-VN').format(detail.feeAmount) + ' đ' : 'Miễn phí'}
                  </span>
                  {detail?.paymentStatus === 'PAID' && (
                    <span className="ml-2 inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold">Đã đóng</span>
                  )}
                  {detail?.paymentStatus === 'UNPAID' && (
                    <span className="ml-2 inline-block px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded font-semibold">Chưa đóng</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Documents Section */}
          <div className="mb-6">
            <h3 className="text-blue-800 font-bold text-base mb-3 pb-2 border-b-2 border-blue-200">
              GIẤY TỜ ĐÍNH KÈM
            </h3>
            {docs.length === 0 ? (
              <p className="text-gray-400 text-sm italic">Không có giấy tờ đính kèm.</p>
            ) : (
              <div className="space-y-2">
                {docs.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-red-600" size={20} />
                      <div>
                        <div className="text-gray-900 font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">{doc.filename}</div>
                      </div>
                    </div>
                    {doc.fileUrl ? (
                      <a href={((import.meta as any).env.VITE_API_URL || 'http://localhost:3001/api/v1')?.replace('/api/v1', '') + doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-100 rounded transition">
                        <Download className="text-blue-600" size={20} />
                      </a>
                    ) : (
                      <button className="p-2 hover:bg-gray-100 rounded transition text-gray-300 cursor-not-allowed">
                        <Download size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transfer History Section */}
          <div className="print-section">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-base mb-4 pb-2 border-b-2 border-blue-200">
              <Clock size={20} />
              <h3>LỊCH SỬ LUÂN CHUYỂN HỒ SƠ</h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                <Loader2 size={20} className="animate-spin" />
                <span>Đang tải lịch sử luân chuyển...</span>
              </div>
            ) : timelineRows.length === 0 ? (
              <div className="text-center py-8 text-gray-400 italic text-sm bg-gray-50 rounded border border-dashed border-gray-200">
                Chưa có lịch sử luân chuyển hồ sơ.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-3 text-left font-bold text-blue-900 border-b border-gray-200 whitespace-nowrap">
                        THỜI GIAN
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-blue-900 border-b border-gray-200">
                        HÀNH ĐỘNG
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-blue-900 border-b border-gray-200 whitespace-nowrap">
                        NGƯỜI THỰC HIỆN
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-blue-900 border-b border-gray-200">
                        GHI CHÚ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timelineRows.map((row, index) => {
                      const colorClass = ACTION_COLOR[row.action] || 'text-gray-700 bg-white border-gray-200';
                      const icon = ACTION_ICON[row.action] || <FileText size={14} className="text-gray-500" />;
                      return (
                        <tr key={index} className={`border-b last:border-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50/40 transition`}>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-mono text-xs">
                            {formatDateTime(row.time)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
                              {icon}
                              {row.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <User size={13} className="text-gray-400" />
                              <span className="font-medium">{row.actor}</span>
                              {row.actorRole === 'officer' && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">Cán bộ</span>
                              )}
                              {row.actorRole === 'admin' && (
                                <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-medium">Quản trị</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 italic">
                            {row.note || <span className="text-gray-300">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Payment detail row if paid */}
            {paymentInfo && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-sm">
                <DollarSign size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="font-semibold text-emerald-800">Đã đóng lệ phí</span>
                  {paymentInfo.paidAt && (
                    <span className="ml-2 text-emerald-700">lúc {formatDateTime(paymentInfo.paidAt)}</span>
                  )}
                  {paymentInfo.amount && (
                    <span className="ml-2 font-bold text-emerald-900">
                      — {new Intl.NumberFormat('vi-VN').format(paymentInfo.amount)} đ
                    </span>
                  )}
                  {paymentInfo.paymentCode && (
                    <span className="ml-2 text-xs text-gray-500">(Mã giao dịch: <span className="font-mono font-bold text-emerald-800">{paymentInfo.paymentCode}</span>)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 font-medium transition"
          >
            Đóng
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-red-700 text-white rounded hover:bg-red-800 font-medium shadow-sm transition flex items-center gap-2"
          >
            <FileText size={18} /> In phiếu tra cứu
          </button>
        </div>
      </div>
    </div>
  );
}
