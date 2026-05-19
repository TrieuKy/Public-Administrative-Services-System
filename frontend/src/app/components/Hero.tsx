import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

const CATEGORY_LABELS: Record<string, string> = {
  individual:   'Cá nhân',
  business:     'Doanh nghiệp',
  organization: 'Tổ chức',
};

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch danh sách dịch vụ một lần
  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/services?limit=100')
      .then(res => setAllServices(res.data?.data?.services || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter suggestions khi gõ
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setSuggestions([]); setShowDropdown(false); return; }
    const filtered = allServices.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      CATEGORY_LABELS[s.category]?.toLowerCase().includes(q)
    ).slice(0, 7);
    setSuggestions(filtered);
    setShowDropdown(true);
    setActiveIndex(-1);
  }, [searchQuery, allServices]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    setShowDropdown(false);
    navigate(`/service-form?search=${encodeURIComponent(q)}`);
  };

  const handleSelectService = (service: any) => {
    setSearchQuery(service.name);
    setShowDropdown(false);
    navigate(`/dich-vu/${service.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter') handleSearch();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        handleSelectService(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div
      className="relative bg-gradient-to-r from-orange-200/40 via-orange-100/30 to-orange-200/40 overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(251, 146, 60, 0.08), rgba(254, 215, 170, 0.05), rgba(251, 146, 60, 0.08))',
        backgroundSize: 'cover'
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-20 0a20 20 0 1 0 40 0a20 20 0 1 0 -40 0' fill='%23B91C1C' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div ref={dropdownRef} className="relative">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                  placeholder="Nhập tên dịch vụ cần tìm kiếm..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSuggestions([]); setShowDropdown(false); inputRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded shadow-sm transition whitespace-nowrap font-medium flex items-center gap-2"
              >
                <Search size={16} /> Tìm kiếm
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 md:right-[148px] mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-500 font-medium flex items-center justify-between">
                  <span>Gợi ý dịch vụ ({suggestions.length} kết quả)</span>
                  {loading && <span className="w-3 h-3 border border-gray-300 border-t-amber-500 rounded-full animate-spin" />}
                </div>
                {suggestions.map((svc, idx) => (
                  <button
                    key={svc.id}
                    onClick={() => handleSelectService(svc)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition border-b last:border-0 group ${
                      idx === activeIndex ? 'bg-amber-50 text-amber-900' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{svc.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {CATEGORY_LABELS[svc.category] || svc.category}
                        {svc.processingTime && ` · ${svc.processingTime}`}
                        {svc.fee && ` · ${svc.fee}`}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-500 shrink-0" />
                  </button>
                ))}
                <div className="px-4 py-2 bg-gray-50 border-t">
                  <button
                    onClick={handleSearch}
                    className="text-xs text-amber-700 hover:underline font-medium"
                  >
                    Xem tất cả kết quả cho "{searchQuery}" →
                  </button>
                </div>
              </div>
            )}

            {showDropdown && searchQuery.trim() && suggestions.length === 0 && !loading && (
              <div className="absolute top-full left-0 right-0 md:right-[148px] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-4 py-5 text-center">
                <p className="text-sm text-gray-500">Không tìm thấy dịch vụ nào cho "<span className="font-medium text-gray-700">{searchQuery}</span>"</p>
                <p className="text-xs text-gray-400 mt-1">Thử từ khóa khác hoặc xem danh sách tất cả dịch vụ</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Link to="/service-form">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-lg shadow-md transition">
              Dịch vụ công trực tuyến
            </button>
          </Link>
          <Link to="/tracking">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-lg shadow-md transition">
              Tra cứu hồ sơ
            </button>
          </Link>
          <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 rounded-lg shadow-md transition">
            Dịch vụ công liên thông: Khai sinh, Khai tử
          </button>
        </div>
      </div>
    </div>
  );
}