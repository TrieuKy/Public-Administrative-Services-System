import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, ArrowRight, Home, ArrowLeft, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import axiosInstance from '../../../utils/axiosInstance';

interface DocumentCheck {
  name: string;
  status: 'valid' | 'invalid' | 'missing';
  message: string;
}

interface ServiceObj {
  id: string;
  name: string;
  requiredDocs: string[];
}

export function ServiceFormPage() {
  const [services, setServices] = useState<ServiceObj[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [aiCheckResult, setAiCheckResult] = useState<DocumentCheck[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '', idNumber: '', phone: '', email: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/applications/services')
      .then(res => {
        const s = res.data?.data?.services || [];
        setServices(s);
        if (s.length > 0) setSelectedService(s[0].id);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmitData = async (isDraft = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!selectedService) throw new Error('Vui lòng chọn dịch vụ');
      if (!formData.fullName || !formData.idNumber || !formData.phone) throw new Error('Vui lòng điền các trường bắt buộc (*)');
      if (!isDraft && uploadedFiles.length === 0) throw new Error('Cần phải tải lên tài liệu để nộp hồ sơ');

      const appRes = await axiosInstance.post('/applications', {
        serviceId: selectedService,
        formData: formData
      });
      const appId = appRes.data.data.applicationId;

      for (const file of uploadedFiles) {
        const fileData = new FormData();
        fileData.append('file', file);
        fileData.append('docType', 'Tài liệu bắt buộc');
        await axiosInstance.post(`/applications/${appId}/documents`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (!isDraft) {
        await axiosInstance.post(`/applications/${appId}/submit`);
      }

      alert(isDraft ? 'Lưu nháp thành công!' : 'Nộp hồ sơ thành công!');
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      alert('Có lỗi xảy ra: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
    setAiCheckResult(null);
  };

  const handleAICheck = () => {
    setIsChecking(true);

    // Simulate AI checking
    setTimeout(() => {
      const required = services.find(s => s.id === selectedService)?.requiredDocs || [];
      const mockResults: DocumentCheck[] = required.map((doc, index) => {
        // Random result for demo
        const random = Math.random();
        if (uploadedFiles.length < required.length) {
          if (index < uploadedFiles.length) {
            return {
              name: doc,
              status: random > 0.2 ? 'valid' : 'invalid',
              message: random > 0.2
                ? 'Giấy tờ hợp lệ, rõ ràng, đầy đủ thông tin'
                : 'Giấy tờ không rõ ràng hoặc thiếu thông tin. Vui lòng tải lên lại'
            };
          } else {
            return {
              name: doc,
              status: 'missing',
              message: 'Chưa tải lên giấy tờ này'
            };
          }
        }
        return {
          name: doc,
          status: index === 0 && random < 0.3 ? 'invalid' : 'valid',
          message: index === 0 && random < 0.3
            ? 'Giấy tờ không đủ độ phân giải. Vui lòng chụp lại rõ hơn'
            : 'Giấy tờ hợp lệ, rõ ràng, đầy đủ thông tin'
        };
      });

      setAiCheckResult(mockResults);
      setIsChecking(false);
    }, 2000);
  };

  const allDocumentsValid = aiCheckResult?.every(doc => doc.status === 'valid') || false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link to="/" className="flex items-center gap-2 text-red-700 hover:text-red-800 transition">
              <ArrowLeft size={20} />
              <span className="font-medium">Quay lại trang chủ</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-700">
              <Home size={16} />
            </Link>
            <span>/</span>
            <span>Dịch vụ công</span>
            <span>/</span>
            <span className="text-red-700 font-medium">Nộp hồ sơ trực tuyến</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Service Selection */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">Chọn dịch vụ công</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedService(service.id);
                  setUploadedFiles([]);
                  setAiCheckResult(null);
                }}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedService === service.id
                    ? 'border-red-700 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{service.name}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Form Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">Thông tin người nộp hồ sơ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CMND/CCCD <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="001234567890"
                value={formData.idNumber}
                onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="0912345678"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </Card>

        {/* Document Upload */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">Tải lên hồ sơ</h2>



          {/* Upload Button */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition">
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <label className="cursor-pointer">
              <span className="text-red-700 font-medium hover:text-red-800">
                Chọn file để tải lên
              </span>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Hỗ trợ: JPG, PNG, PDF (tối đa 10MB/file)
            </p>
          </div>

          {/* Required Documents List */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <FileText size={18} />
              Yêu cầu giấy tờ cần thiết trong thủ tục này:
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 mt-3">
              {services.find(s => s.id === selectedService)?.requiredDocs?.map((doc, index) => {
                const isForm = doc.toLowerCase().includes('tờ khai') || doc.toLowerCase().includes('mẫu') || doc.toLowerCase().includes('đơn');
                return (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="flex-1">{doc}</span>
                    {isForm && (
                      <a href="#" onClick={(e) => { e.preventDefault(); alert('Xin lỗi, file biểu mẫu đang được bổ sung!'); }} className="flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition">
                        <Download size={14} />
                        Tải biểu mẫu
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Đã tải lên ({uploadedFiles.length} file):
              </h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="text-gray-400" size={24} />
                    <span className="flex-1 text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Check Button */}
          {uploadedFiles.length > 0 && !aiCheckResult && (
            <Button
              onClick={handleAICheck}
              disabled={isChecking}
              className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-gray-900 py-3"
            >
              {isChecking ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                  AI đang kiểm tra hồ sơ...
                </>
              ) : (
                <>
                  <AlertCircle size={20} className="mr-2" />
                  Kiểm tra hồ sơ bằng AI
                </>
              )}
            </Button>
          )}

          {/* AI Check Results */}
          {aiCheckResult && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-600" />
                Kết quả kiểm tra tự động:
              </h3>
              {aiCheckResult.map((doc, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    doc.status === 'valid'
                      ? 'border-green-200 bg-green-50'
                      : doc.status === 'invalid'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {doc.status === 'valid' ? (
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
                    ) : doc.status === 'invalid' ? (
                      <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                    ) : (
                      <AlertCircle className="text-gray-400 flex-shrink-0 mt-0.5" size={24} />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{doc.name}</div>
                      <div className={`text-sm ${
                        doc.status === 'valid'
                          ? 'text-green-700'
                          : doc.status === 'invalid'
                          ? 'text-red-700'
                          : 'text-gray-600'
                      }`}>
                        {doc.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => handleSubmitData(true)}
            disabled={isSubmitting}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
          >
            Lưu nháp
          </Button>
          <Button
            disabled={!allDocumentsValid || isSubmitting}
            onClick={() => handleSubmitData(false)}
            className={`flex-1 py-3 ${
              allDocumentsValid && !isSubmitting
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Nộp hồ sơ'}
            {!isSubmitting && <ArrowRight size={20} className="ml-2" />}
          </Button>
        </div>

        {!allDocumentsValid && aiCheckResult && (
          <p className="text-center text-sm text-red-600 mt-3">
            Vui lòng hoàn thiện và sửa các giấy tờ chưa hợp lệ trước khi nộp hồ sơ
          </p>
        )}
      </div>
    </div>
  );
}
