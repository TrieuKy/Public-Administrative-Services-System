import { Home, User as UserIcon, Settings, LogOut, ChevronDown, Phone, Mail, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsSupportOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  // Helper: check if a nav link is currently active
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Nav link base classes
  const navBase = 'px-4 py-2 rounded transition text-sm font-medium whitespace-nowrap';
  const navActive = 'bg-orange-500 text-white';
  const navInactive = 'text-gray-700 hover:bg-orange-50 hover:text-orange-700 border border-transparent hover:border-orange-200';

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 border-b border-gray-200">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Logo Cổng Dịch vụ công"
                className="w-14 h-14 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              /* Fallback logo khi không có file */
              <div className="w-14 h-14 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-xl select-none">
                DVC
              </div>
            )}
            <div>
              <div className="text-red-700 text-xl tracking-tight font-bold" style={{ fontFamily: 'serif' }}>
                CỔNG DỊCH VỤ CÔNG CẤP XÃ/PHƯỜNG
              </div>
              <div className="text-sm text-gray-600 mt-0.5">
                Kết nối thông tin và dịch vụ hành chính tại cơ sở
              </div>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                    {user.fullName?.charAt(0) || <UserIcon size={16} />}
                  </div>
                  <span className="text-gray-700 font-medium text-sm hidden md:block">
                    {user.fullName || 'Người dùng'}
                  </span>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg py-1 z-50">
                    {user.role !== 'officer' && (
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Settings size={16} />
                        Thông tin cá nhân
                      </Link>
                    )}
                    {(user.role === 'admin' || user.role === 'officer') && (
                      <Link
                        to="/officer/overview"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        <UserIcon size={16} />
                        Dashboard Cán bộ
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="outline" className="border-red-700 text-red-700 hover:bg-red-50">
                    Đăng ký
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-red-700 hover:bg-red-800 text-white">
                    Đăng nhập
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center h-14 overflow-visible">
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`${navBase} flex items-center gap-2 ${isActive('/') ? navActive : navInactive}`}
            >
              <Home size={18} />
              <span>Thông tin và dịch vụ</span>
            </Link>

            <Link
              to="/payment"
              className={`${navBase} ${isActive('/payment') ? navActive : navInactive}`}
            >
              Thanh toán trực tuyến
            </Link>

            <Link
              to="/service-form"
              className={`${navBase} ${isActive('/service-form') ? navActive : navInactive}`}
            >
              Nộp hồ sơ trực tuyến
            </Link>

            <Link
              to="/feedback"
              className={`${navBase} ${isActive('/feedback') ? navActive : navInactive}`}
            >
              Phản ánh &amp; Kiến nghị
            </Link>

            <Link
              to="/tracking"
              className={`${navBase} ${isActive('/tracking') ? navActive : navInactive}`}
            >
              Tra cứu hồ sơ
            </Link>

            {/* Nút Hỗ trợ có popup */}
            <div className="relative">
              <button
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                className={`${navBase} ${isSupportOpen ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Hỗ trợ
              </button>
              {isSupportOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Thông tin hỗ trợ</h3>
                    <button onClick={() => setIsSupportOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                      <Phone size={18} className="text-red-600 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">Đường dây nóng</p>
                        <a href="tel:02438250000" className="text-red-700 font-bold">(024) 3825.0000</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                      <Mail size={18} className="text-orange-600 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">Email hỗ trợ</p>
                        <a href="mailto:ubnd@xa.gov.vn" className="text-orange-700">ubnd@xa.gov.vn</a>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs text-center">Thứ 2 – Thứ 6 | 7:30 – 17:00</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}