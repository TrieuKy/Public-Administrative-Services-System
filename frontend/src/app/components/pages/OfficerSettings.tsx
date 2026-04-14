import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { User, Shield, Bell, HardDrive, Camera, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

export function OfficerSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: '', officerCode: '', position: '', department: '', workPhone: '', email: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailOnNew: true, emailOnStatus: true, emailOnUrgent: true,
    browserNotify: false, dailySummary: true, weeklySummary: false,
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/officer/dashboard/profile');
      if (res.data.success && res.data.data) {
        setProfileData({
          fullName: res.data.data.fullName || '', officerCode: res.data.data.officerCode || '',
          position: res.data.data.position || '', department: res.data.data.department || '',
          workPhone: res.data.data.workPhone || '', email: res.data.data.email || '',
          address: res.data.data.address || ''
        });
      }
    } catch (e) { console.error(e); }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.put('/officer/dashboard/profile', profileData);
      if (res.data.success) {
        toast.success('Lưu thông tin thành công!');
        localStorage.setItem('fullName', profileData.fullName);
      }
    } catch (e) { toast.error('Có lỗi xảy ra khi lưu!'); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (!pwData.currentPassword || !pwData.newPassword) return toast.error('Vui lòng điền đầy đủ!');
    if (pwData.newPassword.length < 6) return toast.error('Mật khẩu mới phải ít nhất 6 ký tự!');
    if (pwData.newPassword !== pwData.confirmPassword) return toast.error('Mật khẩu xác nhận không khớp!');
    setPwLoading(true);
    try {
      await axiosInstance.put('/auth/me', { password: pwData.newPassword, currentPassword: pwData.currentPassword });
      toast.success('Đổi mật khẩu thành công!');
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e: any) { toast.error(e.response?.data?.message || 'Có lỗi xảy ra!'); }
    finally { setPwLoading(false); }
  };

  const ToggleSwitch = ({ value, onChange, label, desc }: { value: boolean; onChange: () => void; label: string; desc?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-red-600' : 'bg-gray-200'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  const pwFields: { label: string; field: keyof typeof pwData; showKey: keyof typeof showPw }[] = [
    { label: 'Mật khẩu hiện tại *', field: 'currentPassword', showKey: 'current' },
    { label: 'Mật khẩu mới *', field: 'newPassword', showKey: 'new' },
    { label: 'Xác nhận mật khẩu mới *', field: 'confirmPassword', showKey: 'confirm' },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Cài đặt</h2>
        <p className="text-sm text-gray-500 mb-6">Quản lý tài khoản và tùy chỉnh hệ thống</p>
        <nav className="space-y-1">
          {[
            { key: 'profile',       icon: <User size={18}/>,      label: 'Hồ sơ cá nhân' },
            { key: 'security',      icon: <Shield size={18}/>,    label: 'Bảo mật' },
            { key: 'notifications', icon: <Bell size={18}/>,      label: 'Thông báo' },
            { key: 'system',        icon: <HardDrive size={18}/>, label: 'Hệ thống' },
          ].map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${
                activeTab === item.key ? 'bg-red-50 text-red-700 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">

        {/* Profile */}
        {activeTab === 'profile' && (
          <Card className="p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Hồ sơ cá nhân</h3>
            <p className="text-sm text-gray-500 mb-8 border-b pb-6">Cập nhật thông tin hồ sơ cán bộ</p>
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
                <p className="text-sm text-gray-500">{profileData.position || 'Cán bộ'} — {profileData.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
              {[
                { label: 'Họ và tên', field: 'fullName', disabled: false },
                { label: 'Mã cán bộ', field: 'officerCode', disabled: true },
                { label: 'Chức vụ', field: 'position', disabled: false },
                { label: 'Đơn vị', field: 'department', disabled: false },
                { label: 'SĐT công vụ', field: 'workPhone', disabled: false },
                { label: 'Email công vụ', field: 'email', disabled: true },
              ].map(({ label, field, disabled }) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{label}</label>
                  <input type="text" disabled={disabled} value={(profileData as any)[field]}
                    onChange={e => setProfileData({ ...profileData, [field]: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${disabled ? 'bg-gray-50 text-gray-400 border-gray-200' : 'border-gray-300'}`}
                  />
                </div>
              ))}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Địa chỉ nơi làm việc</label>
                <textarea rows={2} value={profileData.address}
                  onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t flex justify-start">
              <Button onClick={handleSaveProfile} disabled={loading} className="bg-[#b3141b] hover:bg-[#8f1016] text-white px-8">
                <Save size={16} className="mr-2" /> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </Card>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <Card className="p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Bảo mật tài khoản</h3>
            <p className="text-sm text-gray-500 mb-8 border-b pb-6">Thay đổi mật khẩu và cài đặt bảo mật</p>
            <div className="max-w-md space-y-5">
              {pwFields.map(({ label, field, showKey }) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{label}</label>
                  <div className="relative">
                    <input type={showPw[showKey] ? 'text' : 'password'} value={pwData[field]}
                      onChange={e => setPwData({ ...pwData, [field]: e.target.value })} placeholder="••••••••"
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    />
                    <button onClick={() => setShowPw({ ...showPw, [showKey]: !showPw[showKey] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPw[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
              {pwData.newPassword && (
                <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1.5">
                  <p className="font-medium text-gray-600">Yêu cầu mật khẩu:</p>
                  {[
                    { ok: pwData.newPassword.length >= 6, text: 'Ít nhất 6 ký tự' },
                    { ok: /[A-Z]/.test(pwData.newPassword), text: 'Có chữ hoa' },
                    { ok: /[0-9]/.test(pwData.newPassword), text: 'Có chữ số' },
                  ].map((r, i) => (
                    <div key={i} className={`flex items-center gap-2 ${r.ok ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle size={12} /> {r.text}
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={handleChangePassword} disabled={pwLoading} className="w-full bg-[#b3141b] hover:bg-[#8f1016] text-white">
                <Shield size={16} className="mr-2" /> {pwLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </Button>
            </div>
            <div className="mt-8 pt-6 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Phiên đăng nhập</h4>
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-800">Phiên hiện tại</p>
                  <p className="text-xs text-gray-500">Trình duyệt này • {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Đang hoạt động</span>
              </div>
            </div>
          </Card>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <Card className="p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Cài đặt thông báo</h3>
            <p className="text-sm text-gray-500 mb-8 border-b pb-6">Tùy chỉnh cách nhận thông báo từ hệ thống</p>
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">✉️ Thông báo qua Email</h4>
                <div className="bg-gray-50 rounded-xl px-4 divide-y divide-gray-100">
                  <ToggleSwitch value={notifications.emailOnNew} onChange={() => setNotifications(n => ({ ...n, emailOnNew: !n.emailOnNew }))} label="Hồ sơ mới" desc="Nhận email khi có hồ sơ mới được phân công" />
                  <ToggleSwitch value={notifications.emailOnStatus} onChange={() => setNotifications(n => ({ ...n, emailOnStatus: !n.emailOnStatus }))} label="Cập nhật trạng thái" desc="Khi hồ sơ được duyệt hoặc từ chối" />
                  <ToggleSwitch value={notifications.emailOnUrgent} onChange={() => setNotifications(n => ({ ...n, emailOnUrgent: !n.emailOnUrgent }))} label="Hồ sơ khẩn cấp" desc="Ưu tiên cao — khuyến nghị bật" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">🔔 Thông báo trình duyệt</h4>
                <div className="bg-gray-50 rounded-xl px-4">
                  <ToggleSwitch value={notifications.browserNotify} onChange={() => setNotifications(n => ({ ...n, browserNotify: !n.browserNotify }))} label="Thông báo desktop" desc="Hiển thị thông báo ngay trên màn hình" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">📊 Báo cáo định kỳ</h4>
                <div className="bg-gray-50 rounded-xl px-4 divide-y divide-gray-100">
                  <ToggleSwitch value={notifications.dailySummary} onChange={() => setNotifications(n => ({ ...n, dailySummary: !n.dailySummary }))} label="Tổng kết hàng ngày" desc="Email tổng hợp vào 18h00 mỗi ngày làm việc" />
                  <ToggleSwitch value={notifications.weeklySummary} onChange={() => setNotifications(n => ({ ...n, weeklySummary: !n.weeklySummary }))} label="Tổng kết hàng tuần" desc="Email tóm tắt tuần vào sáng thứ Hai" />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button onClick={() => toast.success('Đã lưu cài đặt thông báo!')} className="bg-[#b3141b] hover:bg-[#8f1016] text-white px-8">
                <Save size={16} className="mr-2" /> Lưu cài đặt
              </Button>
            </div>
          </Card>
        )}

        {/* System */}
        {activeTab === 'system' && (
          <Card className="p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Thông tin hệ thống</h3>
            <p className="text-sm text-gray-500 mb-8 border-b pb-6">Thông tin về ứng dụng và cơ sở hạ tầng</p>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Tên hệ thống', value: 'Cổng Dịch vụ công UBND Xã/Phường' },
                  { label: 'Phiên bản', value: 'v1.0.0 — Tháng 4/2026' },
                  { label: 'Đơn vị triển khai', value: 'UBND Phường Bến Nghé, Quận 1, TP.HCM' },
                  { label: 'Hỗ trợ kỹ thuật', value: 'Phòng Nội vụ — ext: 108' },
                  { label: 'Backend', value: 'Node.js + Express + Sequelize ORM' },
                  { label: 'Cơ sở dữ liệu', value: 'PostgreSQL 15' },
                  { label: 'Frontend', value: 'React 18 + Vite + Tailwind CSS' },
                  { label: 'Môi trường', value: 'Development (localhost)' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-amber-800 mb-3">⚠️ Lưu ý vận hành</h4>
                <ul className="text-xs text-amber-700 space-y-1.5 list-disc ml-4">
                  <li>Sao lưu cơ sở dữ liệu thực hiện tự động vào 02h00 mỗi ngày.</li>
                  <li>Bảo trì hệ thống định kỳ vào thứ Bảy tuần đầu mỗi tháng.</li>
                  <li>Liên hệ Phòng CNTT khi gặp sự cố nghiêm trọng.</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
