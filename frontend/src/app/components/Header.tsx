import { Home, User as UserIcon, Search, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
// import quochuy from 'figma:asset/0c39003aa259bb6a3d5c50ee4e5afc4504bb9aa4.png';
const quochuy = '';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setFullName(localStorage.getItem('fullName') || '');
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 border-b border-gray-200">
          {/* Logo with Quốc huy */}
          <Link to="/" className="flex items-center gap-4">
            <img src={quochuy} alt="Quốc huy Việt Nam" className="w-14 h-14 object-contain" />
            <div>
              <div className="text-red-700 text-xl tracking-tight" style={{ fontFamily: 'serif' }}>
                CỔNG DỊCH VỤ CÔNG CẤP XÃ/PHƯỜNG
              </div>
              <div className="text-sm text-gray-600 mt-0.5">
                Kết nối thông tin và dịch vụ hành chính tại cơ sở
              </div>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <UserIcon size={16} />
                  </div>
                  <span className="text-gray-700 font-medium text-sm hidden md:block">
                    {fullName || 'Người dùng'}
                  </span>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <Settings size={16} />
                      Thông tin cá nhân
                    </Link>
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
        <nav className="flex items-center h-14 overflow-x-auto">
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition whitespace-nowrap"
            >
              <Home size={18} />
              <span className="text-sm">Thông tin và dịch vụ</span>
            </Link>
            <Link
              to="/payment"
              className="px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded transition font-medium text-sm whitespace-nowrap border border-transparent hover:border-orange-200"
            >
              Thanh toán trực tuyến
            </Link>
            <Link
              to="/service-form"
              className="bg-[#cc6633] text-white px-4 py-2 rounded font-medium hover:bg-[#b55a2d] transition text-sm whitespace-nowrap hidden md:block"
            >
              Nộp hồ sơ trực tuyến
            </Link>
            <Link
              to="/feedback"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition text-sm whitespace-nowrap hidden lg:block"
            >
              Phản ánh kiến nghị
            </Link>
            <a
              href="#"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition text-sm whitespace-nowrap hidden lg:block"
            >
              Đánh giá chất lượng phục vụ
            </a>
            <a
              href="#"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition text-sm whitespace-nowrap hidden lg:block"
            >
              Hỗ trợ
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}