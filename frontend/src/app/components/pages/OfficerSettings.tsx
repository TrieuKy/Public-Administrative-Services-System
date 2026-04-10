import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { User, Shield, Bell, HardDrive, Camera, Save } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';

export function OfficerSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: '',
    officerCode: '',
    position: '',
    department: '',
    workPhone: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/officer/dashboard/profile');
      if (res.data.success && res.data.data) {
        setProfileData({
          fullName: res.data.data.fullName || '',
          officerCode: res.data.data.officerCode || '',
          position: res.data.data.position || '',
          department: res.data.data.department || '',
          workPhone: res.data.data.workPhone || '',
          email: res.data.data.email || '',
          address: res.data.data.address || ''
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.put('/officer/dashboard/profile', profileData);
      if (res.data.success) {
        alert('Lưu thay đổi thành công!');
        localStorage.setItem('fullName', profileData.fullName);
        window.dispatchEvent(new Event('storage')); // trigger update if any elsewhere
      }
    } catch (e) {
      alert('Có lỗi xảy ra khi lưu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col md:flex-row gap-8">
      
      {/* Settings Navigation Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Cài đặt</h2>
        <p className="text-sm text-gray-500 mb-6">Quản lý thông tin tài khoản và tùy chỉnh hệ thống</p>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'profile' ? 'bg-red-50 text-red-700 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <User size={18} />
            Hồ sơ cá nhân
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'security' ? 'bg-red-50 text-red-700 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Shield size={18} />
            Bảo mật
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'notifications' ? 'bg-red-50 text-red-700 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Bell size={18} />
            Thông báo
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'system' ? 'bg-red-50 text-red-700 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <HardDrive size={18} />
            Hệ thống
          </button>
        </nav>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1">
        {activeTab === 'profile' && (
          <Card className="p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Thông tin cá nhân</h3>
            <p className="text-sm text-gray-500 mb-8 border-b pb-6">Cập nhật thông tin hồ sơ cán bộ</p>

            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-yellow-500 flex items-center justify-center text-4xl text-white font-bold shadow-lg ring-4 ring-white">
                  {profileData.fullName.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-red-700 text-white rounded-full hover:bg-red-800 shadow-md">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">{profileData.fullName || 'Người dùng'}</h4>
                <p className="text-sm text-gray-500 mb-2">{profileData.position || 'Cán bộ'} bộ phận một cửa</p>
                <button className="text-sm text-red-600 font-medium hover:underline">Đổi ảnh đại diện</button>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mã cán bộ</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    disabled
                    value={profileData.officerCode}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Chức vụ</label>
                <div className="relative">
                  <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={profileData.position}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Đơn vị</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> {/* Using User icon for unit as placeholder */}
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Số điện thoại cấu vụ</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📞</span>
                  <input
                    type="text"
                    value={profileData.workPhone}
                    onChange={(e) => setProfileData({...profileData, workPhone: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email công vụ</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
                  <input
                    type="email"
                    disabled
                    value={profileData.email}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Địa chỉ nơi làm việc</label>
                <textarea
                  rows={2}
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                ></textarea>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-start">
               <Button onClick={handleSave} disabled={loading} className="bg-[#b3141b] hover:bg-[#8f1016] text-white px-8">
                 <Save size={18} className="mr-2" />
                 {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
               </Button>
            </div>
          </Card>
        )}

        {activeTab !== 'profile' && (
          <Card className="p-8 shadow-sm flex items-center justify-center min-h-[400px]">
             <div className="text-center text-gray-400 space-y-4">
                <Shield size={48} className="mx-auto" />
                <p>Nội dung thẻ đang được phát triển.</p>
             </div>
          </Card>
        )}
      </div>
    </div>
  );
}
