import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Calendar, Settings, Home, LogOut, Shield, Newspaper, LayoutList, Bell, ChevronDown, User, KeyRound, X, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function OfficerLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menuItems = [
    { path: '/officer/overview',      name: 'Tổng quan',           icon: <LayoutDashboard size={20} /> },
    { path: '/officer/applications',  name: 'Quản lý hồ sơ',       icon: <FileText size={20} /> },
    { path: '/officer/posts',         name: 'Quản lý bài đăng',    icon: <Newspaper size={20} /> },
    { path: '/officer/services',      name: 'Quản lý dịch vụ',     icon: <LayoutList size={20} /> },
    { path: '/officer/reviews',       name: 'Đánh giá hài lòng',   icon: <Star size={20} /> },
    { path: '/officer/reports',       name: 'Báo cáo & Thống kê',  icon: <BarChart3 size={20} /> },
    { path: '/officer/schedules',     name: 'Lịch công tác',       icon: <Calendar size={20} /> },
    { path: '/officer/settings',      name: 'Cài đặt',             icon: <Settings size={20} /> },
  ];

  // Thông báo mẫu (sẽ thay bằng API thật sau)
  const notifications = [
    { id: 1, title: 'Hệ thống đã sẵn sàng',  desc: 'Cổng dịch vụ công đã khởi động thành công.', time: 'Vừa xong',   read: false },
    { id: 2, title: 'Chào mừng cán bộ!',      desc: 'Chào mừng bạn đến với cổng quản lý nội bộ.', time: '5 phút trước', read: true },
  ];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  const fullName = localStorage.getItem('fullName') || 'Cán bộ';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-[#a10e13] text-white">
        
        {/* Logo Area */}
        <div className="p-4 border-b border-red-800 flex items-center gap-3">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white uppercase tracking-wide">Cổng Dịch vụ công</h1>
            <p className="text-xs text-yellow-500">Cán bộ UBND Xã/Phường</p>
          </div>
        </div>

        {/* Profile Area */}
        <div className="p-4 flex items-center gap-3 border-b border-red-800">
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-lg">
            {fullName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm">{fullName} <span className="inline-block w-2 h-2 rounded-full bg-green-400 ml-1"></span></p>
            <p className="text-xs text-red-200">Bộ phận một cửa</p>
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 text-xs font-semibold text-red-300 mb-2 mt-2 uppercase tracking-wider">Menu chính</div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-3 transition mx-2 rounded-lg ${
                    isActive
                      ? 'bg-yellow-500 text-red-900 font-semibold shadow-md'
                      : 'text-red-100 hover:bg-red-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 text-xs font-semibold text-red-300 mt-8 mb-2 uppercase tracking-wider">Liên kết</div>
          <nav>
            <Link to="/" className="flex items-center gap-3 px-6 py-3 text-red-100 hover:bg-red-800 mx-2 rounded-lg transition">
              <Home size={20} />
              <span className="text-sm">Trang chủ công dân</span>
            </Link>
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-4 bg-red-900 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-100 hover:text-white transition w-full">
            <LogOut size={20} />
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0 shadow-sm">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-red-700 font-medium">Admin</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">
              {menuItems.find(i => currentPath.startsWith(i.path))?.name || 'Dashboard'}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Combobox điều hướng */}
            <select
              className="bg-gray-100 border-none text-sm rounded-md py-1.5 px-3 outline-none text-gray-600 hidden md:block cursor-pointer hover:bg-gray-200 transition"
              onChange={e => { if (e.target.value) navigate(e.target.value); }}
              value=""
            >
              <option value="" disabled>Dịch vụ công Website</option>
              <option value="/officer/posts">📰 Quản lý bài đăng</option>
              <option value="/officer/services">📋 Quản lý danh mục dịch vụ</option>
            </select>

            {/* Nút thông báo */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 hover:text-gray-700"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotif && (
                <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                    <span className="font-semibold text-sm text-gray-800">Thông báo</span>
                    <button onClick={() => setShowNotif(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-400">Không có thông báo nào</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/60' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-red-500' : 'bg-gray-300'}`} />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 border-t text-center">
                    <button className="text-xs text-red-600 hover:underline font-medium">Xem tất cả thông báo</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Menu */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
                className="flex items-center gap-2 pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition"
              >
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                  {fullName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-700 leading-tight">{fullName}</p>
                  <p className="text-xs text-gray-400">Cán bộ</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                    <p className="text-xs text-gray-500">Cán bộ bộ phận một cửa</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate('/officer/settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User size={16} className="text-gray-400" /> Hồ sơ cá nhân
                    </button>
                    <button
                      onClick={() => { navigate('/officer/settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <KeyRound size={16} className="text-gray-400" /> Đổi mật khẩu
                    </button>
                    <button
                      onClick={() => { navigate('/officer/settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Settings size={16} className="text-gray-400" /> Cài đặt
                    </button>
                    <div className="border-t my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
