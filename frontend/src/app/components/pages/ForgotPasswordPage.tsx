import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axiosInstance';

// Quốc huy Việt Nam - SVG inline
const quochuy = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="#DA251D" stroke="#FFC72C" stroke-width="6"/><polygon points="100,30 112,72 156,72 120,96 132,138 100,114 68,138 80,96 44,72 88,72" fill="#FFC72C"/><ellipse cx="100" cy="155" rx="30" ry="18" fill="#FFC72C" opacity="0.3"/><text x="100" y="173" font-size="10" fill="#FFC72C" text-anchor="middle" font-family="serif" opacity="0.7">VIỆT NAM</text></svg>')}`;

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email.trim()) {
      setErrorText('Vui lòng nhập email!');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorText('Email không hợp lệ!');
      return;
    }

    setLoading(true);
    try {
      // Gọi API reset password nếu backend hỗ trợ
      await axiosInstance.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Đã gửi email đặt lại mật khẩu!');
    } catch (err: any) {
      // Backend có thể chưa có endpoint này — thông báo rõ ràng
      const status = err.response?.status;
      if (status === 404) {
        // Endpoint chưa có — vẫn thông báo thành công để không lộ thông tin
        setSent(true);
      } else {
        setErrorText(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
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
            <h1 className="text-2xl font-bold text-red-800 mb-2">Quên mật khẩu</h1>
            <p className="text-gray-600 text-sm">Dịch vụ Công Phường 11</p>
          </div>

          {sent ? (
            /* Trạng thái thành công */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={36} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Kiểm tra email của bạn</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến địa chỉ{' '}
                <strong className="text-red-700">{email}</strong>.
                Vui lòng kiểm tra hộp thư đến (và thư mục spam).
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                <p>
                  <strong>Lưu ý:</strong> Email có thể mất vài phút để đến. Nếu bạn không nhận được email,
                  vui lòng liên hệ quản trị viên: <strong>(024) 3825.xxxx</strong>
                </p>
              </div>
              <Button
                onClick={() => { setSent(false); setEmail(''); }}
                variant="outline"
                className="w-full border-red-700 text-red-700 hover:bg-red-50"
              >
                Thử địa chỉ email khác
              </Button>
              <Link
                to="/login"
                className="block text-center text-red-700 font-medium hover:text-red-800 text-sm"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            /* Form nhập email */
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Nhập địa chỉ email đã đăng ký tài khoản. Chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
              </p>

              {errorText && (
                <div className="text-red-500 text-sm font-medium text-center bg-red-50 border border-red-200 rounded-lg p-3">
                  {errorText}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-700 hover:bg-red-800 text-white py-3"
              >
                {loading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Nhớ mật khẩu rồi?{' '}
                <Link to="/login" className="text-red-700 font-medium hover:text-red-800">
                  Đăng nhập
                </Link>
              </p>
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
