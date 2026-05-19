import { useState, useEffect, useRef } from 'react';
import {
  Upload, FileText, CheckCircle, XCircle, AlertCircle,
  ArrowRight, Home, ArrowLeft, Loader2, Key, RefreshCw,
  LayersIcon, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axiosInstance';

// ── Types ─────────────────────────────────────────────────────────────────
interface UploadedFileEntry {
  file: File;
  docType: string;
}

interface DocGroup {
  groupLabel: string;
  docCategory: string;
  imageIndexes: number[];
  files: { index: number; fileName: string }[];
  isValid: boolean;
  isReadable: boolean;
  extractedFields: Record<string, any>;
  validationErrors: string[];
  warningLevel: 'ok' | 'warning' | 'error';
  issues: string[];
  message: string;
}

interface ServiceObj {
  id: string;
  name: string;
  category: string;
  agency: string;
  processingTime: string;
  level: string;
  fee: string;
  currentFee?: number; // số thực tế từ database
  procedures?: string;
  workflow?: string;
  requiredDocs: any[];
}

// ── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'individual',   label: 'Công dân' },
  { value: 'business',     label: 'Hộ kinh doanh' },
  { value: 'organization', label: 'Tổ chức' },
];

const CAT_ICON: Record<string, string> = {
  cccd: '🪪',
  ho_khau: '🏠',
  giay_khai_sinh: '👶',
  giay_ket_hon: '💍',
  giay_phep_kinh_doanh: '🏢',
  bang_lai_xe: '🚗',
  khac: '📄',
};

