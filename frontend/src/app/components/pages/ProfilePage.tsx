import { useState, useEffect } from 'react';
import { User, FileText, CheckCircle, XCircle, AlertCircle, Search, Clock, ShieldCheck, CreditCard, ChevronRight, UserCircle, Settings, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import axiosInstance from '../../../utils/axiosInstance';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('identity');
  const [profile, setProfile] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhoneValue, setEditPhoneValue] = useState('');
  
  // Rating states
  const [ratingApp, setRatingApp] = useState<any>(null);
  const [ratingValue, setRatingValue] = useState(5);
  
  const handleMockOcrScan = () => {
    if (!frontImage || !backImage) {
      alert("Lỗi: Yêu cầu tải lên đầy đủ hai mặt (Trước & Sau) của thẻ Căn cước công dân!");
      return;
    }
    if (!frontImage.type.startsWith('image/') || !backImage.type.startsWith('image/')) {
      alert("Lỗi: Định dạng file không hợp lệ! Vui lòng chỉ tải lên tài liệu hình ảnh (JPG, PNG...).");
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      const fakeData = {
        fullName: profile?.fullName || "Nguyễn Văn A",
        dob: "2000-01-01",
        gender: "Nam",
        pob: "Hà Nội",
        hometown: "Hà Nội",
        address: "Số 1 Cầu Giấy, Hà Nội",
        nationality: "Việt Nam",
        issueDate: "2021-05-15",
        expiryDate: "2035-01-01",
        issuePlace: "Cục CS QLHC về TTXH"
      };
      
      axiosInstance.put('/auth/me', fakeData)
        .then(res => {
          setProfile(res.data.data);
          setIsScanning(false);
        })
        .catch(err => {
          console.error(err);
          setIsScanning(false);
          alert("Có lỗi khi lưu dữ liệu OCR.");
        });
    }, 2500);
  };
  
  // Tracking vars
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Lấy thông tin cá nhân
    axiosInstance.get('/auth/me')
      .then(res => setProfile(res.data?.data))
      .catch(console.error);

    // Lấy hồ sơ (Tracking)
    axiosInstance.get('/applications')
      .then(res => setMyApplications(res.data?.data?.applications || []))
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
         setSearchResult(found);
       }
    } else {
       setSearchResult(null);
    }
    setIsSearching(false);
  };

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
    <div className="flex border-b py-3 text-sm min-h-[48px]">
      <div className="w-1/3 text-gray-500 self-center">{label}</div>
      <div className="w-2/3 flex items-center justify-between font-medium text-gray-900 group">
        <div className="flex-1 flex items-center gap-2">
          {renderExtra ? (typeof renderExtra === 'function' ? renderExtra() : renderExtra) : (
            value ? <span>{value}</span> : <span className="text-orange-500 italic font-normal">Chưa có dữ liệu</span>
          )}
        </div>
        {!renderExtra && (value ? <CheckCircle size={16} className="text-green-500 flex-shrink-0"/> : <AlertCircle size={16} className="text-orange-500 flex-shrink-0"/>)}
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
        alert("Lỗi cập nhật số điện thoại.");
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
                {activeTab === 'identity' && <div className="absolute left-[-1px] top-0 bottom-0 w-0.5 bg-blue-600"></div>}
                Thông tin định danh
              </button>
              <button onClick={() => setActiveTab('extended')} className={`text-left px-4 py-2 text-sm relative ${activeTab === 'extended' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}>
                 {activeTab === 'extended' && <div className="absolute left-[-1px] top-0 bottom-0 w-0.5 bg-blue-600"></div>}
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
                  <div className="absolute left-[-1px] top-0 bottom-0 w-0.5 bg-blue-600"></div>
                  Dịch vụ công của tôi
                </button>
              </div>
            )}

            <div className="px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between border-l-4 border-transparent cursor-pointer">
              <div className="flex items-center gap-2 text-sm"><ShieldCheck size={16}/> Tài liệu điện tử</div>
            </div>
            <div className="px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between border-l-4 border-transparent cursor-pointer">
              <div className="flex items-center gap-2 text-sm"><Settings size={16}/> Tiện ích</div>
            </div>
            <div className="px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between border-l-4 border-transparent cursor-pointer">
              <div className="flex items-center gap-2 text-sm"><CreditCard size={16}/> Lịch sử thanh toán</div>
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
                <div className="bg-gray-50 border border-gray-200 rounded p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2">Yêu cầu định danh trực tuyến</h3>
                  <p className="text-sm text-gray-600 mb-4">Vui lòng tải lên ảnh mặt trước và mặt sau CCCD để hệ thống tự động quét bóc tách và điền thông tin.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label className="border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-blue-500 transition cursor-pointer bg-white relative">
                      <input type="file" accept="image/*" onChange={e => { if(e.target.files) setFrontImage(e.target.files[0]) } } className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      {frontImage ? (
                        <div className="text-green-600 font-medium text-sm flex flex-col items-center">
                          <CheckCircle className="mb-2" size={32} />
                          Đã tải ảnh: {frontImage.name}
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                          <div className="font-medium text-sm text-gray-700">Tải lên Mặt trước CCCD</div>
                        </>
                      )}
                    </label>
                    <label className="border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-blue-500 transition cursor-pointer bg-white relative">
                      <input type="file" accept="image/*" onChange={e => { if(e.target.files) setBackImage(e.target.files[0]) } } className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      {backImage ? (
                        <div className="text-green-600 font-medium text-sm flex flex-col items-center">
                          <CheckCircle className="mb-2" size={32} />
                          Đã tải ảnh: {backImage.name}
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                          <div className="font-medium text-sm text-gray-700">Tải lên Mặt sau CCCD</div>
                        </>
                      )}
                    </label>
                  </div>
                  
                  <div className="text-center mt-2">
                    <Button 
                      onClick={handleMockOcrScan} 
                      disabled={isScanning}
                      className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                    >
                      {isScanning ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang phân tích OCR...
                        </div>
                      ) : (
                        "Quét OCR & Chẩn hóa dữ liệu"
                      )}
                    </Button>
                  </div>
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
                     isEditingPhone ? (
                       <div className="flex gap-2 w-full">
                         <input type="text" value={editPhoneValue} onChange={e => setEditPhoneValue(e.target.value)} placeholder="Nhập SĐT..." className="flex-1 border px-2 py-1 text-sm rounded outline-none focus:border-blue-500" />
                         <button onClick={handleUpdatePhone} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Lưu</button>
                         <button onClick={() => setIsEditingPhone(false)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300">Hủy</button>
                       </div>
                     ) : (
                       <div className="flex items-center justify-between w-full">
                         {profile?.phone ? <span>{profile.phone}</span> : <span className="text-orange-500 italic font-normal">Chưa có dữ liệu (Nhập thủ công)</span>}
                         <div className="flex items-center gap-3">
                           <button onClick={() => { setIsEditingPhone(true); setEditPhoneValue(profile?.phone || ''); }} className="text-blue-600 hover:underline text-xs bg-blue-50 px-2 py-1 rounded">Cập nhật SĐT</button>
                           {profile?.phone ? <CheckCircle size={16} className="text-green-500"/> : <AlertCircle size={16} className="text-orange-500"/>}
                         </div>
                       </div>
                     )
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
                <h2 className="text-xl font-bold flex items-center gap-3 mb-6 border-b pb-4 text-[#cc6633]">
                  <FileText /> Dịch vụ công của tôi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Tên dịch vụ công</label>
                    <input type="text" placeholder="Nhập tên dịch vụ công" className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:border-[#cc6633]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mã hồ sơ</label>
                    <input type="text" placeholder="Nhập mã hồ sơ" value={searchCode} onChange={e => setSearchCode(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:border-[#cc6633]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Trạng thái hồ sơ</label>
                    <select className="w-full px-4 py-2 border rounded text-sm bg-white focus:outline-none focus:border-[#cc6633]">
                      <option>-- Chọn trạng thái hồ sơ --</option>
                    </select>
                  </div>
                </div>
                <div className="text-center">
                  <Button onClick={() => handleSearch()} className="bg-[#cc6633] hover:bg-[#b3592d] text-white px-8">Tìm kiếm</Button>
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
                  ) : (
                    <div className="space-y-4">
                      {myApplications.map((app) => (
                        <div key={app.id} className="border-b last:border-0 pb-4 last:pb-0">
                          <h3 className="font-bold text-gray-800 mb-1 text-sm md:text-base">{app.service?.name}</h3>
                          <div className={`text-xs font-medium mb-3 ${getStatusColor(app.status).split(' ')[0]}`}>{getStatusText(app.status)}</div>
                          
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
                 onClick={() => { 
                   alert("Cảm ơn bạn đã gửi đánh giá! Khảo sát của bạn giúp hệ thống Dịch Vụ Công phục vụ tốt hơn."); 
                   setRatingApp(null); 
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
