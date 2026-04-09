import { X, Download, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';

interface Document {
  name: string;
  filename: string;
  fileUrl?: string;
}

interface HistoryEntry {
  time: string;
  action: string;
  actor: string;
  note: string;
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
    history: HistoryEntry[];
  };
}

export function ApplicationDetailModal({ isOpen, onClose, application }: ApplicationDetailModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-red-700" size={24} />
            <h2 className="text-lg font-bold text-gray-900">CHI TIẾT HỒ SƠ</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
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

            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-gray-700 font-medium min-w-[140px]">Người nộp:</span>
                <span className="text-gray-900">{application.submitter}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-700 font-medium min-w-[140px]">Thời gian giải quyết:</span>
                <span className="text-gray-900">{application.processingTime}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-700 font-medium min-w-[140px]">Lệ phí:</span>
                <span className="text-gray-900">{application.fee}</span>
              </div>
            </div>
          </Card>

          {/* Documents Section */}
          <div className="mb-6">
            <h3 className="text-blue-800 font-bold text-base mb-3 pb-2 border-b-2 border-blue-200">
              GIẤY TỜ ĐÍNH KÈM
            </h3>
            <div className="space-y-2">
              {application.documents.map((doc, index) => (
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
                  {doc.fileUrl && (
                    <a href={(import.meta as any).env.VITE_API_URL?.replace('/api/v1', '') + doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-100 rounded transition">
                      <Download className="text-blue-600" size={20} />
                    </a>
                  )}
                  {!doc.fileUrl && (
                    <button className="p-2 hover:bg-gray-100 rounded transition text-gray-300 cursor-not-allowed">
                      <Download size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* History Section */}
          <div>
            <div className="flex items-center gap-2 text-blue-800 font-bold text-base mb-3 pb-2 border-b-2 border-blue-200">
              <Clock size={20} />
              <h3>LỊCH SỬ LUÂN CHUYỂN HỒ SƠ</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-4 py-3 text-left text-sm font-bold text-blue-900 border border-gray-300">
                      THỜI GIAN
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-blue-900 border border-gray-300">
                      HÀNH ĐỘNG
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-blue-900 border border-gray-300">
                      NGƯỜI THỰC HIỆN
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-blue-900 border border-gray-300">
                      GHI CHÚ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {application.history.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300 whitespace-nowrap">
                        {entry.time}
                      </td>
                      <td className="px-4 py-3 text-sm border border-gray-300">
                        <span className={`font-medium ${
                          entry.action.includes('Nộp') ? 'text-red-600' :
                          entry.action.includes('Duyệt') ? 'text-green-600' :
                          entry.action.includes('Từ chối') ? 'text-red-600' :
                          'text-gray-900'
                        }`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">
                        {entry.actor}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border border-gray-300">
                        {entry.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
