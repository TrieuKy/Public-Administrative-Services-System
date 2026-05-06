import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, FileSearch } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">
        {/* Animated 404 */}
        <div className="relative mb-8 select-none">
          <div
            className="text-[10rem] font-black leading-none tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, #991b1b 0%, #cc6633 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </div>
          {/* Floating icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-20 h-20 rounded-2xl bg-white shadow-2xl flex items-center justify-center"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <FileSearch size={40} className="text-red-800" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Trang không tồn tại
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          <br />
          Vui lòng kiểm tra lại địa chỉ URL hoặc quay về trang chủ.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-800 text-white rounded-xl font-semibold hover:bg-red-900 transition-all shadow-lg hover:shadow-red-200 hover:-translate-y-0.5"
          >
            <Home size={18} />
            Về Trang Chủ
          </Link>
          <Link
            to="/tracking"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            <Search size={18} />
            Tra cứu hồ sơ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-500 hover:text-gray-700 transition font-medium"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
        </div>

        {/* Decorative dots */}
        <div className="mt-16 flex items-center justify-center gap-2 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-red-800"
              style={{ animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
