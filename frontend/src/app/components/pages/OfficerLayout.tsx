import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Calendar, Settings, Home, LogOut, Shield } from 'lucide-react';
import { User } from 'lucide-react';

export function OfficerLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: '/officer/overview', name: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { path: '/officer/applications', name: 'Quản lý hồ sơ', icon: <FileText size={20} /> },
    { path: '/officer/reports', name: 'Báo cáo & Thống kê', icon: <BarChart3 size={20} /> },
    { path: '/officer/schedules', name: 'Lịch công tác', icon: <Calendar size={20} /> },
    { path: '/officer/settings', name: 'Cài đặt', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-[#a10e13] text-white"> {/* using a flat deep red, or gradient from-red-900 to-red-800 */}
        
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
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
            {localStorage.getItem('fullName')?.charAt(0) || <User size={20}/>}
          </div>
          <div>
            <p className="font-semibold text-sm">{localStorage.getItem('fullName') || 'Cán bộ'} <span className="inline-block w-2 h-2 rounded-full bg-green-400 ml-1"></span></p>
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
                  className={`flex items-center gap-3 px-6 py-3 transition mx-2 rounded-lg
                    ${isActive 
                      ? 'bg-yellow-500 text-red-900 font-semibold shadow-md' 
                      : 'text-red-100 hover:bg-red-800 hover:text-white'}`}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                  {isActive && item.name === 'Quản lý hồ sơ' && (
                     <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 text-xs font-semibold text-red-300 mt-8 mb-2 uppercase tracking-wider">Liên kết</div>
          <nav>
            <Link
              to="/"
              className="flex items-center gap-3 px-6 py-3 text-red-100 hover:bg-red-800 mx-2 rounded-lg transition"
            >
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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 shadow-sm">
           <div className="flex items-center gap-2 text-sm text-gray-500">
             <span className="text-red-700 font-medium">Admin</span>
             <span>›</span>
             <span className="text-gray-900 font-medium">
               {menuItems.find(i => currentPath.startsWith(i.path))?.name || 'Dashboard'}
             </span>
           </div>
           <select className="bg-gray-100 border-none text-sm rounded-md py-1 px-3 outline-none text-gray-600 hidden md:block">
              <option>Dịch vụ công trực tuyến Website</option>
           </select>
           <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-gray-600 relative">
                <Shield size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 cursor-pointer border-l pl-4">
                 <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                   {localStorage.getItem('fullName')?.charAt(0) || 'U'}
                 </div>
                 <div className="hidden md:block">
                   <p className="text-sm font-semibold text-gray-700 leading-tight">{localStorage.getItem('fullName') || 'Cán bộ Nguyễn'}</p>
                   <p className="text-xs text-gray-500">Cán bộ</p>
                 </div>
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