// ── Component ──────────────────────────────────────────────────────────────
export function ServiceFormPage() {
  const [services, setServices] = useState<ServiceObj[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('individual');
  const [fileEntries, setFileEntries] = useState<UploadedFileEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copies, setCopies] = useState(1); // số lượng bộ hồ sơ
  const [paymentResult, setPaymentResult] = useState<any>(null); // hiện modal sau nộp

  // AI states
  const [apiKey, setApiKey]           = useState('');
  const [isSettingKey, setIsSettingKey] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [docGroups, setDocGroups]     = useState<DocGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  // Form fields contact — email không auto-fill
  const [formFields, setFormFields] = useState<Record<string, string>>({
    fullName: '', idNumber: '', phone: '', email: '',
  });
  // Fields trích xuất theo nhóm giấy tờ (có thể edit)
  const [groupFields, setGroupFields] = useState<Record<number, Record<string, string>>>({});
  const [expandedInfoGroups, setExpandedInfoGroups] = useState<Record<number, boolean>>({});

  const navigate     = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load services
  useEffect(() => {
    axiosInstance.get('/services?limit=100')
      .then(res => {
        const s = res.data?.data?.services || [];
        setServices(s);
        // Auto-select service từ URL param ?serviceId=...
        const paramServiceId = searchParams.get('serviceId');
        const paramCategory  = searchParams.get('category');
        if (paramServiceId) {
          const found = s.find((sv: ServiceObj) => sv.id === paramServiceId);
          if (found) {
            setSelectedService(found.id);
            setActiveCategory(found.category);
            return;
          }
        }
        // Auto-select category từ URL param ?category=...
        const cat = paramCategory || 'individual';
        setActiveCategory(cat);
        const first = s.find((sv: ServiceObj) => sv.category === cat);
        if (first) setSelectedService(first.id);
        else if (s.length > 0) setSelectedService(s[0].id);
      })
      .catch(err => console.error(err));
  }, []);

  // Pre-fill từ profile (KHÔNG auto-fill email)
  useEffect(() => {
    axiosInstance.get('/auth/me')
      .then(res => {
        const p = res.data?.data;
        if (p) {
          setFormFields(prev => ({
            ...prev,
            fullName: p.fullName || '',
            idNumber: p.cccd    || '',
            phone:    p.phone   || '',
            // email: intentionally NOT auto-filled
          }));
        }
      })
      .catch(() => {});
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const first = services.find(s => s.category === cat);
    if (first) {
      setSelectedService(first.id);
      setFileEntries([]);
      setDocGroups([]);
      setHasAnalyzed(false);
    }
  };

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) return toast.warn('Vui lòng nhập API key');
    setIsSettingKey(true);
    try {
      await axiosInstance.post('/ai/set-key', { apiKey: apiKey.trim() });
      toast.success('Đã lưu Gemini API Key cho phiên này');
    } catch (err: any) {
      toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSettingKey(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length === 0) return;

    setFileEntries(prev => [
      ...prev,
      ...newFiles.map(file => ({ file, docType: file.name })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setHasAnalyzed(false);
    setDocGroups([]);
  };

  const removeFile = (index: number) => {
    setFileEntries(prev => prev.filter((_, i) => i !== index));
    setHasAnalyzed(false);
    setDocGroups([]);
    setGroupFields({});
  };

  const toggleGroup = (idx: number) =>
    setExpandedGroups(prev => ({ ...prev, [idx]: !prev[idx] }));

  const toggleInfoGroup = (idx: number) =>
    setExpandedInfoGroups(prev => ({ ...prev, [idx]: !prev[idx] }));

  const handleGroupFieldChange = (groupIdx: number, key: string, value: string) =>
    setGroupFields(prev => ({
      ...prev,
      [groupIdx]: { ...(prev[groupIdx] || {}), [key]: value },
    }));

  // ── Phân tích AI — gửi tất cả ảnh cùng 1 lần ───────────────────────
  const handleAnalyzeFiles = async () => {
    if (fileEntries.length === 0) return toast.warn('Vui lòng tải lên tài liệu trước');
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      fileEntries.forEach(entry => formData.append('files', entry.file));

      // Gửi thông tin dịch vụ để AI kiểm tra đúng/thiếu/thừa giấy tờ
      if (service) {
        const reqTypes = [...new Set(requiredDocs.map(mapDocToCategory))];
        formData.append('serviceContext', JSON.stringify({
          serviceName:      service.name,
          requiredDocTypes: reqTypes,
        }));
      }

      const res = await axiosInstance.post('/ai/ocr-group', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 90000,
      });

      const { groups, mergedFields } = res.data.data;

      // ── Post-process: lọc false-positive về ngày từ AI ──────────────────
      // AI đôi khi dùng ngày training cũ để so sánh, gây cảnh báo sai về "ngày tương lai"
      const now = new Date();
      const sanitizedGroups = (groups || []).map((g: DocGroup) => {
        const issueDate = g.extractedFields?.issueDate;

        // Kiểm tra ngày cấp: nếu AI báo "tương lai" nhưng ngày đó đã qua → bỏ warning
        const issueDateParsed = issueDate ? new Date(issueDate) : null;
        const isFutureIssueDateFalsePositive =
          issueDateParsed && issueDateParsed <= now &&
          g.issues?.some((iss: string) => /tương lai|future|sau ngày/i.test(iss));

        if (isFutureIssueDateFalsePositive) {
          return {
            ...g,
            // Xóa issues về ngày sai
            issues: (g.issues || []).filter(
              (iss: string) => !/tương lai|future|sau ngày.*cấp|cấp.*sau ngày/i.test(iss)
            ),
            // Nếu FAKE_DOCUMENT chỉ vì ngày cấp → hạ xuống warning hoặc bỏ
            validationErrors: (g.validationErrors || []).filter(
              (code: string) => code !== 'FAKE_DOCUMENT'
            ),
            // Recalculate warningLevel
            warningLevel: (() => {
              const remaining = (g.validationErrors || []).filter((c: string) => c !== 'FAKE_DOCUMENT');
              const errorCodes = ['BLURRY_IMAGE', 'MISMATCHED_SIDES', 'FAKE_DOCUMENT'];
              if (remaining.some((c: string) => errorCodes.includes(c))) return 'error';
              if (remaining.length > 0) return 'warning';
              return 'ok';
            })(),
            isValid: (() => {
              const remaining = (g.validationErrors || []).filter((c: string) => c !== 'FAKE_DOCUMENT');
              const errorCodes = ['BLURRY_IMAGE', 'MISMATCHED_SIDES', 'FAKE_DOCUMENT'];
              return !remaining.some((c: string) => errorCodes.includes(c));
            })(),
          };
        }
        return g;
      });

      setDocGroups(sanitizedGroups);

      // Mặc định expand tất cả groups
      const expanded: Record<number, boolean> = {};
      const expandedInfo: Record<number, boolean> = {};
      const gf: Record<number, Record<string, string>> = {};

      (groups || []).forEach((g: DocGroup, i: number) => {
        expanded[i] = true;
        expandedInfo[i] = true;
        // Lưu extractedFields có thể edit cho từng group
        const fields: Record<string, string> = {};
        Object.entries(g.extractedFields || {}).forEach(([k, v]) => {
          if (v && v !== 'null' && v !== '' && typeof v === 'string') {
            fields[k] = v;
          }
        });
        gf[i] = fields;
      });

      setExpandedGroups(expanded);
      setExpandedInfoGroups(expandedInfo);
      setGroupFields(gf);

      // Chỉ merge các trường contact vào formFields (không ghi đè email)
      setFormFields(prev => ({
        ...prev,
        fullName: mergedFields?.fullName || prev.fullName,
        idNumber: mergedFields?.idNumber || prev.idNumber,
        phone:    prev.phone,   // user tự nhập
        email:    prev.email,   // user tự nhập
      }));

      setHasAnalyzed(true);

      const hasInvalid = (groups || []).some((g: DocGroup) => !g.isValid || !g.isReadable);
      if (hasInvalid) {
        toast.warn('Một số tài liệu có vấn đề. Vui lòng kiểm tra từng nhóm.');
      } else {
        toast.success('Phân tích thành công! Vui lòng kiểm tra và bổ sung thông tin.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Có lỗi khi phân tích: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFieldChange = (key: string, value: string) =>
    setFormFields(prev => ({ ...prev, [key]: value }));

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmitData = async (isDraft = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!selectedService) throw new Error('Vui lòng chọn dịch vụ');
      if (!formFields.fullName || !formFields.idNumber || !formFields.phone)
        throw new Error('Vui lòng điền Họ tên, CMND/CCCD và Số điện thoại');
      if (!isDraft && fileEntries.length === 0)
        throw new Error('Cần tải lên tài liệu để nộp hồ sơ');
      if (!isDraft && !hasAnalyzed && fileEntries.length > 0)
        throw new Error('Vui lòng nhấn "Phân tích tài liệu" trước khi nộp');

      const appRes = await axiosInstance.post('/applications', {
        serviceId: selectedService,
        formData: {
          ...Object.values(groupFields).reduce((acc, gf) => ({ ...acc, ...gf }), {}),
          ...formFields,
        },
      });
      const appId = appRes.data.data.applicationId;

      for (const entry of fileEntries) {
        const fd = new FormData();
        fd.append('file', entry.file);
        fd.append('docType', entry.docType);
        await axiosInstance.post(`/applications/${appId}/documents`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (!isDraft) {
        const submitRes = await axiosInstance.post(`/applications/${appId}/submit`, {
          copies: copies,
        });
        const submitData = submitRes.data.data;
        toast.success('Nộp hồ sơ thành công!');
        if (submitData.hasPayment) {
          // Hiện modal thanh toán
          setPaymentResult(submitData);
        } else {
          navigate('/profile');
        }
      } else {
        toast.success('Lưu nháp thành công!');
        navigate('/profile');
      }
    } catch (err: any) {
      toast.error('Có lỗi xảy ra: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };


  // ── Computed ──────────────────────────────────────────────────────────
  const service      = services.find(s => s.id === selectedService);
  const requiredDocs = service?.requiredDocs || [];

  // Map requiredDocs strings → docCategory codes cho AI
  const mapDocToCategory = (doc: any): string => {
    const docStr = typeof doc === 'string' ? doc : (doc?.label || doc?.name || doc?.docName || String(doc || ''));
    const l = docStr.toLowerCase();
    if (l.includes('ccđ') || l.includes('căn cước') || l.includes('cmđ') || l.includes('chứng minh')) return 'cccd';
    if (l.includes('hộ khẩu') || l.includes('hộ tịch')) return 'ho_khau';
    if (l.includes('khai sinh')) return 'giay_khai_sinh';
    if (l.includes('kết hôn')) return 'giay_ket_hon';
    if (l.includes('kinh doanh') || l.includes('đăng ký doanh')) return 'giay_phep_kinh_doanh';
    if (l.includes('bằng lái') || l.includes('giấy phép lái')) return 'bang_lai_xe';
    return 'khac';
  };

  // Chỉ block khi có group warningLevel=error (giấy tờ thực sự không hợp lệ)
  // Warning (mờ, thiếu mộc đỏ...) vẫn cho phép nộp, cán bộ sẽ kiểm tra
  const anyHardError = docGroups.some(g => g.warningLevel === 'error');
  const anyWarning   = docGroups.some(g => g.warningLevel === 'warning');
  const canSubmit    = fileEntries.length > 0 && hasAnalyzed && !anyHardError;

  // Form fields definition — không có required
  const FORM_FIELDS = [
    { key: 'fullName', label: 'Họ và tên' },
    { key: 'idNumber', label: 'CMND/CCCD' },
    { key: 'phone',    label: 'Số điện thoại' },
    { key: 'email',    label: 'Email' },
  ];

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link to="/" className="flex items-center gap-2 text-red-700 hover:text-red-800 transition">
              <ArrowLeft size={20} />
              <span className="font-medium">Quay lại trang chủ</span>
            </Link>

            {/* API Key */}
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg border border-gray-200">
              <Key size={16} className="text-gray-500 ml-1" />
              <input
                type="password"
                placeholder="Gemini API Key (để test OCR)"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-48 px-1"
              />
              <Button size="sm" variant="outline" onClick={handleSetApiKey} disabled={isSettingKey} className="h-7 text-xs bg-white">
                {isSettingKey ? 'Lưu...' : 'Lưu Key'}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-700"><Home size={16} /></Link>
            <span>/</span><span>Dịch vụ công</span><span>/</span>
            <span className="text-red-700 font-medium">Nộp hồ sơ trực tuyến</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── 1. Chọn dịch vụ ── */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">Chọn dịch vụ công</h2>
          <div className="flex gap-2 mb-5 border-b border-gray-200 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap -mb-px border-b-2 transition ${
                  activeCategory === cat.value
                    ? 'border-red-700 text-red-700 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.filter(s => s.category === activeCategory).map(sv => (
              <button
                key={sv.id}
                onClick={() => {
                  setSelectedService(sv.id);
                  setFileEntries([]);
                  setDocGroups([]);
                  setHasAnalyzed(false);
                }}
                className={`p-4 rounded-xl border-2 transition text-left ${
                  selectedService === sv.id
                    ? 'border-red-700 bg-red-50 shadow-sm'
                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-gray-900">{sv.name}</div>
                  {selectedService === sv.id && <CheckCircle size={16} className="text-red-700 shrink-0" />}
                </div>
                {sv.processingTime && (
                  <div className="text-xs text-gray-500 mt-2">⏱ {sv.processingTime} &nbsp;·&nbsp; Lệ phí: {sv.fee} đ</div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* ── 2. Tải lên tài liệu ── */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
            <Upload size={20} /> Tải lên tài liệu
          </h2>

          {requiredDocs.length > 0 && (
            <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FileText size={18} /> Yêu cầu giấy tờ:
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 mt-3">
                {requiredDocs.map((doc, i) => {
                  const docStr = typeof doc === 'string' ? doc : String(doc?.label || doc?.name || doc?.docName || '');
                  let docDisplay = docStr || '(Không rõ tên giấy tờ)';
                  const l = String(docStr).toLowerCase();
                  if (l.includes('ccđ') || l.includes('căn cước') || l.includes('cmđ') || l.includes('chứng minh')) {
                    if (!l.includes('2 mặt') && !l.includes('hai mặt')) {
                      docDisplay = `${docStr} (Bắt buộc 2 mặt)`;
                    }
                  }
                  const docObj = typeof doc === 'object' ? doc : null;
                  const templateUrl = docObj?.templateUrl;

                  return (
                    <li key={i} className="flex items-center justify-between gap-4 py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 flex-shrink-0">•</span>
                        <span className="flex-1 font-medium">{docDisplay}</span>
                      </div>
                      {templateUrl && (
                        <a 
                          href={templateUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition whitespace-nowrap"
                        >
                          <FileText size={14} />
                          Tải biểu mẫu
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {service?.procedures && (
            <div className="mb-5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <LayersIcon size={18} /> Trình tự thực hiện:
              </h3>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {service.procedures}
              </div>
            </div>
          )}

          {service?.workflow && (
            <div className="mb-5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <RefreshCw size={18} /> Quy trình xử lý (Nội bộ):
              </h3>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {service.workflow}
              </div>
            </div>
          )}

          {/* Drop zone */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition mb-4">
            <Upload className="mx-auto mb-3 text-gray-400" size={48} />
            <label className="cursor-pointer">
              <span className="text-red-700 font-medium hover:text-red-800">Chọn file tải lên</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">Có thể chọn nhiều file cùng lúc (Ctrl+Click). Hỗ trợ: JPG, PNG, PDF</p>
            <p className="text-xs text-gray-400 mt-1">Ví dụ: chọn cả mặt trước + mặt sau CCCD → AI sẽ tự nhóm lại</p>
          </div>

          {/* Danh sách file đã upload */}
          {fileEntries.length > 0 && (
            <div className="space-y-2 mb-4">
              {fileEntries.map((entry, index) => (
                <div key={index} className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="text-gray-400 shrink-0" size={18} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{entry.file.name}</p>
                      <p className="text-xs text-gray-400">{(entry.file.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-600 p-1">
                    <XCircle size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {fileEntries.length > 0 && (
            <Button
              onClick={handleAnalyzeFiles}
              disabled={isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl shadow-md text-base"
            >
              {isAnalyzing ? (
                <><Loader2 size={20} className="mr-2 animate-spin" /> Đang phân tích và nhóm tài liệu bằng AI...</>
              ) : (
                <><RefreshCw size={20} className="mr-2" /> Phân tích tài liệu & Điền thông tin tự động</>
              )}
            </Button>
          )}
        </Card>

        {/* ── 3. Kết quả nhóm giấy tờ ── */}
        {hasAnalyzed && docGroups.length > 0 && (
          <Card className="p-6 mb-6 border-green-200">
            <h2 className="text-xl font-bold text-green-800 mb-1 flex items-center gap-2">
              <LayersIcon size={20} /> Kết quả phân tích tài liệu
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              AI đã nhận diện được {docGroups.length} nhóm giấy tờ từ {fileEntries.length} file tải lên.
            </p>

            <div className="space-y-4">
              {docGroups.map((group, gi) => {
                const icon = CAT_ICON[group.docCategory] || '📄';
                const isExpanded = expandedGroups[gi] !== false;
                const wl = group.warningLevel || (group.isValid && group.isReadable ? 'ok' : 'error');
                const statusColor =
                  wl === 'error'   ? 'border-red-300 bg-red-50' :
                  wl === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                                     'border-green-300 bg-green-50';

                // Config cho từng loại mã lỗi
                const ERROR_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
                  BLURRY_IMAGE:      { label: 'Ảnh nhòe/mờ',                    icon: '🌫️', color: 'bg-red-100 text-red-800 border-red-200' },
                  MISSING_SEAL:      { label: 'Thiếu mộc đỏ / chữ ký',          icon: '🔏', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  FAKE_DOCUMENT:     { label: 'Nghi ngờ giấy tờ giả',           icon: '⚠️', color: 'bg-red-100 text-red-800 border-red-200' },
                  MISMATCHED_SIDES:  { label: 'Thông tin không khớp',            icon: '🔀', color: 'bg-red-100 text-red-800 border-red-200' },
                  MISSING_FIELDS:    { label: 'Thiếu thông tin bắt buộc',        icon: '📋', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  CROPPED_IMAGE:     { label: 'Ảnh bị cắt xén/thiếu góc',       icon: '✂️', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  DUPLICATE_TYPE:    { label: 'Dư giấy tờ cùng loại',           icon: '📑', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  EXCESS_DOCS:       { label: 'Quá nhiều giấy tờ',              icon: '📚', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  MISSING_TYPE:      { label: 'Thiếu loại giấy tờ yêu cầu',     icon: '📌', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                };

                const validErrors = (group.validationErrors || []).filter(
                  e => Object.keys(ERROR_CONFIG).includes(e)
                );

                return (
                  <div key={gi} className={`rounded-xl border-2 overflow-hidden ${statusColor}`}>
                    {/* Group header */}
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:opacity-80 transition"
                      onClick={() => toggleGroup(gi)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{group.groupLabel}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {group.files.map(f => f.fileName).join(' · ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Status badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                          wl === 'error'   ? 'bg-red-100 text-red-700 border-red-200' :
                          wl === 'warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                             'bg-green-100 text-green-700 border-green-200'
                        }`}>
                          {wl === 'error' ? '❌ Không hợp lệ' : wl === 'warning' ? '⚠️ Cần kiểm tra' : '✅ Hợp lệ'}
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>
                    </button>

                    {/* Group details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-white/60">
                        {/* Message */}
                        {group.message && (
                          <p className={`text-sm mt-3 mb-2 ${
                            wl === 'error' ? 'text-red-700' : wl === 'warning' ? 'text-yellow-700' : 'text-green-700'
                          }`}>
                            {group.message}
                          </p>
                        )}

                        {/* Validation error badges */}
                        {validErrors.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {validErrors.map(code => {
                              const cfg = ERROR_CONFIG[code];
                              return (
                                <span
                                  key={code}
                                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color}`}
                                  title={code}
                                >
                                  <span>{cfg.icon}</span>
                                  {cfg.label}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Issues detail */}
                        {group.issues && group.issues.length > 0 && (
                          <div className="mb-3 p-2 bg-white/70 border border-orange-200 rounded-lg space-y-1">
                            {group.issues.map((issue, ii) => (
                              <p key={ii} className="text-xs text-orange-700">⚠ {issue}</p>
                            ))}
                          </div>
                        )}

                        {/* Extracted fields — badge view */}
                        {Object.entries(group.extractedFields || {})
                          .filter(([k, v]) => v && v !== 'null' && v !== '' && k !== 'thanhVienHo' && typeof v === 'string')
                          .length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {Object.entries(group.extractedFields)
                              .filter(([k, v]) => v && v !== 'null' && v !== '' && k !== 'thanhVienHo' && typeof v === 'string')
                              .map(([k, v]) => (
                                <div key={k} className="bg-white/70 rounded-lg px-3 py-2">
                                  <p className="text-xs text-gray-500 capitalize">{k}</p>
                                  <p className="text-sm font-medium text-gray-800 break-words">{v as string}</p>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* ── 4A. Thông tin liên hệ ── */}
        {(hasAnalyzed || formFields.fullName) && (
          <Card className="p-6 mb-4 border-blue-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-900">Thông tin liên hệ</h2>
              <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full font-medium">
                <CheckCircle size={14} /> Vui lòng kiểm tra và chỉnh sửa nếu cần
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FORM_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {key === 'email' && (
                      <span className="ml-1 text-xs text-gray-400 font-normal">(không bắt buộc)</span>
                    )}
                  </label>
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    value={formFields[key] || ''}
                    onChange={e => handleFieldChange(key, e.target.value)}
                    placeholder={key === 'email' ? 'Nhập email của bạn...' : ''}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── 4B. Thông tin trích xuất theo từng nhóm giấy tờ ── */}
        {hasAnalyzed && docGroups.length > 0 && (
          <div className="space-y-4 mb-6">
            {docGroups.map((group, gi) => {
              const icon       = CAT_ICON[group.docCategory] || '📄';
              const fields     = groupFields[gi] || {};
              const isExpanded = expandedInfoGroups[gi] !== false;
              const hasFields  = Object.keys(fields).length > 0;
              const wl         = group.warningLevel || (group.isValid && group.isReadable ? 'ok' : 'error');

              const ERROR_LABELS: Record<string, string> = {
                BLURRY_IMAGE:     '🌫️ Ảnh nhòe/mờ',
                MISSING_SEAL:     '🔏 Thiếu mộc đỏ/chữ ký',
                FAKE_DOCUMENT:    '⚠️ Nghi giấy tờ giả',
                MISMATCHED_SIDES: '🔀 Thông tin không khớp',
                MISSING_FIELDS:   '📋 Thiếu thông tin bắt buộc',
                CROPPED_IMAGE:    '✂️ Ảnh bị cắt xén',
                DUPLICATE_TYPE:   '📑 Dư giấy tờ cùng loại',
                EXCESS_DOCS:      '📚 Quá nhiều giấy tờ',
                MISSING_TYPE:     '📌 Thiếu loại giấy tờ yêu cầu',
              };

              // Border overrides theo warningLevel
              const borderClass =
                wl === 'error'   ? 'border-red-300' :
                wl === 'warning' ? 'border-yellow-300' :
                group.docCategory === 'cccd' ? 'border-indigo-200' :
                group.docCategory === 'ho_khau' ? 'border-emerald-200' :
                group.docCategory === 'giay_khai_sinh' ? 'border-pink-200' :
                group.docCategory === 'giay_ket_hon' ? 'border-rose-200' :
                group.docCategory === 'giay_phep_kinh_doanh' ? 'border-amber-200' :
                group.docCategory === 'bang_lai_xe' ? 'border-sky-200' : 'border-gray-200';

              const headerClass =
                wl === 'error'   ? 'bg-red-50' :
                wl === 'warning' ? 'bg-yellow-50' :
                group.docCategory === 'cccd' ? 'bg-indigo-50' :
                group.docCategory === 'ho_khau' ? 'bg-emerald-50' :
                group.docCategory === 'giay_khai_sinh' ? 'bg-pink-50' :
                group.docCategory === 'giay_ket_hon' ? 'bg-rose-50' :
                group.docCategory === 'giay_phep_kinh_doanh' ? 'bg-amber-50' :
                group.docCategory === 'bang_lai_xe' ? 'bg-sky-50' : 'bg-gray-50';

              const catBadge =
                group.docCategory === 'cccd' ? 'bg-indigo-100 text-indigo-800' :
                group.docCategory === 'ho_khau' ? 'bg-emerald-100 text-emerald-800' :
                group.docCategory === 'giay_khai_sinh' ? 'bg-pink-100 text-pink-800' :
                group.docCategory === 'giay_ket_hon' ? 'bg-rose-100 text-rose-800' :
                group.docCategory === 'giay_phep_kinh_doanh' ? 'bg-amber-100 text-amber-800' :
                group.docCategory === 'bang_lai_xe' ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-700';

              const catLabel =
                group.docCategory === 'cccd' ? 'CCCD / CMND' :
                group.docCategory === 'ho_khau' ? 'Sổ hộ khẩu' :
                group.docCategory === 'giay_khai_sinh' ? 'Khai sinh' :
                group.docCategory === 'giay_ket_hon' ? 'Đăng ký kết hôn' :
                group.docCategory === 'giay_phep_kinh_doanh' ? 'Kinh doanh' :
                group.docCategory === 'bang_lai_xe' ? 'Bằng lái xe' : 'Khác';

              const FIELD_LABELS: Record<string, string> = {
                cccd: 'Số CCCD/CMND', fullName: 'Họ và tên', dob: 'Ngày sinh', gender: 'Giới tính',
                hometown: 'Quê quán', nationality: 'Quốc tịch', noiDangKyKhaiSinh: 'Nơi đăng ký khai sinh',
                address: 'Nơi thường trú', issueDate: 'Ngày cấp', expiryDate: 'Ngày hết hạn',
                issuePlace: 'Nơi cấp', soHoKhau: 'Số sổ hộ khẩu', chuHo: 'Chủ hộ',
                noiThuongTru: 'Nơi thường trú (hộ khẩu)', cmndChuHo: 'CMND chủ hộ',
                ngayChuyenDen: 'Ngày chuyển đến', noiChuyenDen: 'Nơi chuyển đến',
                soGiayTo: 'Số giấy tờ',
              };

              const validErrors = (group.validationErrors || []).filter(e => ERROR_LABELS[e]);

              return (
                <Card key={gi} className={`overflow-hidden border-2 ${borderClass}`}>
                  {/* Card header */}
                  <button
                    className={`w-full flex items-center justify-between p-4 text-left ${headerClass} hover:opacity-90 transition`}
                    onClick={() => toggleInfoGroup(gi)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{group.groupLabel}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {hasFields ? `${Object.keys(fields).length} trường thông tin` : 'Không có thông tin trích xuất'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* warningLevel badge */}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                        wl === 'error'   ? 'bg-red-100 text-red-700 border-red-200' :
                        wl === 'warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                           'bg-green-100 text-green-700 border-green-200'
                      }`}>
                        {wl === 'error' ? '❌ Lỗi' : wl === 'warning' ? '⚠️ Cảnh báo' : '✅ Hợp lệ'}
                      </span>
                      {/* doc type badge */}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catBadge}`}>
                        {catLabel}
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </button>

                  {/* Card body — editable fields */}
                  {isExpanded && (
                    <div className="p-4 bg-white">

                      {/* Validation errors — compact tags */}
                      {validErrors.length > 0 && (
                        <div className={`mb-3 p-3 rounded-lg border ${
                          wl === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                        }`}>
                          <p className={`text-xs font-semibold mb-2 ${wl === 'error' ? 'text-red-700' : 'text-yellow-700'}`}>
                            {wl === 'error' ? '❌ Phát hiện lỗi cần xử lý:' : '⚠️ Cảnh báo cần kiểm tra:'}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {validErrors.map(code => (
                              <span key={code} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                wl === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {ERROR_LABELS[code]}
                              </span>
                            ))}
                          </div>
                          {group.issues && group.issues.length > 0 && (
                            <div className="mt-2 space-y-0.5">
                              {group.issues.map((issue, ii) => (
                                <p key={ii} className={`text-xs ${wl === 'error' ? 'text-red-600' : 'text-yellow-700'}`}>
                                  • {issue}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {!hasFields ? (
                        <p className="text-sm text-gray-400 italic">AI không trích xuất được thông tin từ tài liệu này.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(fields).map(([k, v]) => {
                            // Bỏ qua thanhVienHo (array) - hiển thị riêng bên dưới
                            if (k === 'thanhVienHo') return null;
                            return (
                              <div key={k}>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  {FIELD_LABELS[k] || k}
                                </label>
                                <input
                                  type="text"
                                  value={v}
                                  onChange={e => handleGroupFieldChange(gi, k, e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 focus:bg-white transition"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Thành viên hộ (nếu có) */}
                      {Array.isArray((group.extractedFields as any)?.thanhVienHo) &&
                       (group.extractedFields as any).thanhVienHo.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Thành viên hộ:</p>
                          <div className="space-y-2">
                            {(group.extractedFields as any).thanhVienHo.map((tv: any, tvi: number) => (
                              <div key={tvi} className="flex gap-2 flex-wrap text-xs bg-emerald-50 rounded-lg p-2">
                                {tv.hoTen && <span><b>Họ tên:</b> {tv.hoTen}</span>}
                                {tv.quanHe && <span>· <b>Quan hệ:</b> {tv.quanHe}</span>}
                                {tv.ngaySinh && <span>· <b>Ngày sinh:</b> {tv.ngaySinh}</span>}
                                {tv.cmnd && <span>· <b>CMND:</b> {tv.cmnd}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ── 5. Chọn số lượng bộ hồ sơ ── */}
        {service && (service.currentFee || 0) > 0 && canSubmit && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              📋 Số lượng bộ hồ sơ muốn nhận
              <span className="text-xs font-normal text-blue-600">(tối đa 5 bộ)</span>
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-blue-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setCopies(c => Math.max(1, c - 1))}
                  className="px-3 py-2 text-blue-700 hover:bg-blue-50 font-bold text-lg transition"
                >−</button>
                <span className="px-4 py-2 font-bold text-blue-900 text-lg min-w-[3rem] text-center">{copies}</span>
                <button
                  onClick={() => setCopies(c => Math.min(5, c + 1))}
                  className="px-3 py-2 text-blue-700 hover:bg-blue-50 font-bold text-lg transition"
                >+</button>
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-gray-500">Lệ phí: </span>
                <span className="font-semibold text-gray-800">
                  {new Intl.NumberFormat('vi-VN').format(service.currentFee || 0)} đ × {copies} bộ
                </span>
                <span className="mx-2 text-gray-400">=</span>
                <span className="font-extrabold text-red-700 text-base">
                  {new Intl.NumberFormat('vi-VN').format((service.currentFee || 0) * copies)} đ
                </span>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">Sau khi nộp, hệ thống sẽ cấp mã thanh toán để bạn đến trang thanh toán trực tuyến.</p>
          </div>
        )}

        {/* ── 6. Submit ── */}

        {/* Advisory banner: warning = AI gợi ý, không block */}
        {hasAnalyzed && anyWarning && !anyHardError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-xl flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-yellow-800">AI phát hiện một số điểm cần kiểm tra</p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Đây chỉ là gợi ý tự động. Bạn vẫn có thể nộp hồ sơ — cán bộ sẽ kiểm tra và quyết định cuối cùng.
              </p>
            </div>
          </div>
        )}

        {/* Hard error banner: cảnh báo nhưng cho phép override */}
        {hasAnalyzed && anyHardError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-xl">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-xl mt-0.5">❌</span>
              <div>
                <p className="text-sm font-semibold text-red-800">AI phát hiện lỗi nghiêm trọng trong tài liệu</p>
                <p className="text-xs text-red-700 mt-1">
                  Tài liệu của bạn có thể bị mờ, ảnh bị cắt, hoặc thông tin không khớp.
                  <strong> Bạn vẫn có thể nộp</strong> — cán bộ sẽ xem xét và phán quyết cuối cùng.
                </p>
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-700">💡 Cách khắc phục:</p>
              <p>• <strong>Xóa file lỗi</strong> ở danh sách tài liệu phía trên và tải lại ảnh chụp rõ hơn</p>
              <p>• Hoặc <strong>nộp hồ sơ dù có cảnh báo</strong> — cán bộ sẽ liên hệ nếu cần bổ sung</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => handleSubmitData(true)} disabled={isSubmitting} className="flex-1 py-6">
            Lưu nháp
          </Button>
          <Button
            disabled={!hasAnalyzed || fileEntries.length === 0 || isSubmitting}
            onClick={() => handleSubmitData(false)}
            className={`flex-[2] py-6 text-lg font-semibold shadow-md ${
              !hasAnalyzed || fileEntries.length === 0 || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : anyHardError
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : anyWarning
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-red-700 hover:bg-red-800 text-white'
            }`}
          >
            {isSubmitting
              ? 'Đang xử lý...'
              : !hasAnalyzed || fileEntries.length === 0
                ? 'Cần phân tích tài liệu trước'
                : anyHardError
                  ? 'Nộp hồ sơ (có cảnh báo AI)'
                  : anyWarning
                    ? 'Xác nhận nộp (AI gợi ý kiểm tra lại)'
                    : 'Xác nhận nộp hồ sơ'}
            {!isSubmitting && hasAnalyzed && fileEntries.length > 0 && <ArrowRight size={20} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>

    {/* ── Payment Result Modal ── */}
    {paymentResult && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={36} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Nộp hồ sơ thành công!</h2>
            <p className="text-sm text-green-100 mt-1">{paymentResult.serviceName}</p>
          </div>

          {/* Payment Info */}
          <div className="p-6">
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-4">
              <p className="text-xs text-orange-600 uppercase font-bold mb-1">Mã thanh toán</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-mono font-extrabold text-orange-700 tracking-wider">{paymentResult.paymentCode}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(paymentResult.paymentCode); }}
                  className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 transition"
                  title="Sao chép mã"
                >
                  Sao chép
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Lệ phí 1 bộ</span>
                <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(paymentResult.unitFee)} đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số lượng bộ</span>
                <span className="font-semibold">{paymentResult.copies} bộ</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-800 font-bold">Tổng lệ phí</span>
                <span className="font-extrabold text-red-700 text-lg">{new Intl.NumberFormat('vi-VN').format(paymentResult.feeTotal)} đ</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 text-xs text-blue-700">
              <p className="font-semibold mb-1">📌 Hướng dẫn thanh toán:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Vào trang <strong>Thanh toán trực tuyến</strong> trên menu</li>
                <li>Nhập <strong>Mã thanh toán</strong> ở trên vào ô tra cứu</li>
                <li>Chọn phương thức và hoàn tất thanh toán</li>
              </ol>
              {paymentResult.paymentDeadline && (
                <div className="mt-3 p-2 bg-red-50 text-red-700 border border-red-200 rounded text-center">
                  <p className="font-bold uppercase">Hạn thanh toán</p>
                  <p className="text-sm">Trước {new Date(paymentResult.paymentDeadline).toLocaleTimeString('vi-VN')} ngày {new Date(paymentResult.paymentDeadline).toLocaleDateString('vi-VN')}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setPaymentResult(null); navigate('/profile'); }}
                className="flex-1 border-gray-300"
              >
                Xem hồ sơ của tôi
              </Button>
              <Button
                onClick={() => { setPaymentResult(null); navigate('/payment'); }}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white"
              >
                Thanh toán ngay →
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
