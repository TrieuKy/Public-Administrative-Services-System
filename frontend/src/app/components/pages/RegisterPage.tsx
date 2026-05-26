import { useState } from 'react';
import { UserPlus, User, Phone, Mail, Lock, Eye, EyeOff, MapPin, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
// Quốc huy Việt Nam - SVG inline
const quochuy = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="#DA251D" stroke="#FFC72C" stroke-width="6"/><polygon points="100,30 112,72 156,72 120,96 132,138 100,114 68,138 80,96 44,72 88,72" fill="#FFC72C"/><ellipse cx="100" cy="155" rx="30" ry="18" fill="#FFC72C" opacity="0.3"/><text x="100" y="173" font-size="10" fill="#FFC72C" text-anchor="middle" font-family="serif" opacity="0.7">VIỆT NAM</text></svg>')}`;
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    cccd: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setErrorText('Mật khẩu không khớp!');
      return;
    }
    const cccdClean = formData.cccd.replace(/\s/g, '');
    if (!/^\d{12}$/.test(cccdClean)) {
      setErrorText('CCCD phải gồm đúng 12 chữ số!');
      return;
    }
    if (!/^(0[3-9]\d{8}|0[1-2]\d{8})$/.test(formData.phone.replace(/\s/g, ''))) {
      setErrorText('Số điện thoại không hợp lệ! Phải là 10 số, bắt đầu bằng 0.');
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorText('Email không hợp lệ!');
      return;
    }
    if (formData.password.length < 8) {
      setErrorText('Mật khẩu phải có ít nhất 8 ký tự!');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', {
        ...formData,
        cccd: cccdClean,   // gửi đã trim space
      });
      const data = response.data;
      if (data.success) {
        toast.success('Đăng ký thành công, vui lòng kiểm tra email để xác nhận');
        navigate('/login');
      } else {
        setErrorText(data.message || 'Đăng ký thất bại.');
      }
    } catch (err: any) {
      setErrorText(err.response?.data?.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-red-700 hover:text-red-800 transition mb-6">
          <ArrowLeft size={20} />
          <span className="font-medium">Quay lại trang chủ</span>
        </Link>

        <Card className="w-full p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={quochuy} alt="Quốc huy Việt Nam" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Đăng ký tài khoản</h1>
          <p className="text-gray-600 text-sm">Tạo tài khoản để sử dụng dịch vụ công trực tuyến</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorText && <div className="text-red-500 text-sm font-medium text-center">{errorText}</div>}
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CMND/CCCD <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cccd"
                value={formData.cccd}
                onChange={handleChange}
                placeholder="001234567890"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912345678"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ thường trú <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, xã/phường, huyện/quận, tỉnh/thành phố"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={2}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 mt-1 text-red-700 border-gray-300 rounded focus:ring-red-500"
              required
            />
            <label className="text-sm text-gray-600">
              Tôi đồng ý với{' '}
              <a href="#" className="text-red-700 hover:text-red-800">
                Điều khoản sử dụng
              </a>{' '}
              và{' '}
              <a href="#" className="text-red-700 hover:text-red-800">
                Chính sách bảo mật
              </a>{' '}
              của Cổng dịch vụ công
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-red-700 hover:bg-red-800 text-white py-3">
            <UserPlus size={20} className="mr-2" />
            {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-red-700 font-medium hover:text-red-800">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </Card>
      </div>
    </div>
  );
}
