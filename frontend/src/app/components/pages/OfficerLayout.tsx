import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Calendar, Settings, Home, LogOut, Shield, Newspaper, LayoutList, Bell, ChevronDown, User, KeyRound, X, Star, MessageSquare, CreditCard, Clock, AlertCircle, FileSearch } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

export function OfficerLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Officer notifications from API
  const [notifications, setNotifications] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('officer_notif_read') || '[]')); }
    catch { return new Set(); }
  });
  const [notifLoading, setNotifLoading] = useState(false);

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const res = await axiosInstance.get('/payments/officer/notifications');
      if (res.data.success) setNotifications(res.data.data.notifications || []);
    } catch { /* ignore */ }
    finally { setNotifLoading(false); }
  };

  // Fetch once on mount + every 2 minutes
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const markRead = (id: string) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('officer_notif_read', JSON.stringify([...next]));
      return next;
    });
  };

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(prev => {
      const next = new Set(prev);
      allIds.forEach(id => next.add(id));
      localStorage.setItem('officer_notif_read', JSON.stringify([...next]));
      return next;
    });
  };

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

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
    { path: '/officer/overview',     name: 'Tổng quan',            icon: <LayoutDashboard size={20} /> },
    { path: '/officer/applications', name: 'Quản lý hồ sơ',        icon: <FileText size={20} /> },
    { path: '/officer/payments',     name: 'Quản lý thanh toán',   icon: <CreditCard size={20} /> },
    { path: '/officer/posts',        name: 'Quản lý bài đăng',     icon: <Newspaper size={20} /> },
    { path: '/officer/services',     name: 'Quản lý dịch vụ',      icon: <LayoutList size={20} /> },
    { path: '/officer/reviews',      name: 'Đánh giá hài lòng',    icon: <Star size={20} /> },
    { path: '/officer/feedbacks',    name: 'Phản ánh kiến nghị',   icon: <MessageSquare size={20} /> },
    { path: '/officer/reports',      name: 'Báo cáo & Thống kê',   icon: <BarChart3 size={20} /> },
    { path: '/officer/schedules',    name: 'Lịch công tác',        icon: <Calendar size={20} /> },
    { path: '/officer/settings',     name: 'Cài đặt',              icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  const fullName = localStorage.getItem('fullName') || 'Cán bộ';

  const notifTypeIcon = (type: string) => {
    if (type === 'new_submission') return <FileSearch size={14} className="text-blue-500 shrink-0 mt-0.5" />;
    if (type === 'near_deadline')  return <Clock      size={14} className="text-orange-500 shrink-0 mt-0.5" />;
    if (type === 'unpaid')         return <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />;
    return <Bell size={14} className="text-gray-400 shrink-0 mt-0.5" />;
  };

  const notifTypeBg = (type: string) => {
    if (type === 'new_submission') return 'bg-blue-50/50';
    if (type === 'near_deadline')  return 'bg-orange-50/50';
    if (type === 'unpaid')         return 'bg-red-50/40';
    return '';
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diff < 1)    return 'Vừa xong';
    if (diff < 60)   return `${diff} phút trước`;
    if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
    return d.toLocaleDateString('vi-VN');
  };

  // count unpaid notifications for sidebar badge
  const unpaidNotifCount = notifications.filter(n => n.type === 'unpaid' && !readIds.has(n.id)).length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex flex-col bg-[#a10e13] text-white">
        {/* Logo */}
        <div className="p-4 border-b border-red-800 flex items-center gap-3">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight uppercase tracking-wide">Cổng Dịch vụ công</h1>
            <p className="text-xs text-yellow-500">Cán bộ UBND Phường 11</p>
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 flex items-center gap-3 border-b border-red-800">
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-lg">
            {fullName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm">
              {fullName} <span className="inline-block w-2 h-2 rounded-full bg-green-400 ml-1" />
            </p>
            <p className="text-xs text-red-200">Bộ phận một cửa</p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 text-xs font-semibold text-red-300 mb-2 mt-2 uppercase tracking-wider">Menu chính</div>
          <nav className="space-y-1">
            {menuItems.map(item => {
              const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
              const isPayments = item.path === '/officer/payments';
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
                  {isPayments && unpaidNotifCount > 0 && !isActive && (
                    <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {unpaidNotifCount > 9 ? '9+' : unpaidNotifCount}
                    </span>
                  )}
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

        {/* Logout */}
        <div className="p-4 bg-red-900 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-100 hover:text-white transition w-full">
            <LogOut size={20} />
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
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
            {/* Quick-nav select */}
            <select
              className="bg-gray-100 border-none text-sm rounded-md py-1.5 px-3 outline-none text-gray-600 hidden md:block cursor-pointer hover:bg-gray-200 transition"
              onChange={e => { if (e.target.value) navigate(e.target.value); }}
              value=""
            >
              <option value="" disabled>Dịch vụ công Website</option>
              <option value="/officer/posts">📰 Quản lý bài đăng</option>
              <option value="/officer/services">📋 Quản lý danh mục dịch vụ</option>
              <option value="/officer/payments">💳 Quản lý thanh toán</option>
            </select>

            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotif(v => !v);
                  setShowUserMenu(false);
                  if (!showNotif) fetchNotifications();
                }}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 hover:text-gray-700"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-11 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  {/* Notif header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-red-700 to-orange-600">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Bell size={15} /> Thông báo cán bộ
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead}
                          className="text-white/80 hover:text-white text-[11px] underline underline-offset-2 transition">
                          Đọc tất cả
                        </button>
                      )}
                      <button onClick={() => setShowNotif(false)} className="text-white/70 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Notif body */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifLoading ? (
                      <div className="flex items-center justify-center gap-2 py-8 text-gray-400 text-sm">
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                        Đang tải...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-10 text-center text-gray-400">
                        <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Không có thông báo nào</p>
                        <p className="text-xs mt-1 text-gray-300">Hệ thống hoạt động bình thường</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map(n => {
                          const isRead = readIds.has(n.id);
                          return (
                            <div
                              key={n.id}
                              onClick={() => markRead(n.id)}
                              className={`px-4 py-3 hover:bg-gray-50 transition cursor-pointer ${isRead ? 'opacity-60' : notifTypeBg(n.type)}`}
                            >
                              <div className="flex gap-3">
                                {notifTypeIcon(n.type)}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                    {!isRead && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[11px] font-mono text-red-600 font-semibold">{n.applicationCode}</span>
                                    <span className="text-[11px] text-gray-400">{formatTime(n.time)}</span>
                                  </div>
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {(n.type === 'unpaid' || n.type === 'near_deadline' || n.type === 'new_submission') && (
                                      <button
                                        onClick={e => { e.stopPropagation(); navigate('/officer/applications'); setShowNotif(false); markRead(n.id); }}
                                        className="text-[11px] bg-red-700 text-white px-2 py-0.5 rounded hover:bg-red-800 transition"
                                      >
                                        Xem hồ sơ →
                                      </button>
                                    )}
                                    {n.type === 'unpaid' && (
                                      <button
                                        onClick={e => { e.stopPropagation(); navigate('/officer/payments'); setShowNotif(false); markRead(n.id); }}
                                        className="text-[11px] bg-orange-500 text-white px-2 py-0.5 rounded hover:bg-orange-600 transition"
                                      >
                                        Quản lý phí →
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Notif footer */}
                  <div className="px-4 py-2.5 border-t bg-gray-50 flex justify-between items-center">
                    <button onClick={fetchNotifications}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                      Làm mới
                    </button>
                    <button
                      onClick={() => { navigate('/officer/payments'); setShowNotif(false); }}
                      className="text-xs text-red-600 hover:underline font-medium"
                    >
                      Quản lý thanh toán →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => { setShowUserMenu(v => !v); setShowNotif(false); }}
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

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                    <p className="text-xs text-gray-500">Cán bộ bộ phận một cửa</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { navigate('/officer/settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <User size={16} className="text-gray-400" /> Hồ sơ cá nhân
                    </button>
                    <button onClick={() => { navigate('/officer/settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <KeyRound size={16} className="text-gray-400" /> Đổi mật khẩu
                    </button>
                    <button onClick={() => { navigate('/officer/settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <Settings size={16} className="text-gray-400" /> Cài đặt
                    </button>
                    <div className="border-t my-1" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
