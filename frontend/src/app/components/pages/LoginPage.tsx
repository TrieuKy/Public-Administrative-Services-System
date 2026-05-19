import { useState } from 'react';
import { LogIn, User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
// Quốc huy Việt Nam - SVG inline
const quochuy = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="#DA251D" stroke="#FFC72C" stroke-width="6"/><polygon points="100,30 112,72 156,72 120,96 132,138 100,114 68,138 80,96 44,72 88,72" fill="#FFC72C"/><ellipse cx="100" cy="155" rx="30" ry="18" fill="#FFC72C" opacity="0.3"/><text x="100" y="173" font-size="10" fill="#FFC72C" text-anchor="middle" font-family="serif" opacity="0.7">VIỆT NAM</text></svg>')}`;
import axiosInstance from '../../../utils/axiosInstance';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('rememberMe') === 'true');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        // Xử lý ghi nhớ đăng nhập
        localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
        if (rememberMe) {
          localStorage.setItem('savedIdentifier', identifier);
        } else {
          localStorage.removeItem('savedIdentifier');
        }

        login(data.data.accessToken, {
          fullName: data.data.fullName || '',
          role: data.data.role || 'citizen',
          id: data.data.id || ''
        }, data.data.refreshToken);
        
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
          <p className="text-gray-600 text-sm">Dịch vụ Công Phường 11</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorText && <div className="text-red-500 text-sm font-medium text-center">{errorText}</div>}
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
              />
              <span className="text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/forgot-password" className="text-red-700 hover:text-red-800">
              Quên mật khẩu?
            </Link>
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

        {/* Officer Login removed for security - direct link bypasses authentication */}

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
