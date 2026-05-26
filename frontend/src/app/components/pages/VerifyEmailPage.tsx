import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, LogIn } from 'lucide-react';
import axios from 'axios';   // dùng axios thuần — không qua interceptor

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Liên kết xác thực không hợp lệ hoặc bị thiếu token.');
      return;
    }

    // Gọi trực tiếp bằng axios thuần (không qua axiosInstance để tránh interceptor redirect)
    axios.get(`${API_BASE}/auth/verify-email`, { params: { token } })
      .then((res) => {
        setStatus('success');
        setMessage(res.data?.message || 'Email của bạn đã được xác thực thành công!');
      })
      .catch(err => {
        const serverMsg: string = err.response?.data?.message || '';
        // Nếu tài khoản đã xác thực rồi → coi như success
        if (serverMsg.includes('đã được xác thực')) {
          setStatus('success');
          setMessage('Tài khoản đã được xác thực. Bạn có thể đăng nhập ngay!');
        } else {
          setStatus('error');
          setMessage(serverMsg || 'Liên kết không hợp lệ hoặc đã hết hạn.');
        }
      });
  }, [token]);


  // Auto redirect sau khi success
  useEffect(() => {
    if (status !== 'success') return;
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          navigate('/login');
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Top accent */}
          <div className={`h-2 w-full ${status === 'success' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : status === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-red-700 to-orange-500'}`} />

          <div className="p-8 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="Logo" className="h-14 w-auto" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>

            {/* Status Icon */}
            <div className="flex justify-center mb-5">
              {status === 'loading' && (
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                  <Loader2 size={40} className="text-blue-600 animate-spin" />
                </div>
              )}
              {status === 'success' && (
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle size={44} className="text-green-500" />
                </div>
              )}
              {status === 'error' && (
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                  <XCircle size={44} className="text-red-500" />
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'loading' && 'Đang xác thực...'}
              {status === 'success' && 'Xác thực thành công!'}
              {status === 'error' && 'Xác thực thất bại'}
            </h1>

            {/* Message */}
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {status === 'loading' && 'Vui lòng chờ trong giây lát, hệ thống đang xác thực tài khoản của bạn.'}
              {status === 'success' && message}
              {status === 'error' && message}
            </p>

            {/* Countdown + Auto redirect (success) */}
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-green-700">
                  Chuyển đến trang đăng nhập sau <span className="font-bold text-green-800">{countdown}</span> giây...
                </p>
                <div className="mt-2 h-1.5 bg-green-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(countdown / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error info */}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-red-700 leading-relaxed">
                  Nguyên nhân có thể:<br />
                  • Liên kết đã được dùng trước đó<br />
                  • Liên kết đã hết hạn (sau 24h)<br />
                  • Tài khoản đã được xác thực rồi
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl font-semibold hover:from-red-800 hover:to-red-900 transition shadow-sm flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Đăng nhập ngay
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                Về trang chủ
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t px-8 py-4 text-center">
            <p className="text-xs text-gray-400">
              Dịch vụ Công Phường 11 — UBND Phường 11, Quận 3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
