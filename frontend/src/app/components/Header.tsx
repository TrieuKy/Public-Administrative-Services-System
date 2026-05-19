import { Home, User as UserIcon, Settings, LogOut, ChevronDown, Phone, Mail, X, Bell, CheckCircle, AlertCircle, Clock, CreditCard, Info, Megaphone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

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
                DỊCH VỤ CÔNG PHƯỜNG 11
              </div>
              <div className="text-sm text-gray-600 mt-0.5">
                Kết nối thông tin và dịch vụ hành chính Phường 11
              </div>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell — only for logged in users */}
            {user && <NotificationBell />}

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

// ── Notification Bell Component ──────────────────────────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'procedure' | 'system'>('procedure');
  const [applications, setApplications] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('notif_read') || '[]')); }
    catch { return new Set(); }
  });
  const ref = useRef<HTMLDivElement>(null);

  // System news (static demo — có thể fetch từ API posts sau này)
  const systemNews = [
    {
      id: 1,
      title: 'Hệ thống bảo trì định kỳ',
      body: 'Hệ thống sẽ bảo trì từ 22:00 – 23:00 ngày 15/05/2026. Vui lòng hoàn thành giao dịch trước thời gian trên.',
      time: '2 giờ trước',
      icon: 'info',
    },
    {
      id: 2,
      title: 'Cập nhật biểu mẫu khai sinh mới',
      body: 'Biểu mẫu đăng ký khai sinh đã được cập nhật theo Thông tư 01/2024. Vui lòng sử dụng mẫu mới khi nộp hồ sơ.',
      time: '1 ngày trước',
      icon: 'info',
    },
    {
      id: 3,
      title: 'Thông báo nghỉ lễ 30/4 – 1/5',
      body: 'UBND Xã/Phường nghỉ lễ từ ngày 30/4 đến 1/5/2026. Hồ sơ sẽ được tiếp nhận trở lại từ ngày 2/5/2026.',
      time: '5 ngày trước',
      icon: 'megaphone',
    },
  ];

  // Fetch applications when bell opens
  useEffect(() => {
    if (open) {
      axiosInstance.get('/applications?limit=20')
        .then(res => setApplications(res.data?.data?.applications || []))
        .catch(() => {});
    }
  }, [open]);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Persist readIds to localStorage
  const markRead = (id: string) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('notif_read', JSON.stringify([...next]));
      return next;
    });
  };

  const markAllRead = () => {
    const allIds = procedureNotifs.map(n => n.id);
    setReadIds(prev => {
      const next = new Set(prev);
      allIds.forEach(id => next.add(id));
      localStorage.setItem('notif_read', JSON.stringify([...next]));
      return next;
    });
  };

  // Generate procedure notifications from applications
  const procedureNotifs = applications.flatMap(app => {
    const notifs: { id: string; title: string; body: string; type: string; appCode: string }[] = [];
    if (app.status === 'PENDING') {
      notifs.push({
        id: `pd-${app.id}`,
        title: 'Hồ sơ đã được tiếp nhận',
        body: `Hồ sơ ${app.applicationCode} (${app.service?.name}) đã nộp thành công và đang chờ cán bộ xem xét.`,
        type: 'info',
        appCode: app.applicationCode,
      });
    }
    if (app.status === 'NEED_MORE') {
      notifs.push({
        id: `nm-${app.id}`,
        title: 'Yêu cầu bổ sung hồ sơ',
        body: `Hồ sơ ${app.applicationCode} (${app.service?.name}) cần bổ sung tài liệu theo yêu cầu cán bộ.`,
        type: 'warning',
        appCode: app.applicationCode,
      });
    }
    if (app.status === 'PROCESSING') {
      notifs.push({
        id: `pr-${app.id}`,
        title: 'Hồ sơ đang được xử lý',
        body: `Hồ sơ ${app.applicationCode} (${app.service?.name}) đang trong quá trình xem xét bởi cán bộ.`,
        type: 'info',
        appCode: app.applicationCode,
      });
    }
    if (app.status === 'COMPLETED') {
      notifs.push({
        id: `cp-${app.id}`,
        title: 'Hồ sơ đã hoàn thành',
        body: `Hồ sơ ${app.applicationCode} (${app.service?.name}) đã được duyệt và hoàn thành. Bạn có thể đến nhận kết quả.`,
        type: 'success',
        appCode: app.applicationCode,
      });
    }
    if (app.status === 'REJECTED') {
      notifs.push({
        id: `rj-${app.id}`,
        title: 'Hồ sơ bị từ chối',
        body: `Hồ sơ ${app.applicationCode} (${app.service?.name}) đã bị từ chối. Vui lòng xem lý do chi tiết.`,
        type: 'error',
        appCode: app.applicationCode,
      });
    }
    // Payment notification: paymentStatus field (added to Application model)
    if (app.paymentStatus === 'UNPAID' && (app.service?.currentFee || app.service?.fee) > 0) {
      notifs.push({
        id: `up-${app.id}`,
        title: 'Chưa đóng lệ phí',
        body: `Hồ sơ ${app.applicationCode} chưa được thanh toán lệ phí. Vui lòng vào trang Thanh toán trực tuyến.`,
        type: 'payment',
        appCode: app.applicationCode,
      });
    }
    return notifs;
  });

  const unreadProcedure = procedureNotifs.filter(n => !readIds.has(n.id));
  const totalUnread = unreadProcedure.length + systemNews.length;

  const typeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />;
      case 'warning': return <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />;
      case 'error':   return <X size={16} className="text-red-500 shrink-0 mt-0.5" />;
      case 'payment': return <CreditCard size={16} className="text-purple-500 shrink-0 mt-0.5" />;
      default:        return <Clock size={16} className="text-blue-500 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        id="notification-bell-btn"
        onClick={() => setOpen(prev => !prev)}
        className="relative w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition"
        title="Thông báo"
      >
        <Bell size={20} className={open ? 'text-orange-600' : 'text-gray-600'} />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[100] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-red-700 to-orange-600">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Bell size={16} />
              Thông báo của tôi
            </div>
            <div className="flex items-center gap-2">
              {unreadProcedure.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-white/80 hover:text-white text-[11px] underline underline-offset-2 transition"
                >
                  Đọc tất cả
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('procedure')}
              className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition border-b-2 ${
                activeTab === 'procedure'
                  ? 'border-red-600 text-red-700 bg-red-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Clock size={13} />
              Thủ tục của tôi
              {unreadProcedure.length > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                  {unreadProcedure.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition border-b-2 ${
                activeTab === 'system'
                  ? 'border-blue-600 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Megaphone size={13} />
              Tin tức hệ thống
              <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                {systemNews.length}
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[380px] overflow-y-auto">
            {activeTab === 'procedure' && (
              procedureNotifs.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  <CheckCircle size={36} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">Không có thông báo nào</p>
                  <p className="text-xs text-gray-400 mt-1">Mọi hồ sơ của bạn đang ổn</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {procedureNotifs.map(n => {
                    const isRead = readIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`px-4 py-3 hover:bg-gray-50 transition cursor-pointer ${
                          isRead ? 'opacity-60' : n.type === 'payment' ? 'bg-purple-50/40' : 'bg-blue-50/30'
                        }`}
                      >
                        <div className="flex gap-3">
                          {typeIcon(n.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                              {!isRead && (
                                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                            <p className="text-xs text-red-600 font-mono mt-1 font-semibold">{n.appCode}</p>
                            {n.type === 'payment' && (
                              <Link
                                to="/payment"
                                onClick={() => { setOpen(false); markRead(n.id); }}
                                className="inline-block mt-1 text-xs bg-purple-600 text-white px-2 py-0.5 rounded font-medium hover:bg-purple-700 transition"
                              >
                                Thanh toán ngay →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {activeTab === 'system' && (
              <div className="divide-y divide-gray-100">
                {systemNews.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition">
                    <div className="flex gap-3">
                      {n.icon === 'megaphone'
                        ? <Megaphone size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        : <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t bg-gray-50 flex justify-between items-center">
            <span className="text-xs text-gray-400">Tự động cập nhật khi mở</span>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="text-xs text-red-600 hover:underline font-medium"
            >
              Xem tất cả hồ sơ →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}