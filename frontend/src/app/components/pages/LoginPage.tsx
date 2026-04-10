import { useState } from 'react';
import { LogIn, User, Lock, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
// import quochuy from 'figma:asset/0c39003aa259bb6a3d5c50ee4e5afc4504bb9aa4.png';
const quochuy = ''; // Placeholder for now
import axiosInstance from '../../../utils/axiosInstance';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'account' | 'phone'>('account');
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod !== 'account') {
      alert("Tính năng Đăng nhập OTP đang được phát triển. Vui lòng chuyển sang dùng Tài Khoản và Mật Khẩu để tiếp tục!");
      return;
    }

    setErrorText('');
    setLoading(true);
    try {
      // Backend mapping: we will pass identifier as email and backend will check both email/cccd
      const response = await axiosInstance.post('/auth/login', {
        email: identifier,
        password: password,
      });
      const data = response.data;
      if (data.success && data.data) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('fullName', data.data.fullName || '');
        localStorage.setItem('role', data.data.role || 'citizen');
        
        if (data.data.role === 'officer' || data.data.role === 'admin') {
          navigate('/officer/overview');
        } else {
          navigate('/');
        }
      } else {
        setErrorText(data.message || 'Đăng nhập thất bại.');
      }
    } catch (err: any) {
      setErrorText(err.response?.data?.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          <h1 className="text-2xl font-bold text-red-800 mb-2">Đăng nhập</h1>
          <p className="text-gray-600 text-sm">Cổng Dịch vụ công cấp Xã/Phường</p>
        </div>

        {/* Login Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setLoginMethod('account')}
            className={`flex-1 py-2 rounded-lg transition ${
              loginMethod === 'account'
                ? 'bg-red-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tài khoản
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2 rounded-lg transition ${
              loginMethod === 'phone'
                ? 'bg-red-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Số điện thoại
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorText && <div className="text-red-500 text-sm font-medium text-center">{errorText}</div>}
          {loginMethod === 'account' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CMND/CCCD hoặc Mã định danh
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Nhập CMND/CCCD hoặc email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
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
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã OTP
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã OTP"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Button type="button" onClick={() => alert("Tính năng Đăng nhập OTP đang được phát triển. Vui lòng nhập Tài Khoản và Mật khẩu ở thẻ bên cạnh.")} variant="outline" className="border-red-700 text-red-700 hover:bg-red-50 whitespace-nowrap">
                    Gửi OTP
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-500" />
              <span className="text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-red-700 hover:text-red-800">
              Quên mật khẩu?
            </a>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-red-700 hover:bg-red-800 text-white py-3">
            <LogIn size={20} className="mr-2" />
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-red-700 font-medium hover:text-red-800">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Officer Login */}
        <div className="mt-4 text-center">
          <Link to="/officer/overview" className="text-sm text-gray-600 hover:text-red-700 transition">
            Đăng nhập dành cho cán bộ →
          </Link>
        </div>

        {/* Support */}
        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-700 text-center">
            <strong>Hỗ trợ:</strong> (024) 3825.xxxx | ubnd@xa.gov.vn
          </p>
        </div>
      </Card>
      </div>
    </div>
  );
}
