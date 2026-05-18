import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axiosInstance';

// Quốc huy Việt Nam - SVG inline
const quochuy = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="#DA251D" stroke="#FFC72C" stroke-width="6"/><polygon points="100,30 112,72 156,72 120,96 132,138 100,114 68,138 80,96 44,72 88,72" fill="#FFC72C"/><ellipse cx="100" cy="155" rx="30" ry="18" fill="#FFC72C" opacity="0.3"/><text x="100" y="173" font-size="10" fill="#FFC72C" text-anchor="middle" font-family="serif" opacity="0.7">VIỆT NAM</text></svg>')}`;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (!token) {
      setErrorText('Đường dẫn không hợp lệ hoặc đã hết hạn.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!password || !confirmPassword) {
      setErrorText('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    if (password.length < 6) {
      setErrorText('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorText('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (!token) {
      setErrorText('Token không hợp lệ!');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      toast.success('Đặt lại mật khẩu thành công!');
    } catch (err: any) {
      setErrorText(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-red-700 hover:text-red-800 transition mb-6">
          <ArrowLeft size={20} />
          <span className="font-medium">Quay lại đăng nhập</span>
        </Link>

        <Card className="w-full p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={quochuy} alt="Quốc huy Việt Nam" className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">Đặt lại mật khẩu</h1>
            <p className="text-gray-600 text-sm">Cổng Dịch vụ công cấp Xã/Phường</p>
          </div>

          {success ? (
            /* Trạng thái thành công */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={36} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Cập nhật thành công</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mật khẩu của bạn đã được cập nhật thành công. Vui lòng sử dụng mật khẩu mới để đăng nhập vào hệ thống.
              </p>
              
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-3 mt-4"
              >
                Đăng nhập ngay
              </Button>
            </div>
          ) : (
            /* Form đặt lại mật khẩu */
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
              </p>

              {errorText && (
                <div className="text-red-500 text-sm font-medium text-center bg-red-50 border border-red-200 rounded-lg p-3">
                  {errorText}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    disabled={!token}
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
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    disabled={!token}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-3 mt-6"
              >
                {loading ? 'Đang cập nhật...' : 'Xác nhận đổi mật khẩu'}
              </Button>
            </form>
          )}

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
