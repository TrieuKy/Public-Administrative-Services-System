import { useState, useEffect } from 'react';
import { User, FileText, CheckCircle, XCircle, AlertCircle, Clock, ShieldCheck, ChevronRight, UserCircle, Upload, Eye, RefreshCw, Save, Lock, Filter, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('identity');
  const [profile, setProfile] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhoneValue, setEditPhoneValue] = useState('');
  // OCR result preview (before saving)
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [ocrQuality, setOcrQuality] = useState<'ok' | 'warning' | 'error' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Rating states
  const [ratingApp, setRatingApp] = useState<any>(null);
  const [ratingValue, setRatingValue] = useState(5);

  // Handle file selection with preview
  const handleFrontChange = (file: File) => {
    setFrontImage(file);
    setOcrResult(null);
    const url = URL.createObjectURL(file);
    setFrontPreview(url);
  };

  const handleBackChange = (file: File) => {
    setBackImage(file);
    setOcrResult(null);
    const url = URL.createObjectURL(file);
    setBackPreview(url);
  };

  const handleOcrScan = async () => {
    if (!frontImage || !backImage) {
      toast.error('Vui lòng tải lên đầy đủ cả mặt trước và mặt sau CCCD!');
      return;
    }
    if (!frontImage.type.startsWith('image/') || !backImage.type.startsWith('image/')) {
      toast.error('Định dạng file không hợp lệ! Vui lòng chỉ tải lên file hình ảnh (JPG, PNG...).');
      return;
    }

    setIsScanning(true);
    setOcrResult(null);
    try {
      const form = new FormData();
      form.append('front', frontImage);
      form.append('back', backImage);
      const res = await axiosInstance.post('/ai/ocr-cccd-dual', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = res.data.data;
      setOcrResult(data.cccdData);
      setOcrQuality(data.quality);
    } catch (err: any) {
      console.error(err);
      toast.error('Không thể đọc thông tin từ ảnh: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!ocrResult) return;
    setIsSaving(true);
    try {
      const updateRes = await axiosInstance.put('/auth/me', ocrResult);
      setProfile(updateRes.data.data);
      setOcrResult(null);
      setFrontImage(null); setBackImage(null);
      setFrontPreview(null); setBackPreview(null);
      toast.success('Đã cập nhật thông tin định danh thành công!');
    } catch (err: any) {
      toast.error('Lỗi cập nhật: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };
  
  // Tracking vars
  const [searchCode, setSearchCode] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterName, setFilterName] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) { toast.error('Vui lòng điền đầy đủ thông tin'); return; }
    if (pwForm.next.length < 6) { toast.error('Mật khẩu mới phải có ít nhất 6 ký tự'); return; }
    if (pwForm.next !== pwForm.confirm) { toast.error('Mật khẩu xác nhận không khớp'); return; }
    setPwSaving(true);
    try {
      await axiosInstance.put('/auth/me', { password: pwForm.next, currentPassword: pwForm.current });
      toast.success('Đổi mật khẩu thành công!');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi đổi mật khẩu');
    } finally {
      setPwSaving(false);
    }
  };

  const fetchApplications = () => {
    setIsLoadingApps(true);
    axiosInstance.get('/applications?limit=50')
      .then(res => setMyApplications(res.data?.data?.applications || []))
      .catch(console.error)
      .finally(() => setIsLoadingApps(false));
  };

  useEffect(() => {
    // Lấy thông tin cá nhân
    axiosInstance.get('/auth/me')
      .then(res => setProfile(res.data?.data))
      .catch(console.error);
  }, []);

  // Refetch applications khi chuyển sang tab dịch vụ (để luôn có data mới nhất)
  useEffect(() => {
    if (activeTab === 'services') {
      fetchApplications();
    }
  }, [activeTab]);

  // Fetch lần đầu khi mount (nếu đang ở tab services)
  useEffect(() => {
    fetchApplications();
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
         setSearchResult(found);
       }
    } else {
       setSearchResult(null);
    }
    setIsSearching(false);
  };

  // Filtered applications based on group and name
  const SERVICE_GROUPS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'NEED_MORE', label: 'Cần bổ sung' },
    { value: 'REJECTED', label: 'Bị từ chối' },
    { value: 'DRAFT', label: 'Bản nháp' },
  ];

  const filteredApplications = myApplications.filter(app => {
    const matchGroup = filterGroup === 'all' || app.status === filterGroup;
    const matchName = !filterName || (app.service?.name || '').toLowerCase().includes(filterName.toLowerCase());
    return matchGroup && matchName;
  });

  const completedApps = myApplications.filter(a => a.status === 'COMPLETED').length;
  const processingApps = myApplications.filter(a => a.status === 'PROCESSING' || a.status === 'PENDING').length;

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
    return new Date(d).toLocaleDateString('vi-VN');
  };

  const DataRow = ({ label, value, renderExtra }: { label: string, value: string | null, renderExtra?: React.ReactNode | (() => React.ReactNode) }) => (
    <div className="flex border-b py-3 text-sm min-h-12">
      <div className="w-1/3 text-gray-500 self-center">{label}</div>
      <div className="w-2/3 flex items-center justify-between font-medium text-gray-900 group">
        <div className="flex-1 flex items-center gap-2">
          {renderExtra ? (typeof renderExtra === 'function' ? renderExtra() : renderExtra) : (
            value ? <span>{value}</span> : <span className="text-orange-500 italic font-normal">Chưa có dữ liệu</span>
          )}
        </div>
        {!renderExtra && (value ? <CheckCircle size={16} className="text-green-500 shrink-0"/> : <AlertCircle size={16} className="text-orange-500 shrink-0"/>)}
      </div>
    </div>
  );
  
  const handleUpdatePhone = () => {
    if (!editPhoneValue) {
      setIsEditingPhone(false);
      return;
    }
    axiosInstance.put('/auth/me', { phone: editPhoneValue })
      .then(res => {
        setProfile(res.data.data);
        setIsEditingPhone(false);
      })
      .catch(err => {
        toast.error("Lỗi cập nhật số điện thoại.");
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* SIDEBAR */}
        <div className="md:col-span-1 border rounded-lg bg-white overflow-hidden shadow-sm h-fit">
          <div className="p-6 text-center border-b">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-3">
              <UserCircle size={48} />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">{profile?.fullName || 'Đang tải...'}</h2>
            
            <div className="flex justify-between mt-6 px-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{completedApps}</div>
                <div className="text-xs text-gray-500 mt-1">Hồ sơ<br/>đã hoàn thành</div>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{processingApps}</div>
                <div className="text-xs text-gray-500 mt-1">Hồ sơ<br/>đang xử lý</div>
              </div>
            </div>
          </div>

          <div className="py-2">
            <div className="px-4 py-3 font-medium text-red-700 bg-red-50 flex items-center justify-between border-l-4 border-red-700">
              <div className="flex items-center gap-2 text-sm"><User size={16}/> Thông tin tài khoản</div>
            </div>
            <div className="flex flex-col ml-10 border-l border-gray-200 py-1">
              <button onClick={() => setActiveTab('identity')} className={`text-left px-4 py-2 text-sm relative ${activeTab === 'identity' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}>
                {activeTab === 'identity' && <div className="absolute -left-px top-0 bottom-0 w-0.5 bg-blue-600"></div>}
                Thông tin định danh
              </button>
              <button onClick={() => setActiveTab('extended')} className={`text-left px-4 py-2 text-sm relative ${activeTab === 'extended' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}>
                 {activeTab === 'extended' && <div className="absolute -left-px top-0 bottom-0 w-0.5 bg-blue-600"></div>}
                 Thông tin mở rộng
              </button>
            </div>

            <div className={`px-4 py-3 font-medium flex items-center justify-between cursor-pointer border-l-4 ${activeTab === 'services' ? 'text-red-700 bg-red-50 border-red-700' : 'text-gray-700 border-transparent hover:bg-gray-50'}`} onClick={() => setActiveTab('services')}>
              <div className="flex items-center gap-2 text-sm"><FileText size={16}/> Quản lý dịch vụ công</div>
              <ChevronRight size={16} />
            </div>
            {activeTab === 'services' && (
              <div className="flex flex-col ml-10 border-l border-gray-200 py-1">
                <button className="text-left px-4 py-2 text-sm relative text-blue-600 font-medium">
                  <div className="absolute -left-px top-0 bottom-0 w-0.5 bg-blue-600"></div>
                  Dịch vụ công của tôi
                </button>
              </div>
            )}

            <div
              className={`px-4 py-3 font-medium flex items-center justify-between border-l-4 cursor-pointer ${ activeTab === 'password' ? 'text-red-700 bg-red-50 border-red-700' : 'text-gray-700 border-transparent hover:bg-gray-50' }`}
              onClick={() => setActiveTab('password')}
            >
              <div className="flex items-center gap-2 text-sm"><Lock size={16}/> Đổi mật khẩu</div>
            </div>

          </div>
        </div>

        {/* CONTENT */}
        <div className="md:col-span-3">
          
          {/* TAB 1: Thông tin định danh */}
          {activeTab === 'identity' && (
            <Card className="p-0 overflow-hidden shadow-sm">
              <div className="bg-[#cc6633] text-white p-4 font-medium flex justify-between items-center">
                <h3>Thông tin định danh</h3>
                <button className="text-sm bg-white text-[#cc6633] px-3 py-1 rounded hover:bg-orange-50 font-medium">Sửa</button>
              </div>
              <div className="p-6">
                {/* Khu vực OCR Scanner */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 border-b pb-2 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-blue-600" /> Định danh trực tuyến bằng CCCD
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 mt-2">Tải lên ảnh chụp <strong>mặt trước</strong> và <strong>mặt sau</strong> CCCD. AI sẽ tự động đọc và điền thông tin — bạn xem lại trước khi lưu.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Mặt trước */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Mặt trước CCCD</p>
                      <label className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition min-h-[140px] overflow-hidden ${
                        frontImage ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:border-blue-400'
                      }`}>
                        <input type="file" accept="image/*" onChange={e => { if(e.target.files?.[0]) handleFrontChange(e.target.files[0]); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        {frontPreview ? (
                          <>
                            <img src={frontPreview} alt="Mặt trước CCCD" className="w-full h-36 object-cover rounded" />
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle size={12}/> Đã chọn
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center py-6 text-gray-400">
                            <Upload size={32} className="mb-2" />
                            <span className="text-sm font-medium text-gray-600">Tải lên mặt trước</span>
                            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</span>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Mặt sau */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Mặt sau CCCD</p>
                      <label className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition min-h-[140px] overflow-hidden ${
                        backImage ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:border-blue-400'
                      }`}>
                        <input type="file" accept="image/*" onChange={e => { if(e.target.files?.[0]) handleBackChange(e.target.files[0]); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        {backPreview ? (
                          <>
                            <img src={backPreview} alt="Mặt sau CCCD" className="w-full h-36 object-cover rounded" />
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle size={12}/> Đã chọn
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center py-6 text-gray-400">
                            <Upload size={32} className="mb-2" />
                            <span className="text-sm font-medium text-gray-600">Tải lên mặt sau</span>
                            <span className="text-xs text-gray-400 mt-1">Chứa QR code, vân tay</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="text-center mt-3">
                    <Button
                      onClick={handleOcrScan}
                      disabled={isScanning || !frontImage || !backImage}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 disabled:opacity-50"
                    >
                      {isScanning ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                          Đang phân tích AI...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2"><Eye size={16}/> Quét OCR & Xem trước kết quả</span>
                      )}
                    </Button>
                  </div>

                  {/* OCR Result Preview */}
                  {ocrResult && (
                    <div className="mt-5 border rounded-lg overflow-hidden">
                      <div className={`px-4 py-3 flex items-center justify-between font-semibold text-sm ${
                        ocrQuality === 'ok' ? 'bg-green-50 text-green-800 border-b border-green-200' :
                        ocrQuality === 'warning' ? 'bg-yellow-50 text-yellow-800 border-b border-yellow-200' :
                        'bg-red-50 text-red-800 border-b border-red-200'
                      }`}>
                        <span className="flex items-center gap-2">
                          {ocrQuality === 'ok' ? <CheckCircle size={16}/> : ocrQuality === 'warning' ? <AlertCircle size={16}/> : <XCircle size={16}/>}
                          Kết quả trích xuất từ AI — Kiểm tra trước khi lưu
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          ocrQuality === 'ok' ? 'bg-green-200 text-green-800' :
                          ocrQuality === 'warning' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {ocrQuality === 'ok' ? 'Chất lượng tốt' : ocrQuality === 'warning' ? 'Cần xem lại' : 'Ảnh có vấn đề'}
                        </span>
                      </div>
                      <div className="bg-white p-4 grid grid-cols-2 gap-3 text-sm">
                        {[
                          { label: 'Số CCCD', key: 'cccd' },
                          { label: 'Họ và tên', key: 'fullName' },
                          { label: 'Ngày sinh', key: 'dob' },
                          { label: 'Giới tính', key: 'gender' },
                          { label: 'Quốc tịch', key: 'nationality' },
                          { label: 'Nơi khai sinh', key: 'pob' },
                          { label: 'Nơi thường trú', key: 'address' },
                          { label: 'Ngày cấp', key: 'issueDate' },
                          { label: 'Ngày hết hạn', key: 'expiryDate' },
                          { label: 'Nơi cấp', key: 'issuePlace' },
                        ].map(({ label, key }) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase font-medium">{label}</span>
                            <span className={`font-semibold mt-0.5 ${(ocrResult as any)[key] ? 'text-gray-900' : 'text-orange-400 italic'}`}>
                              {(ocrResult as any)[key] || 'Không đọc được'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 px-4 py-3 flex gap-3 justify-end border-t">
                        <Button variant="outline" onClick={() => { setOcrResult(null); setFrontImage(null); setBackImage(null); setFrontPreview(null); setBackPreview(null); }} className="border-gray-300 text-gray-600">
                          <RefreshCw size={14} className="mr-1"/> Chụp lại
                        </Button>
                        <Button onClick={handleConfirmSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white">
                          {isSaving ? 'Đang lưu...' : <><Save size={14} className="mr-1"/> Xác nhận & Lưu thông tin</>}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 text-red-600 text-sm p-4 rounded mb-6 border border-yellow-200">
                  <AlertCircle size={16} className="inline mr-2 -mt-0.5" />
                  Trường hợp thông tin định danh bị sai, công dân vui lòng cập nhật lại thông tin để tránh sai sót khi làm dịch vụ công.
                </div>
                <div>
                  <DataRow label="Số định danh cá nhân (CCCD)" value={profile?.cccd} />
                  <DataRow label="Họ và tên" value={profile?.fullName} />
                  <DataRow label="Ngày sinh" value={profile?.dob ? formatDate(profile.dob) : null} />
                  <DataRow label="Giới tính" value={profile?.gender} />
                  <DataRow label="Quốc tịch" value={profile?.nationality} />
                  <DataRow label="Nơi cư trú" value={profile?.address} />
                  <DataRow label="Nơi ĐK khai sinh" value={profile?.pob} />
                  <DataRow label="Ngày cấp" value={profile?.issueDate ? formatDate(profile.issueDate) : null} />
                  <DataRow label="Ngày hết hạn" value={profile?.expiryDate ? formatDate(profile.expiryDate) : null} />
                  <DataRow label="Nơi cấp" value={profile?.issuePlace} />
                  <DataRow label="Số điện thoại" value={profile?.phone} renderExtra={() => (
                     <div className="flex flex-col gap-2 w-full">
                       {/* Always render input, toggle visibility to avoid losing focus on re-mount */}
                       <div className={`flex gap-2 w-full ${isEditingPhone ? '' : 'hidden'}`}>
                         <input
                           type="tel"
                           value={editPhoneValue}
                           onChange={e => setEditPhoneValue(e.target.value)}
                           onKeyDown={e => { if (e.key === 'Enter') handleUpdatePhone(); if (e.key === 'Escape') setIsEditingPhone(false); }}
                           placeholder="Nhập số điện thoại..."
                           maxLength={11}
                           className="flex-1 border px-3 py-1.5 text-sm rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                           autoFocus={isEditingPhone}
                         />
                         <button onClick={handleUpdatePhone} className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 font-medium">Lưu</button>
                         <button onClick={() => setIsEditingPhone(false)} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-300">Hủy</button>
                       </div>
                       {!isEditingPhone && (
                         <div className="flex items-center justify-between w-full">
                           {profile?.phone ? <span>{profile.phone}</span> : <span className="text-orange-500 italic font-normal">Chưa có dữ liệu (Nhập thủ công)</span>}
                           <div className="flex items-center gap-3">
                             <button onClick={() => { setIsEditingPhone(true); setEditPhoneValue(profile?.phone || ''); }} className="text-blue-600 hover:underline text-xs bg-blue-50 px-2 py-1 rounded">Cập nhật SĐT</button>
                             {profile?.phone ? <CheckCircle size={16} className="text-green-500"/> : <AlertCircle size={16} className="text-orange-500"/>}
                           </div>
                         </div>
                       )}
                     </div>
                  )} />
                  <DataRow label="Email (Tùy chọn)" value={profile?.email} />
                </div>
                <div className="mt-6 text-xs text-gray-500 space-y-1 bg-gray-50 p-4 rounded">
                  <p className="font-medium mb-2 text-gray-700 border-b pb-2">Ghi chú về các biểu tượng dữ liệu:</p>
                  <p className="flex items-center gap-1 text-green-600"><CheckCircle size={14}/> Biểu tượng Xanh là thông tin đã được xác minh</p>
                  <p className="flex items-center gap-1 text-orange-500"><AlertCircle size={14}/> Biểu tượng Cam là thông tin trường trống</p>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 2: Thông tin mở rộng */}
          {activeTab === 'extended' && (
             <Card className="p-0 overflow-hidden shadow-sm">
              <div className="bg-[#cc6633] text-white p-4 font-medium flex justify-between items-center">
                <h3>Thông tin mở rộng</h3>
                <button className="text-sm bg-white text-[#cc6633] px-3 py-1 rounded hover:bg-orange-50 font-medium">Sửa</button>
              </div>
              <div className="p-6">
                <DataRow label="Mã số thuế" value={profile?.taxCode || null} />
                <DataRow label="Mã bảo hiểm xã hội" value={profile?.insuranceCode || null} />
                <DataRow label="Số hộ chiếu" value={profile?.passport || null} />
                <DataRow label="Số giấy phép lái xe" value={profile?.driverLicense || null} />
              </div>
             </Card>
          )}

          {/* TAB 3: Dịch vụ công của tôi (Tracking) */}
          {activeTab === 'services' && (
            <div>
              <Card className="p-6 mb-6 shadow-sm border-t-8 border-t-[#cc6633]">
                <h2 className="text-xl font-bold flex items-center gap-3 mb-4 border-b pb-4 text-[#cc6633]">
                  <FileText /> Dịch vụ công của tôi
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={15} className="text-gray-400" />
                  <span className="text-sm text-gray-500 font-medium">Lọc theo nhóm dịch vụ</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {SERVICE_GROUPS.map(g => (
                    <button
                      key={g.value}
                      onClick={() => setFilterGroup(g.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        filterGroup === g.value
                          ? 'bg-[#cc6633] text-white border-[#cc6633]'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-[#cc6633] hover:text-[#cc6633]'
                      }`}
                    >
                      {g.label}
                      {g.value !== 'all' && (
                        <span className="ml-1 opacity-70">
                          ({myApplications.filter(a => a.status === g.value).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="🔍  Tìm theo tên dịch vụ..."
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#cc6633]"
                  />
                </div>
              </Card>

              {/* Ket qua tim kiem */}
              {searchResult || (searchCode && !isSearching) ? (
                 searchResult ? (
                   <Card className="p-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{searchResult.service?.name}</h3>
                    <div className="text-sm font-medium text-green-600 mb-4">{getStatusText(searchResult.status)}</div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6 pb-6 border-b">
                      <div>
                        <div className="text-gray-500 mb-1">Mã HS</div>
                        <div className="font-medium">{searchResult.applicationCode}</div>
                      </div>
                      <div>
                         <div className="text-gray-500 mb-1">Thời gian nộp</div>
                         <div className="font-medium">{formatDate(searchResult.submittedAt || searchResult.createdAt)}</div>
                      </div>
                      <div>
                         <div className="text-gray-500 mb-1">Trạng thái hiện tại</div>
                         <div className="font-medium">{getStatusText(searchResult.status)}</div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => setShowDetailModal(true)} className="w-full text-[#cc6633] border-[#cc6633]">Xem chi tiết</Button>
                      </div>
                    </div>
                  </Card>
                 ) : (
                    <Card className="p-8 text-center bg-white shadow-sm mb-6 text-gray-500">
                      Không tìm thấy hồ sơ nào khớp với Mã Hồ Sơ trên.
                    </Card>
                 )
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  {myApplications.length === 0 ? (
                     <div className="text-center py-8 text-gray-500">Bạn chưa có hồ sơ dịch vụ công nào.</div>
                  ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Filter size={36} className="mx-auto mb-3 opacity-40" />
                      <p>Không có hồ sơ nào phù hợp với bộ lọc.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredApplications.map((app) => (
                        <div key={app.id} className="border-b last:border-0 pb-4 last:pb-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-gray-800 text-sm md:text-base">{app.service?.name}</h3>
                            {/* Payment status badge */}
                            {app.paymentStatus === 'UNPAID' && (
                              <span className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-semibold animate-pulse">
                                <CreditCard size={11} /> Chưa đóng phí
                              </span>
                            )}
                            {app.paymentStatus === 'PAID' && (
                              <span className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                                <CheckCircle size={11} /> Đã đóng phí
                              </span>
                            )}
                          </div>
                          <div className={`text-xs font-medium mb-3 ${getStatusColor(app.status).split(' ')[0]}`}>{getStatusText(app.status)}</div>
                          {app.paymentStatus === 'UNPAID' && (
                            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                              <div className="flex items-center gap-2 mb-1">
                                <CreditCard size={12} />
                                <span>Hồ sơ này chưa được đóng lệ phí. Vui lòng{' '}
                                <a href="/payment" className="font-bold underline">thanh toán trực tuyến</a>
                                {app.paymentCode && <span className="ml-1">— Mã: <span className="font-mono font-bold text-orange-700">{app.paymentCode}</span></span>}
                                </span>
                              </div>
                              {app.paymentDeadline && (
                                <div className="ml-5 font-semibold text-red-800">
                                  Hạn thanh toán: Trước {new Date(app.paymentDeadline).toLocaleTimeString('vi-VN')} ngày {new Date(app.paymentDeadline).toLocaleDateString('vi-VN')}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Yêu cầu bổ sung hoặc Bị từ chối */}
                          {app.status === 'NEED_MORE' && (
                            <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                              <div className="flex gap-2 font-bold mb-1"><AlertCircle size={16} /> Cán bộ yêu cầu bổ sung hồ sơ</div>
                              <p className="mb-3 text-xs italic">Chi tiết: {app.histories?.[0]?.note || 'Vui lòng bổ sung thêm giấy tờ.'}</p>
                              <a href={`/dich-vu/${app.serviceId}`} className="inline-block px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded hover:bg-orange-700 transition">
                                Nộp lại hồ sơ mới
                              </a>
                            </div>
                          )}
                          {app.status === 'REJECTED' && (
                            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                              <div className="flex gap-2 font-bold mb-1"><XCircle size={16} /> Hồ sơ bị từ chối</div>
                              <p className="mb-3 text-xs italic">Lý do: {app.rejectReason || app.histories?.[0]?.note || 'Hồ sơ không hợp lệ.'}</p>
                              <a href={`/dich-vu/${app.serviceId}`} className="inline-block px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition">
                                Nộp lại hồ sơ mới
                              </a>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div>
                              <div className="text-gray-400 text-xs mb-0.5">Mã HS</div>
                              <div className="font-medium text-gray-800 break-all">{app.applicationCode}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-xs mb-0.5">Ngày tiếp nhận</div>
                              <div className="font-medium text-gray-800">{formatDate(app.submittedAt || app.createdAt)}</div>
                            </div>
                            <div>
                               <div className="text-gray-400 text-xs mb-0.5">Thao tác</div>
                               <div className="flex items-center gap-3">
                                 <button 
                                   onClick={() => { setSearchCode(app.applicationCode); handleSearch(app.applicationCode); }}
                                   className="text-[#cc6633] hover:underline font-medium text-xs whitespace-nowrap"
                                 >
                                   Chi tiết
                                 </button>
                                 {app.status === 'COMPLETED' && (
                                   <button onClick={() => setRatingApp(app)} className="text-amber-600 hover:text-amber-700 hover:underline font-medium text-xs whitespace-nowrap flex items-center gap-1">
                                     Đánh giá ⭑
                                   </button>
                                 )}
                               </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: Đổi mật khẩu */}
          {activeTab === 'password' && (
            <Card className="p-0 overflow-hidden shadow-sm">
              <div className="bg-[#cc6633] text-white p-4 font-medium flex items-center gap-3">
                <Lock size={18} />
                <h3>Đổi mật khẩu</h3>
              </div>
              <div className="p-6 max-w-md">
                <p className="text-sm text-gray-500 mb-6">Mật khẩu mới phải có ít nhất 6 ký tự. Sau khi đổi, bạn cần đăng nhập lại.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      value={pwForm.current}
                      onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                      placeholder="Nhập mật khẩu hiện tại..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#cc6633] focus:border-[#cc6633]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={pwForm.next}
                      onChange={e => setPwForm({ ...pwForm, next: e.target.value })}
                      placeholder="Nhập mật khẩu mới..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#cc6633] focus:border-[#cc6633]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                      placeholder="Nhập lại mật khẩu mới..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#cc6633] focus:border-[#cc6633]"
                    />
                    {pwForm.confirm && pwForm.next !== pwForm.confirm && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> Mật khẩu không khớp</p>
                    )}
                    {pwForm.confirm && pwForm.next === pwForm.confirm && pwForm.next.length >= 6 && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={12} /> Mật khẩu khớp</p>
                    )}
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={pwSaving}
                    className="w-full bg-[#cc6633] hover:bg-[#b3592d] text-white mt-2"
                  >
                    {pwSaving ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang lưu...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Save size={16} /> Đổi mật khẩu</span>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )}



        </div>
      </div>

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

       {/* Rating Modal */}
       {ratingApp && (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <Card className="max-w-md w-full bg-white rounded-2xl overflow-hidden p-6 shadow-2xl animate-in zoom-in-95">
             <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Đánh giá chất lượng phục vụ</h3>
             <p className="text-sm text-gray-500 text-center mb-6">Hồ sơ: <span className="font-bold text-gray-800">{ratingApp.applicationCode}</span></p>
             
             <div className="flex justify-center gap-2 mb-6 cursor-pointer">
               {[1, 2, 3, 4, 5].map((star) => (
                 <span 
                   key={star} 
                   onClick={() => setRatingValue(star)}
                   className={`text-4xl transition-colors ${star <= ratingValue ? 'text-amber-400' : 'text-gray-200'}`}
                 >
                   ★
                 </span>
               ))}
             </div>
             <p className="text-center font-medium text-amber-600 mb-6">
               {ratingValue === 5 ? 'Rất hài lòng' : ratingValue === 4 ? 'Hài lòng' : ratingValue === 3 ? 'Bình thường' : ratingValue === 2 ? 'Không hài lòng' : 'Rất tệ'}
             </p>
             
             <textarea 
               rows={3} 
               placeholder="Bạn có góp ý gì thêm cho cán bộ xử lý không?" 
               className="w-full border rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:border-amber-500"
             ></textarea>
             
             <div className="flex gap-3">
               <Button onClick={() => setRatingApp(null)} variant="outline" className="flex-1 border-gray-300">Đóng</Button>
               <Button 
                 onClick={async () => {
                   try {
                     await axiosInstance.post(`/applications/${ratingApp.id}/rate`, { rating: ratingValue });
                     toast.success("Cảm ơn bạn đã gửi đánh giá! Khảo sát của bạn giúp hệ thống Dịch Vụ Công phục vụ tốt hơn.");
                     // Cập nhật local state
                     setMyApplications(prev => prev.map(a => a.id === ratingApp.id ? { ...a, rating: ratingValue } : a));
                     setRatingApp(null);
                   } catch (err: any) {
                     toast.error('Không thể gửi đánh giá: ' + (err.response?.data?.message || err.message));
                   }
                 }} 
                 className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
               >
                 Gửi đánh giá
               </Button>
             </div>
           </Card>
         </div>
       )}
    </div>
  );
}
